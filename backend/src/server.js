const express = require('express')
const cors = require('cors')
const connection = require('./lib/db_config')
const app = express()
const multer = require('multer')
const { encryptPassword, comparePassword } = require('./lib/bcrypt')
const { z } = require('zod')
const { signJwt } = require('./lib/token')
const { autenticarToken } = require('./middlewares/autenticacaoMiddleware')
const path = require('path')

app.use(cors())
app.use(express.json())
app.use('/assets', express.static(path.join(__dirname, '..', '..', 'assets'))) //deixa a imagem publica

const port = 3000

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const assets_dir = path.join(__dirname, '..', '..', 'assets')
        cb(null, assets_dir)
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname)
        cb(null, uniqueName)
    }
})

const upload = multer({ storage: storage })

app.post('/fotos/postagem', autenticarToken, upload.single('url'), (req, res) => {
    const autor_id = req.usuario.id
    const { descricao } = req.body
    const imagePath = req.file ? `/assets/${req.file.filename}` : null //verificar

    const query = 'INSERT INTO fotografia (descricao, url, autor_id) VALUES (?, ?, ?)'

    connection.query(query, [descricao, imagePath, autor_id], (err, result) => {
        if (err) {
            console.log('Erro ao salvar o post', err)
            return res.status(500).json({ success: false, message: 'Erro ao criar post' })
        }
        res.json({ success: true, message: 'Post criado com sucesso', id: result.insertId })
    })
})

app.post('/usuario/cadastro', async (req, res) => {
    const cadastroUsuarioEsquema = z.object({
        nome: z.string().max(20, { message: 'O nome deve ter no máximo 20 caracteres' }),
        email: z.email({ message: 'Formato de e-mail inválido' }),
        senha: z.string().min(5, {message: 'A senha deve ter no mínimo 5 caracteres'}).max(20, {message: 'A senha deve ter no máximo 20 caracteres'})
    })

    const validacao = cadastroUsuarioEsquema.safeParse(req.body)

    if (!validacao.success) {
        return res.status(400).json({ success: false, error: validacao.error.issues[0].message })
    }

    const { nome, email, senha } = validacao.data

    try {
        const senhaCriptografada = await encryptPassword(senha)

        const query = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)'

        connection.query(query, [nome, email, senhaCriptografada], (err, results) => {
            console.log(err)
            if (err) {  
                return res.status(500).json({ success: false, message: 'Erro no servidor' })
            }

            const token = signJwt({ id: results.insertId})

            if(!token) {
                res.status(500).json({ success: false})
            }
            res.status(201).json({ success: true, results, message: 'Sucesso no cadastro!', token })

        })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao processar a senha!' })
    }
})

app.post('/usuario/login', (req, res) => {
    const loginUsuarioEsquema = z.object({
        nome: z.string().max(20),
        senha: z.string().min(5).max(20)
    })

    const validacao = loginUsuarioEsquema.safeParse(req.body)

    if (!validacao.success) {
        console.log(validacao)
        return res.status(400).json({ success: false, errors: validacao.error.errors })
    }

    const { nome, senha } = validacao.data

    const query = 'SELECT * FROM usuario WHERE nome = ?'
    connection.query(query, [nome], async (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor' })
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuário ou senha incorretos!' })
        }

        const user = results[0]

        try {
            const senhaCerta = await comparePassword(senha, user.senha)

            if (senhaCerta) {
                const token = signJwt({ id: user.id})
                if(!token) {
                    res.status(500).json({ success: false})
                }

                res.json({ success: true, message: 'Sucesso no login!', data: user, token })

            } else {
                res.status(401).json({ success: false, message: 'Usuário ou senha incorretos!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Erro ao verificar senha' })
        }
    })
})

app.get("/me", autenticarToken, async (req, res) => {
    try {
        const [results] = await connection.promise().query(
            "SELECT id, nome, email, imagemPerfil FROM usuario WHERE id = ?",
            [req.usuario.id]
        );

        if (results.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado", success: false });
        }

        return res.json({ message: "Sucesso", success: true, data: results[0] });
    } catch (err) {
        return res.status(500).json({ message: "Erro", success: false, error: err.message });
    }
});

app.get("/fotos/minhas", autenticarToken, async (req, res) => { 
    try {
        const autor_id = req.usuario.id

        const query = 'SELECT url, descricao, id FROM fotografia WHERE autor_id = ? ORDER BY id DESC'

        const [results] = await connection.promise().query(query, [autor_id])

        return res.json({ success: true, message: 'fotos do usuário listadas com sucesso', data: results })
    } catch (err) {
        console.log('Erro ao buscar fotos do usuário', err)
        return res.status(500).json({ success: false, message: 'erro ao buscar fotos do usuário', error: err.message })
    }
})

app.get("/fotos/:id", async (req, res) => {
    try {
        const { id } = req.params;


        const query = ` SELECT f.id, f.titulo, f.descricao, f.url, f.curtidas, f.media_avaliacao, u.nome AS autorNome, u.imagemPerfil AS autorImagemPerfil, (SELECT COUNT(*) FROM comentario c WHERE c.fotografia = f.id) AS totalComentarios, 0 AS totalSalvos  FROM fotografia f JOIN usuario u ON f.autor_id = u.id WHERE f.id = ?; `;

        const [results] = await connection.promise().query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Foto não encontrada' });
        }

        return res.json({ success: true, message: 'Foto listada com sucesso', data: results[0] });
    } catch (err) {
        console.log('Erro ao buscar a foto', err);
        return res.status(500).json({ success: false, message: 'Erro ao buscar a foto', error: err.message });
    }
});

app.put("/usuario", autenticarToken, (req, res) => {
    const cadastroUsuarioEsquema = z.object({
        nome: z.string().max(20, { message: "O nome deve ter no máximo 20 caracteres" }),
        email: z.email({ message: "Formato de e-mail inválido" }),
        senha: z.string().min(5, { message: "A senha deve ter no mínimo 5 caracteres" }).max(20, { message: "A senha deve ter no máximo 20 caracteres" }),
    });

    const validacao = cadastroUsuarioEsquema.safeParse(req.body);

    if (!validacao.success) {
        return res.status(400).json({ success: false, error: validacao.error.issues[0].message });
    }

    const id = req.usuario.id;
    const { nome, email, senha } = validacao.data;

    const query = "UPDATE usuario SET nome = ?, email = ?, senha = ? WHERE id = ?";

    connection.query(query, [nome, email, senha, id], (err, result) => {
        if (err) {
            return res.status(500).json({success: false, err, message: "Erro ao editar usuário!",});
        }

        res.json({success: true, message: "Usuário editado com sucesso!", data: result,
        });
    });
});

app.delete("/usuario", autenticarToken, (req, res) => {
    const id = req.usuario.id;
    const query = "DELETE FROM usuario WHERE id = ?";

    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({success: false, err, message: "Erro ao excluir usuário!",});
        }

        res.json({success: true, message: "Usuário excluído com sucesso!", data: result,
        });
    });
})

app.get("/fotos/:id/comentarios", async (req, res) => {
    try {
        const { id } = req.params;

        const query = ` SELECT c.texto, c.criadoEm, u.nome AS autorNome, u.imagemPerfil AS autorImagemPerfil FROM comentario c JOIN usuario u ON c.autor_id = u.id WHERE c.fotografia = ? ORDER BY c.criadoEm DESC;`;

        const [results] = await connection.promise().query(query, [id]);

        return res.json({ success: true, message: 'Comentários listados com sucesso', data: results });
    } catch (err) {
        console.log('Erro ao buscar comentários', err);
        return res.status(500).json({ success: false, message: 'Erro ao buscar comentários', error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})
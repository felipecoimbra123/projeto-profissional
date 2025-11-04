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

// Adicione a função de decodificar token, ou importe
// const jwt = require('jsonwebtoken'); // Exemplo
// const SECRET = 'seu_segredo'; // Exemplo

// ... (código anterior do backend) ...

// **NOTA:** Você deve ter 'jsonwebtoken' importado e 'SECRET' definido
// const jwt = require('jsonwebtoken');
// const SECRET = 'sua_chave_secreta_aqui';

app.get("/fotos/:id", async (req, res) => {
    // 1. Tenta obter o token e decodificar o ID do usuário
    let loggedUserId = 0; // Padrão: 0 (para consultas de like/save)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Assume 'Bearer <token>'

    if (token) {
        try {
            // **DECODIFICA O TOKEN AQUI**
            const decoded = jwt.verify(token, SECRET); // Use sua chave secreta real
            loggedUserId = decoded.id; 
        } catch (error) {
            // Token inválido, continua como não logado (loggedUserId = 0)
            console.warn("Token de autenticação fornecido é inválido ou expirou.", error.message);
        }
    }
    
    try {
        const { id } = req.params;
        
        // A lógica de consulta permanece a mesma, mas agora usa o 'loggedUserId'
        const query = ` 
            SELECT 
                f.id, 
                f.titulo, 
                f.descricao, 
                f.url, 
                COALESCE(SUM(CASE WHEN l.post_id IS NOT NULL THEN 1 ELSE 0 END), 0) AS curtidas, 
                f.media_avaliacao, 
                u.nome AS autorNome, 
                u.imagemPerfil AS autorImagemPerfil, 
                (SELECT COUNT(*) FROM comentario c WHERE c.fotografia = f.id) AS totalComentarios, 
                COALESCE(SUM(CASE WHEN fav.post_id IS NOT NULL THEN 1 ELSE 0 END), 0) AS totalSalvos, 
                MAX(CASE WHEN l_user.user_id = ? THEN 1 ELSE 0 END) AS curtidoPeloUsuario,
                MAX(CASE WHEN fav_user.user_id = ? THEN 1 ELSE 0 END) AS salvoPeloUsuario
            FROM 
                fotografia f 
            JOIN 
                usuario u ON f.autor_id = u.id 
            LEFT JOIN
                likes l ON f.id = l.post_id
            LEFT JOIN
                favorites fav ON f.id = fav.post_id
            LEFT JOIN 
                likes l_user ON f.id = l_user.post_id AND l_user.user_id = ?
            LEFT JOIN 
                favorites fav_user ON f.id = fav_user.post_id AND fav_user.user_id = ?
            WHERE 
                f.id = ?
            GROUP BY
                f.id, f.titulo, f.descricao, f.url, f.media_avaliacao, u.nome, u.imagemPerfil;
        `;

        // Os parâmetros da query agora usam a variável 'loggedUserId'
        const [results] = await connection.promise().query(query, [loggedUserId, loggedUserId, loggedUserId, loggedUserId, id]);
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Foto não encontrada.' });
        }

        return res.json({ success: true, data: results[0] });
    } catch (err) {
        console.error("Erro ao buscar a foto:", err);
        return res.status(500).json({ success: false, message: 'Erro interno ao buscar a foto', error: err.message });
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

app.post("/fotos/:id/comentar", autenticarToken, async (req, res) => {
    const comentarioEsquema = z.object({
        texto: z.string().max(255, { message: 'O comentário deve ter no máximo 255 caracteres' }).min(1, { message: 'O comentário não pode ser vazio' })
    });

    const validacao = comentarioEsquema.safeParse(req.body);

    if (!validacao.success) {
        return res.status(400).json({ success: false, error: validacao.error.issues[0].message });
    }

    try {
        const fotografia_id = req.params.id;
        const autor_id = req.usuario.id;
        const { texto } = validacao.data;

        const query = 'INSERT INTO comentario (texto, fotografia, autor_id) VALUES (?, ?, ?)';

        const [result] = await connection.promise().query(query, [texto, fotografia_id, autor_id]);

        return res.status(201).json({ success: true, message: 'Comentário adicionado com sucesso', id: result.insertId });
    } catch (err) {
        console.error('Erro ao postar comentário:', err);
        return res.status(500).json({ success: false, message: 'Erro interno ao adicionar comentário', error: err.message });
    }
});

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

app.post("/fotos/:postId/like", autenticarToken, (req, res) => {
    const { postId } = req.params;
    const userId = req.usuario.id; // Usuário autenticado pelo middleware

    // 1. Verificar se o like já existe
    const checkQuery = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ?';
    connection.query(checkQuery, [postId, userId], (err, results) => {
        if (err) {
            console.error('Erro no servidor (check like):', err);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }

        if (results.length > 0) {
            // Se o like existe: REMOVER (Dislike)
            const deleteQuery = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
            connection.query(deleteQuery, [postId, userId], (err) => {
                if (err) {
                    console.error('Erro ao remover like:', err);
                    return res.status(500).json({ success: false, message: 'Erro ao remover like' });
                }
                // Retorna que o like foi removido
                return res.json({ success: true, liked: false, message: 'Like removido' });
            });
        } else {
            // Se o like não existe: INSERIR (Like)
            const insertQuery = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
            connection.query(insertQuery, [postId, userId], (err) => {
                if (err) {
                    console.error('Erro ao adicionar like:', err);
                    return res.status(500).json({ success: false, message: 'Erro ao adicionar like' });
                }
                // Retorna que o like foi adicionado
                return res.status(201).json({ success: true, liked: true, message: 'Like adicionado' });
            });
        }
    });
});
  
  app.post("/fotos/:postId/favorite", autenticarToken, async (req, res) => {
    const { postId } = req.params;
    const userId = req.usuario.id;
  
    const checkQuery = 'SELECT * FROM favorites WHERE post_id = ? AND user_id = ?';
    connection.query(checkQuery, [postId, userId], (err, results) => {
        if (err) {
            console.error('Erro no servidor (check saves):', err);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }

        if (results.length > 0) {
            const deleteQuery = 'DELETE FROM favorites WHERE post_id = ? AND user_id = ?';
            connection.query(deleteQuery, [postId, userId], (err) => {
                if (err) {
                    console.error('Erro ao remover salvamento:', err);
                    return res.status(500).json({ success: false, message: 'Erro ao remover salvamento' });
                }
                return res.json({ success: true, saved: false, message: 'Salvamento removido' });
            });
        } else {
            const insertQuery = 'INSERT INTO favorites (post_id, user_id) VALUES (?, ?)';
            connection.query(insertQuery, [postId, userId], (err) => {
                if (err) {
                    console.error('Erro ao adicionar salvamento:', err);
                    return res.status(500).json({ success: false, message: 'Erro ao adicionar salvamento' });
                }
                return res.status(201).json({ success: true, saved: true, message: 'Salvamento adicionado' });
            });
        }
    });
  });

  
  app.get("/fotos", async (req, res) => {
    try {
        // Consulta SQL para buscar a ID, URL e descrição da foto, e o nome do autor
        const query = `
            SELECT 
                f.id, 
                f.url, 
                f.descricao, 
                u.nome AS autorNome 
            FROM 
                fotografia f 
            JOIN 
                usuario u ON f.autor_id = u.id 
            ORDER BY 
                f.id DESC; 
        `;

        const [results] = await connection.promise().query(query);

        return res.json({ 
            success: true, 
            message: 'Fotos listadas com sucesso', 
            data: results 
        });
    } catch (err) {
        console.error('Erro ao buscar todas as fotos:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Erro interno ao buscar as fotos', 
            error: err.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})
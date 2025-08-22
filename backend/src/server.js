const express = require('express')
const cors = require('cors')
const connection = require('./lib/db_config')
const app = express()
const { encryptPassword, comparePassword } = require('./lib/bcrypt')
const { z } = require('zod')
const { signJwt } = require('./lib/token')
const { autenticarToken } = require('./middlewares/autenticacaoMiddleware')

app.use(cors())
app.use(express.json())

const port = 3000

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
    // Usando promise() para poder await
    const [results] = await connection.promise().query(
      "SELECT * FROM usuario WHERE id = ?",
      [req.usuario.id]
    );

    // Retorna sucesso com os dados
    return res.json({ message: "Sucesso", success: true, data: results });
  } catch (err) {
    // Retorna erro caso algo dê errado
    return res.status(500).json({ message: "Erro", success: false, error: err.message });
  }
});

app.put('/usuario/:id', (req, res) => {
    const cadastroUsuarioEsquema = z.object({
        nome: z.string().max(20, { message: 'O nome deve ter no máximo 20 caracteres' }),
        email: z.email({ message: 'Formato de e-mail inválido' }),
        senha: z.string().min(5, {message: 'A senha deve ter no mínimo 5 caracteres'}).max(20, {message: 'A senha deve ter no máximo 20 caracteres'})
    })

    const validacao = cadastroUsuarioEsquema.safeParse(req.body)

    if (!validacao.success) {
        return res.status(400).json({ success: false, error: validacao.error.issues[0].message })
    }

    const { id } = req.params
    const { nome, email, senha } = validacao.data

    const query = 'UPDATE usuario SET nome = ?, email = ?, senha = ? WHERE id = ?' 
    connection.query(query, [nome, email, senha, id], (err) => {
        if(err) {
            return res.status(500).json({ success: false, err, message: 'Erro ao editar usuário!' })
        }

        const novoToken = jwt.sign({ id, nome, email }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.json({ success: true, message: 'Usuário editado com sucesso!', token: novoToken })
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})
const express = require('express')
const cors = require('cors')
const connection = require('./lib/db_config')
const app = express()
const { encryptPassword, comparePassword } = require('./lib/bcrypt')

app.use(cors())
app.use(express.json())

const port = 3000

app.post('/usuario/cadastro', async (req, res) => {
    const {nome, email, senha} = req.body
    try {
        const senhaCriptografada = await encryptPassword(senha)

        const query = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)'
        connection.query(query, [nome, email, senhaCriptografada], (err, results) => {
            res.status(201).json({ success: true, results, message: 'Sucesso no cadastro!' })
        })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao processar a senha!'})
    }
})

app.post('/usuario/login', (req, res) => {
    const {nome, senha} = req.body

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
                res.json({ success: true, message: 'Sucesso no login!', data: user })
            } else {
                res.status(401).json({ success: false, message: 'Usuário ou senha incorretos!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Erro ao verificar senha' })
        }
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})
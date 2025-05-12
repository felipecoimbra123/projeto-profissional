const express = require('express')
const cors = require('cors')
const connection = require('./db_config')
const app = express()

app.use(cors())
app.use(express.json())

const port = 3000

app.post('/usuario/cadastro', (req, res) => {
    const {nome, email, senha} = req.body

    const query = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)'
    connection.query(query, [nome, email, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, err, message: 'Erro no servidor' })
        }
        res.status(201).json({ success: true, results, message: 'Sucesso no cadastro!' })
    })
})
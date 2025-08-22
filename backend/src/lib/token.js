const jwt = require('jsonwebtoken')
require('dotenv/config')

const signJwt = (payload) => {
    const secret = process.env.JWT_SECRET || "teste" //Pega o secret do arquivo dotenv

    try {
        return jwt.sign(payload, secret, { expiresIn: '1d' } ) // expiresIn quer dizer que o token vai durar um dia, dps fica inválido(quer dizer que ele vai ficar 1 dia logado)
    }
    catch (err) {
        console.error('O login do JWT falhou!', error)
        return null //Quer dizer que pode retornar nulo (se der isso da errado)
    }
}

//Ver se o token ta certo

const verifyJwt = (token) => {
    const secret = process.env.JWT_SECRET || "teste"
    
    try {
        return jwt.verify(token, secret)
    }
    catch (err) {
        console.error('Verificação do JWT falhou!', err)
        return null
    }
}

module.exports = {
    signJwt,
    verifyJwt,
}
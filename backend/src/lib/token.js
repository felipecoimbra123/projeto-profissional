const jwt = require('jsonwebtoken')
require('dotenv/config') // lê .env

const JWT_SECRET = process.env.JWT_SECRET || "teste"; // fallback se não tiver .env

// Gera token
const signJwt = (payload) => {
    try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    } catch (err) {
        console.error('Falha ao criar JWT!', err);
        return null;
    }
};

// Verifica token
const verifyJwt = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error('Falha na verificação do JWT!', err);
        return null;
    }
};

module.exports = { signJwt, verifyJwt };

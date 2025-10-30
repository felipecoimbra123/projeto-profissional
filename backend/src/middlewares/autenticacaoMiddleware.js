const { verifyJwt } = require('../lib/token');

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token mal formatado' });
    }

    const decoded = verifyJwt(token);

    if (!decoded) {
        return res.status(403).json({ success: false, message: 'Token inválido ou expirado' });
    }

    req.usuario = decoded; // coloca info do usuário na requisição
    next();
};

module.exports = { autenticarToken };

// Third part modules
const jwt = require('jsonwebtoken')

// App modules
const configJWT = require('../configs/jwt.js')

// Check if token is authorized
function verify(req, res, next) {

    let token
    let payload

    if(!req.headers.authorization) {
        return res.status(401).send({message: "Você não está autorizado"})
    }

    token = req.headers.authorization.split(' ')[1]

    try {
        payload = jwt.verify(token, configJWT.secretKey)
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            res.status(401).send({message: 'Token expirado'})
        } else {
            res.status(401).send({message: 'Falha de autenticação'})
        }

        return
    }

    next()
}

module.exports.verify = verify

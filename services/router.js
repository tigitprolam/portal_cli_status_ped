// Node.js native modules
// ...


// Third part modules
const express = require('express')
const router = new express.Router()


// App modules

// Authorization module
const authorization = require('../controllers/authorization.js')


// APIs Logix

const pedidos = require('../controllers/pedidos.js')


// APIs específicas Prolam

//const titulos = require('../controllers/titulos.js') // coloquei no backup
//const estped = require('../controllers/prolam/pedidos.js')

// Rotas para Logix

router.route('/pedidos/:cod_cliente')
    //.get(authorization.verify)
    .get(pedidos.get)


// APIs específicas Prolam

//router.route('/titulos/:empresa?/:docum?')
//    .get(authorization.verify)
//    .get(titulos.get)

//router.route('/estped/:empresa?/:pedido?')
//    .get(authorization.verify)
//    .get(estped.get)


module.exports = router

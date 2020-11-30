
//TODO: em vez de sempre apresentar que o servidor está escutando em localhost,
//       apresentar em quais IPs ele está disponível
//      Porque eu poderia estar, por exemplo, dentro de uma VM ou Docker

const http = require('http')
const path = require('path')

//const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const exphbs = require('express-handlebars')

const configWebServer = require('../configs/web_server.js')

const router = require('../services/router.js')

// Services linked to the static webpage
const pedidos = require('../services/logix/pedidos.js')

let pedidosPeriodo = []

let httpServer

function initialize() {
    return new Promise( (resolve, reject) => {
        const app = express()

        // Set static folder
        app.use(express.static(path.join(__dirname, '/public')))

        //app.use(cors())

        // Handlebars
        app.engine('handlebars', exphbs())
        app.set('view engine', 'handlebars')

        // Body parse Middleware
        app.use(express.json())
        app.use(express.urlencoded({ extended: false }))

        httpServer = http.createServer(app)

        app.use(morgan('combined'))

        // Router
        app.use('/api', router)

        let contexto = {}

        app.post('/consulta', async (req, res) => {
            contexto = {
                cod_cliente: req.body.cnpj,
                situacao: req.body.situacao,
                dataInicial: req.body.dataInicial,
                dataFinal: req.body.dataFinal
            }

            try {
                pedidosPeriodo = await pedidos.consulta(contexto)
                //res.json(pedidosPeriodo.dados)
                res.redirect('/')
            } catch(erro) {
                res.json(`{ message ${erro}`)
            }

        })

        // Homepage route
        app.get('/', async (req, res) => res.render('index', {
            title: 'Pedidos cliente',
            pedidosPeriodo
        }))

        // Web Server
        httpServer.listen(configWebServer.port)
            .on('listening', () => {
                console.log(`Servidor Web escutando em: localhost:${configWebServer.port}`)
            })
            .on('error', err => {
                reject(err)
            })
    })
}

module.exports.initialize = initialize

function close() {
    return new Promise( (resolve, reject) => {
        httpServer.close( (err) => {
            if (err) {
                reject(err)
                return
            }

            resolve()
        })
    })
}

module.exports.close = close

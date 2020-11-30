const webServer = require('../services/web_server.js')
const configOracleDB = require('../configs/oracle_db.js')
const oracle_db = require('../services/oracle_db.js')

const defaultThreadPoolSize = 10

// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = configOracleDB.logixPool.poolMax + defaultThreadPoolSize

async function startup() {
    console.log('Iniciando aplicação...')

    console.log

    try {
        console.log('Inicializando módulo: Banco de dados...')

        await oracle_db.initialize()
    } catch (err) {
        console.error(err)

        process.exit(1)
    }

    try { 
        console.log('Inicializando módulo: Servidor Web...')

        await webServer.initialize()
    } catch (err) {
        console.error(err)
        
        process.exit(1)
    }
}

startup()

async function shutdown(e) {
    let err = e

    console.log('Finalizando aplicação...')

    try {
        console.log('Encerrando módulo: Servidor Web...')

        await webServer.close()
    } catch (e) {
        console.log('Erro ao encerrar Servidor Web', e)

        err = err || e
    }

    try {
        console.log('Encerrando módulo: Banco de dados...')

        await oracle_db.close()
    } catch (err) {
        console.log('Erro encontrado', e)

        err = err || e
    }

    console.log('Saindo do processo')

    if (err) {
        process.exit(1)
    } else {
        process.exit(0)
    }
}

process.on('SIGTERM', () => {
    console.log('Recebido SIGTERM')

    shutdown()
})

process.on('SIGINT', () => {
    console.log('Recebido SIGINT')

    shutdown()
})

process.on('uncaughtException', err => {
    console.log('Exceção não capturada')
    console.error(err)

    shutdown(err)
})
// Node.js native modules
// ...

// Third part modules
//const express = require('express')

// App modules
const pedidos = require('../../models/pedidos.js')


// Get method

async function consulta(contexto) {

	let retorno = {}
	const context = {}

	context.cod_cliente = contexto.cod_cliente
	//context.situacao = contexto.situacao

	//if(contexto.dataInicial) {
		//const data_ini = req.params.dat_hor_ini.substr(0,4) + '-' + req.params.dat_hor_ini.substr(4,2) + '-' + req.params.dat_hor_ini.substr(6,2)
		//const hora_ini = req.params.dat_hor_ini.substr(8,2) + ':' + req.params.dat_hor_ini.substr(10,2) + ':' + req.params.dat_hor_ini.substr(12,2)
        //contexto.dat_hor_ini = new Date (  data_ini + 'T' + hora_ini + 'Z' )

		//const data_ini = contexto.dataInicial.substr(0,4) + '-' + req.params.dat_hor_ini.substr(4,2) + '-' + req.params.dat_hor_ini.substr(6,2)
		//const hora_ini = req.params.dat_hor_ini.substr(8,2) + ':' + req.params.dat_hor_ini.substr(10,2) + ':' + req.params.dat_hor_ini.substr(12,2)

	//	context.dat_hor_ini = new Date ( contexto.dataInicial.toString() + 'T' + '00:00:00' + 'Z' )
	//}
	
	//if(contexto.dataFinal) {
		//const data_fim = req.params.dat_hor_fim.substr(0,4) + '-' + req.params.dat_hor_fim.substr(4,2) + '-' + req.params.dat_hor_fim.substr(6,2)
		//const hora_fim = req.params.dat_hor_fim.substr(8,2) + ':' + req.params.dat_hor_fim.substr(10,2) + ':' + req.params.dat_hor_fim.substr(12,2)
        //contexto.dat_hor_fim = new Date (  data_fim + 'T' + hora_fim + 'Z' )
    //    context.dat_hor_fim = new Date ( contexto.dataFinal.toString() + 'T' + '23:59:59' + 'Z' )
	//}

	try {

		const resultado_conta = await pedidos.conta(context)

		const resultado_registros = await pedidos.consulta(context)

		retorno = { pagina: context.pagina,
		total_de_paginas: Math.ceil( resultado_conta.TOTAL_DE_REGISTROS / context.limite, 10 ),
		limite: context.limite,
		total_de_registros: resultado_conta.TOTAL_DE_REGISTROS,
		dados: resultado_registros
		}
		const aRetornar = Object.values(resultado_registros)
		
		return aRetornar

	} catch (erro) {

		const retornoErro = `{ mensagem: ${erro} }`

		return retornoErro

	}

}

module.exports.consulta = consulta

// Node.js native modules
// ...

// Third part modules
const express = require('express')

// App modules
const pedidos = require('../models/pedidos.js')


// Get method

async function get(req, res, next) {

	let retorno = {}
	const contexto = {}

	contexto.cod_cliente = req.params.cod_cliente
	//contexto.situacao = req.params.situacao

	// ?limite=

	// Limite padrão
	//  Levar em consideração que o maior tamanho para parse de um json é 4MB
	//  Fazer testes no postman com o número de registros que deixe a página menor que 4MB, e atribuir este número à variável limitePadraoRegistros
	//  Estime sempre algo em torno de 3,5MB, pois assim temos margem para crescimento das informações
	const limitePadraoRegistros = 3500

	if (req.query.limite) {
		contexto.limite = parseInt(req.query.limite, 10)
	} else {
		contexto.limite = limitePadraoRegistros
	}

	// ?pagina=

	if (req.query.pagina) {
		contexto.pagina = parseInt(req.query.pagina, 10)
		contexto.proximo = ( parseInt(req.query.pagina, 10) * contexto.limite  ) - contexto.limite + 1
	} else {
		contexto.pagina = 1
		contexto.proximo = 1
	}

	// ?ordenar=

	// Formato esperado: ?ordenar=dat_vencto_s_desc:DESC

	if (req.query.ordenar) {
		contexto.ordenar = req.query.ordenar
	}

	try {

		const resultado_conta = await pedidos.conta(contexto)

		const resultado_registros = await pedidos.consulta(contexto)

		retorno = { pagina: contexto.pagina,
		total_de_paginas: Math.ceil( resultado_conta.TOTAL_DE_REGISTROS / contexto.limite, 10 ),
		limite: contexto.limite,
		total_de_registros: resultado_conta.TOTAL_DE_REGISTROS,
		dados: resultado_registros
		}

		res.status(200).json(retorno)

	} catch (erro) {

		res.status(500).json(`{ mensagem: ${erro} }`)

	}

}

module.exports.get = get

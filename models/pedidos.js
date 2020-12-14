const configOracleDB = require('../configs/oracle_db.js')
const oracle_db = require('../services/oracle_db.js')

const sqlSubConsultas = `

WITH

`

const sqlContar = `\n
  SELECT COUNT(1) as total_de_registros

`

const sqlSelect = `\n

SELECT

         pi.cod_empresa
       , pi.num_pedido
       --, pi.dat_emis_repres
       , To_Char(pv.dat_emis_repres, 'DD/MM/RRRR') AS dat_emis_repres
       , pi.num_sequencia
       , pi.cod_item
       , i.den_item_reduz
       , i.den_item
       , pi.qtd_pecas_solic
       , pi.pre_unit
       , CASE WHEN PV.ies_sit_pedido = '9' THEN 'Cancelado'
              WHEN pi.qtd_pecas_atend > 0 THEN 'Faturado'
              WHEN pi.qtd_pecas_romaneio > 0 THEN 'Romaneado'
              WHEN pv.ies_sit_pedido IN ( 'N', 'C', 'F', 'A' ) THEN 'Em producao'
              WHEN pv.ies_sit_pedido = 'E' THEN 'Recebido'
         END AS status

`

const sqlFrom = 
`\n
FROM logix.ped_itens pi

JOIN logix.item i ON ( i.cod_empresa = pi.cod_empresa AND i.cod_item = pi.cod_item )

JOIN logix.pedidos pv ON ( pv.cod_empresa = pi.cod_empresa AND pv.num_pedido = pi.num_pedido )
`

const sqlWhere = 
`
\n
WHERE
      pi.cod_empresa = '66'
  AND ( pi.qtd_pecas_solic - qtd_pecas_atend - qtd_pecas_cancel ) > 0
`

const sqlFetch = '\nFETCH NEXT :row_limit ROWS ONLY'

// -- ------------------------------------------------------------------------------
// COMPATIBILIDADE ORACLE 11G, devido este não ter OFFSET; a partir do 12c existe esta funcionalidade
// TODO: Tão logo atualizar o Oracle, revisar para eliminar esta sub-consulta e usar OFFSET
const sqlSubConsultaNumerar = `
\n, numera_registros AS (
    SELECT ROWNUM AS linha
            , cp.*
        FROM consulta_principal cp 
)

`

const sqlOffSet = `\n
                        SELECT *
                        FROM numera_registros
                        WHERE linha >= :proximo`

const sqlRownum = `\n
                    AND rownum <= :row_limit
`

// -- ------------------------------------------------------------------------------

async function conta(contexto) {

    let sqlWhereCompl = ''

    const binds = {}

    // TODO: Realizar teste: o consumidor deste WS não deveria conseguir informar o parametro item sem informar o empresa
    //        isso é possível? pq se sim, preciso tratar uma resposta de volta (talvez no controller)
    //       ou eu terei problemas aqui
    if (contexto.cod_cliente) {
        binds.cod_cliente = contexto.cod_cliente

        sqlWhereCompl += `\n AND pv.cod_cliente = :cod_cliente`

    }

    let declaracaoSQL = sqlSubConsultas + sqlContar + sqlFrom + sqlWhere + sqlWhereCompl

    const result = await oracle_db.simpleExecute(declaracaoSQL, binds)

    // Limpeza
    sqlWhereCompl = ''
    declaracaoSQL = ''

    return result.rows[0]
}

module.exports.conta = conta


// Consulta

async function consulta(contexto) {

    let declaracaoSQL = ''


    // Compatibilidade Oracle 11
    let consultaPrincipal = ''


    // Paginação

    const binds = {}

    if (contexto.proximo) {
        binds.proximo = contexto.proximo
    } else {
        binds.proximo = 1
    }

    // Filtros

    let sqlWhereCompl = ''

    // TODO: Realizar teste: o consumidor deste WS não deveria conseguir informar o parametro item sem informar o empresa
    //        isso é possível? pq se sim, preciso tratar uma resposta de volta (talvez no controller)
    //       ou eu terei problemas aqui
    if (contexto.cod_cliente) {
        binds.cod_cliente = contexto.cod_cliente

        sqlWhereCompl += `\n AND pv.cod_cliente = :cod_cliente`

    }


    // Ordenação

    const sqlOrdenar = `\n 
                            ORDER BY pi.cod_empresa
                                        , pi.num_pedido
                                        , pi.num_sequencia
                        `

    consultaPrincipal = sqlSelect + sqlFrom + sqlWhere + sqlWhereCompl + sqlOrdenar


    // Monta a declaração SQL

    // Compatibilidade com Oracle 11
    if(configOracleDB.logixPool.bd_version === 11) {
        declaracaoSQL += sqlSubConsultas + `\n , consulta_principal as ( ${consultaPrincipal} )` + sqlSubConsultaNumerar + sqlOffSet
    } else {
        declaracaoSQL += consultaPrincipal
    }

    // Limite de registros na Página

    const limite = ( contexto.limite > 0 ) ? contexto.limite : 500

    binds.row_limit = limite

    if(configOracleDB.logixPool.bd_version === 11) {
        // Compatibilidade com Oracle 11
        declaracaoSQL += sqlRownum
    } else {

        // A partir do Oracle 12, temos esta funcionalidade
        declaracaoSQL += sqlFetch
    }

    const result = await oracle_db.simpleExecute(declaracaoSQL, binds)

    // Limpeza
    sqlWhereCompl = ''
    consultaPrincipal = ''
    declaracaoSQL = ''
    
    return result.rows
}

module.exports.consulta = consulta

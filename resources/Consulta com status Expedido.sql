
SELECT

       --  pi.cod_empresa
         pi.num_pedido
       , pv.dat_emis_repres
       , pi.num_sequencia
       , pi.cod_item
       , i.den_item_reduz
       , i.den_item
       , pi.qtd_pecas_solic
       , i.cod_unid_med
       , pi.pre_unit
       , co.num_pedido
       , LPad(pi.num_pedido, 6, 0) || LPad(pi.num_sequencia, 5, 0)
       , CASE WHEN c.situacao_coleta = 'E' THEN 'Expedido'
              WHEN pv.ies_sit_pedido = '9' THEN 'Cancelado'
              WHEN pi.qtd_pecas_atend > 0 THEN 'Faturado'
              WHEN pi.qtd_pecas_romaneio > 0 THEN 'Romaneado'
              WHEN pv.ies_sit_pedido IN ( 'N', 'C', 'F', 'A' ) THEN 'Em producao'
              WHEN pv.ies_sit_pedido = 'E' THEN 'Recebido'
         END AS status

FROM logix.ped_itens pi

JOIN logix.item i ON ( i.cod_empresa = pi.cod_empresa AND i.cod_item = pi.cod_item )

left JOIN logix.vdp_ord_col_pedido_vkrd co ON ( co.empresa = pi.cod_empresa AND Trim(co.num_pedido) = Trim( LPad(pi.num_pedido, 6, 0) || LPad(pi.num_sequencia, 5, 0) ) )

left JOIN logix.vdp_ordem_coleta_vkrd c ON ( c.empresa = co.empresa AND c.num_coleta = co.num_coleta )

JOIN logix.pedidos pv ON ( pv.cod_empresa = pi.cod_empresa AND pv.num_pedido = pi.num_pedido )

WHERE
      pi.cod_empresa = '66'
  AND ( pi.qtd_pecas_solic - qtd_pecas_atend - qtd_pecas_cancel ) > 0
AND pv.cod_cliente = '045938917000170'

ORDER BY co.num_pedido
;

'12644400002'
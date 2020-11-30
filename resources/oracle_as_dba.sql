CREATE USER portalcli IDENTIFIED BY <senha do usuario do banco>
;

-- Evitar conceder acesso RESOURCE para portalcli
--  portacli - Usuário de aplicação para a internet
-- CONCEDER O MINIMO DE PRIVILEGIO POSSIVEL
GRANT CONNECT TO portalcli
;

-- -------------------------------------------------------------

-- Pedidos

GRANT SELECT ON logix.ped_itens TO portalcli
;

GRANT SELECT ON logix.vdp_ped_item_compl TO portalcli
;

GRANT SELECT ON logix.item TO portalcli
;

GRANT SELECT ON logix.unid_med TO portalcli
;

GRANT SELECT ON logix.ped_itens_grade TO portalcli
;

GRANT SELECT ON logix.ped_itens_grade_vkrd TO portalcli
;

GRANT SELECT ON logix.pedidos TO portalcli
;

GRANT SELECT ON logix.man_subgrupo_item_vkrd TO portalcli
;

GRANT SELECT ON logix.man_grupo_subgrupo_vkrd TO portalcli
;

GRANT SELECT ON logix.ped_ctr_movto_vkrd TO portalcli
;

GRANT SELECT ON logix.estoque_loc_reser TO portalcli
;

GRANT SELECT ON logix.ordem_montag_grade TO portalcli
;

GRANT SELECT ON logix.fat_nf_item TO portalcli
;

GRANT SELECT ON logix.fat_nf_mestre TO portalcli
;

GRANT SELECT ON logix.vdp_ord_col_pedido_vkrd TO portalcli
;

GRANT SELECT ON logix.vdp_ordem_coleta_vkrd TO portalcli
;

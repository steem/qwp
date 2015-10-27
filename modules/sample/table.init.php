<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
qwp_render_import_ui_table();
qwp_render_add_gritter();
qwp_render_add_search_code();
$test_table = array(
    array(
        'table' => 's',
        array('name', L('Name'), 100, true),
        array('age', L('Age'), 60, true),
        array('phone', L('Phone'), 60),
        'id',
    ),
);
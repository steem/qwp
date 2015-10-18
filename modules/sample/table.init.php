<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
qwp_add_js_code(QWP_UI_ROOT . '/table.js');
qwp_include_js_file('jquery.slimscroll.min.js');
qwp_render_add_gritter();
$test_table = array(
    array(
        'table' => 's',
        array('name', L('Name'), 100, true),
        array('age', L('Age'), 60, true),
        array('phone', L('Phone'), 60),
        'id',
    ),
);
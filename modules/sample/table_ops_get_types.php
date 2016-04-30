<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function list_types(&$msg, &$data) {
    $d = array(
        array(
            'id' => '1',
            'name' => 'Test 0',
            'desc' => 'This is a description for test1',
        ),
        array(
            'id' => '2',
            'name' => 'Test 10',
            'desc' => 'This is a description for test2',
        ),
        array(
            'id' => '3',
            'name' => 'Test 20',
            'desc' => 'This is a description for test3',
        ),
    );
    $data['total'] = count($d);
    $data['data'] = $d;
}
define('IN_MODULE', 1);
qwp_set_data_processor('list_types');
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
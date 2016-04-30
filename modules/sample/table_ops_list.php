<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function list_users(&$msg, &$data) {
    $r = intval(S('r', 0));
    $page = intval(P('page', 1));
    $page_size = intval(P('psize', 30));
    $page *= $page_size;
    $data['total'] = 5 * $page_size;
    $data['data'] = array();
    for ($i = 0; $i < $page_size; ++$i) {
        if ($i < $r) continue;
        $data['data'][] = array(
            'id' => $i,
            'name' => 'Test ' . ($i + $page - $page_size + 1),
            'age' => rand(10, 30),
            'phone' => random_string(),
        );
        usleep(30000);
    }
}
define('IN_MODULE', 1);
qwp_set_data_processor('list_users');
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
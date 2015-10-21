<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function get_user_info(&$msg, &$data) {
    global $F;
    if (!$F || !is_digits($F)) {
        return false;
    }
    $where = 'id>1 and id='.$F;
    qwp_db_get_data('qwp_user', $data, 'account,name,role,phone,phone,pwd,email', $where);
}
define('IN_MODULE', 1);
qwp_set_data_processor('get_user_info');
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
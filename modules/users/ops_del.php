<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function delete_user(&$msg, &$data) {
    global $F;

    $msg = L('Invalid parameters');
    if (!get_joined_digits($F, $ids)) {
        return false;
    }
    db_delete('qwp_user')->condition('id', $ids, 'in')->execute();
    $msg = L('Delete selected users successfully');
}
define('IN_MODULE', 1);
qwp_set_data_processor('delete_user');
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
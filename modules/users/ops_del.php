<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function delete_user(&$msg, &$data) {
    global $F;
    $ids = explode(',', $F);
    foreach ($ids as $id) {
        if (!is_digits($id) || $id == '1') {
            return false;
        }
    }
    db_delete('qwp_user')->condition('id', $ids, 'in')->execute();
    $msg = L('Delete selected users successfully');
}
define('IN_MODULE', 1);
qwp_set_data_processor('delete_user');
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
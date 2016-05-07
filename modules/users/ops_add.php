<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function add_user(&$msg, &$data) {
    global $F;
    // just for demo of file upload
    qwp_delete_file_in_form('avatar');
    unset($F['avatar']);
    $F['name'] = $F['account'];
    db_insert('qwp_user')->fields($F)->execute();
    $msg = L('Create a new user successfully');
}
qwp_set_form_processor('add_user');
qwp_set_form_validator('user');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function edit_user(&$msg, &$data) {
    global $F;
    $id = P('id');
    if (!$id || $id == '1') {
        return false;
    }
    // just for demo of file upload
    unset($F['avatar']);
    db_update('qwp_user')->fields($F)->condition('id', $id)->execute();
    $msg = L('Save user info successfully');
}
qwp_set_form_processor('edit_user');
qwp_set_form_validator('user');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
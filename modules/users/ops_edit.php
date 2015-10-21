<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function edit_user_info(&$msg, &$data) {
    global $F;
    to_json_file($F, get_user_file_path());
    $msg = L('Save user info successfully');
}
qwp_set_form_processor('edit_user_info');
qwp_set_form_validator('user_info');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
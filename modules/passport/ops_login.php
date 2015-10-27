<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function qwp_tmpl_login(&$msg, &$data) {
    if (F('user') != 'admin@qwp.com') {
        $msg = L('Email is not correct');
        return false;
    }
    if (F('pwd') != '123Qwe') {
        $msg = L('Password is not correct');
        return false;
    }
    $data['topTo'] = qwp_get_dst_url();
    qwp_tmpl_init_login();
    $msg = L('Login successfully');
}
qwp_set_form_processor('qwp_tmpl_login');
qwp_set_form_validator('login');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
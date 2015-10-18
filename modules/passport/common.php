<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
global $PAGE, $OP;
if (!$PAGE && !$OP && qwp_is_logined()) {
    TO('./');
}
function qwp_tmpl_init_login() {
    global $USER;

    $USER = new QWPUser(1, QWP_ROLE_ADMIN, 'admin@qwp.com', 'admin', 'admin');
    _C('u', $USER);
    require_once(QWP_ROOT . '/sample/security.php');
    qwp_tmpl_init_security($acls);
}
function qwp_tmpl_logout() {
    _C('u');
}
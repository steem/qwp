<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
global $PAGE, $OP;
if (!$PAGE && !$OP && qwp_is_login()) {
    TO('./');
}
function qwp_tmpl_init_login() {
    $user = new QWPUser(1, QWP_ROLE_ADMIN, 'admin@qwp.com', 'admin', 'admin');
    _C('u', $user);
}
function qwp_tmpl_logout() {
    _C('u');
}
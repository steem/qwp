<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
try {
    require_once(QWP_ROUTER_ROOT . '/required.php');
    do {
        session_start();
        qwp_initialize_language();
        if (qwp_initialize() === false) {
            qwp_render_bad_request();
            break;
        }
        if (qwp_security_check() === false) {
            qwp_render_security_error();
            break;
        }
        if (qwp_render_page() === false) {
            qwp_render_bad_request();
        }
    } while (false);
} catch (Exception $e) {
    qwp_render_system_exception($e);
}
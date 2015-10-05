<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
try {
    require_once(QWP_ROOT . '/config.php');
    require_once(QWP_INC_ROOT . '/common.php');
    require_once(QWP_INC_ROOT . '/logger.php');
    require_once(QWP_LANG_ROOT . '/main.php');
    require_once(QWP_INC_ROOT . '/db.php');
    require_once(QWP_ROUTER_ROOT . '/common.php');
    require_once(QWP_ROUTER_ROOT . '/render.php');
    require_once(QWP_CORE_ROOT . '/user.php');
    require_once(QWP_CORE_ROOT . '/response.php');
    require_once(QWP_ROUTER_ROOT . '/security.php');
    require_once(QWP_COMMON_ROOT . '/common.php');
    require_once(QWP_MODULE_ROOT . '/ops_logger.php');
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
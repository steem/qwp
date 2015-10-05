<?php
define('CONTENT_CHARSET', 'utf-8');
define('DB_CHARSET', 'utf-8');
define('DEFAULT_LANGUAGE', 'zh');
define('IN_DEBUG', false);
define('IN_MOCK', false);
// you can change the default module
define('DEFAULT_MODULE', 'portal');
define('QWP_SESSION_PREFIX', 'qwp_');
define('QWP_SESSION_TIMEOUT', true);
define('QWP_ROOT', dirname(__FILE__));
define('QWP_LOG_DIR', '/tmp/qwp');
define('QWP_ROUTER_ROOT', QWP_ROOT . '/router');
define('QWP_CORE_ROOT', QWP_ROOT . '/core');
define('QWP_PASSPORT_ROOT', QWP_ROOT . '/passport');
define('QWP_SECURITY_ROOT', QWP_ROOT . '/security');
define('QWP_INC_ROOT', QWP_ROOT . '/include');
define('QWP_COMMON_ROOT', QWP_ROOT . '/common');
define('QWP_UI_ROOT', QWP_ROOT . '/ui');
define('QWP_TEMPLATE_ROOT', QWP_ROOT . '/template');
define('QWP_MODULE_ROOT', QWP_ROOT . '/modules');
define('QWP_LANG_ROOT', QWP_ROOT . '/lang');
define('DRUPAL_DB_ROOT', QWP_INC_ROOT . '/database');
require_once(QWP_ROUTER_ROOT . '/main.php');
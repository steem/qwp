<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

// template function, you need to modify it if you want to use
function qwp_tmpl_get_visitor_acls(&$acls) {
    $acls = array(
    );
}
function qwp_tmpl_get_admin_acls(&$acls) {
    $acls = array(
        'modules' => array(
            'tools' => 'Tools',
            'tools-crawl_account' => 'Crawl Account Info',
        ),
        'pages' => array(

        ),
        'ops' => array(
            'tools-crawl_account' => array(
                'list' => 1,
                'import' => 1,
                'export' => 1,
            ),
        ),
    );
}
function qwp_tmpl_get_acls(&$acls) {
    global $USER;

    if ($USER->role == QWP_ROLE_VISITOR) {
        qwp_tmpl_get_visitor_acls($acls);
    } else if ($USER->role == QWP_ROLE_ADMIN) {
        qwp_tmpl_get_admin_acls($acls);
    }
}
function qwp_tmpl_init_nav_modules(&$acls) {
    $modules = array();
    $sub_modules = array();
    foreach($acls['modules'] as $m => $tag) {
        $arr = explode('-', $m);
        if (count($arr) === 1) {
            $modules[$m] = $tag;
        } else {
            if (!isset($sub_modules[$arr[0]])) {
                $sub_modules[$arr[0]] = array();
            }
            $sub_modules[$arr[0]][] = array($m, $tag);
        }
    }
    _C('nav', $modules);
    _C('sub_nav', $sub_modules);
}
// template function, you need to modify it if you want to use
function qwp_tmpl_init_security(&$acls) {
    $acls = array();
    qwp_tmpl_get_acls($acls);
    _C('acls', $acls);
    qwp_tmpl_init_nav_modules($acls);
}
function qwp_tmpl_security_check() {
    global $MODULE_URI, $PAGE, $OP;

    if (qwp_is_passport_module()) {
        return true;
    }
    $acls = C('acls', null);
    if (!$acls) {
        qwp_tmpl_init_security($acls);
    }
    if (!isset($acls['modules'][$MODULE_URI])) {
        return false;
    }
    if ($OP) {
        $path = $MODULE_URI;
        if ($PAGE) {
            $path .= '#' . $PAGE;
        }
        return isset($acls['ops'][$path]) && isset($acls['ops'][$path][$OP]);
    }
    if ($PAGE) {
        return isset($acls['pages'][$MODULE_URI]) && isset($acls['pages'][$MODULE_URI][$PAGE]);
    }
    log_info('security check is passed: ' . $MODULE_URI);
}
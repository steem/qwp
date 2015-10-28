<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_tmpl_render_nav() {
    global $MODULE;

    $nav = C('nav', array());
    $html = '';
    foreach ($nav as $item => $desc) {
        $active = '';
        if ($item == $MODULE[0]) {
            $active = ' class="active"';
        }
        $html .= format('<li{0}><a href="{1}">{2}</a></li>', $active, qwp_uri_module($item), L($desc));
    }
    echo($html);
}
function qwp_tmpl_render_sub_modules() {
    global $MODULE, $MODULE_URI;

    $nav = C('sub_nav', array());
    $html = '';
    foreach ($nav[$MODULE[0]] as $item) {
        $active = '';
        if ($item[0] == $MODULE_URI) {
            $active = ' class="active"';
        }
        $html .= format('<li{0}><a href="{1}">{2}</a></li>', $active, qwp_uri_module($item[0]), L($item[1]));
    }
    echo($html);
}
function qwp_tmpl_has_sub_modules($m) {
    $nav = C('sub_nav', array());
    return isset($nav[$m]) ? true : false;
}
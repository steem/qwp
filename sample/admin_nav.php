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
    global $MODULE, $PAGE;

    $acls = C('acls', array());
    $pages = $acls['pages'][$MODULE[0]];
    $html = '';
    foreach ($pages as $item => $desc) {
        $active = '';
        if ($item == $PAGE) {
            $active = ' class="active"';
        }
        $html .= format('<li{0}><a href="{1}">{2}</a></li>', $active, qwp_uri_page($item), L($desc));
    }
    echo($html);
}
function qwp_tmpl_has_sub_modules($m) {
    $acls = C('acls', array());
    return isset($acls['pages']) && isset($acls['pages'][$m]) && count($acls['pages'][$m]) > 0;
}
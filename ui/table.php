<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_init_table_ui() {
    qwp_include_js_file('jquery.slimscroll.min.js');
    qwp_add_js_code(QWP_UI_ROOT . '/loading.js');
}
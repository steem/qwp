<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
define('TOOLS_ROOT', dirname(__FILE__));
define('QWP_ROOT', TOOLS_ROOT . '/..');
require_once(QWP_ROOT . '/include/common.php');

if (count($argv) > 1){
    $object = $argv[1];
    $template = file_get_contents(join_paths(QWP_ROOT, 'modules', 'users', 'home.js.php'));
    $template = str_replace('user', $object, $template);
    $template = str_replace('User', camel_case($object), $template);
    file_put_contents(join_paths(TOOLS_ROOT, $object . '.js.php'), $template);
} else {
    echo_line('please specify the object name, eg. user');
}
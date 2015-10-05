<?php
require_once('./bootstrap.php');
require_once('../core/form_validator.php');

$MODULE_ROOT = '.';

$QWP_FORM_VALIDATOR_RULE = 'test1';
$_POST['f'] = array(
    'user' => 'aaa@bbb.com',
    'pwd' => '111111',
    'pwd1' => '11112',
);
initialize_request();
assert(qwp_validate_form() !== true);

$_POST['f'] = array(
    'user' => 'aaabbb.com',
    'pwd' => '111111',
    'pwd1' => '111111',
    'url' => 'http://www.qwp.com',
    'd1' => '2015-09-01',
    'd2' => '2015-09-01 18:20:11',
    'age' => '21',
);
initialize_request();
assert(qwp_validate_form() !== true);

$_POST['f'] = array(
    'user' => 'aaa@bbb.com',
    'pwd' => '111111',
    'pwd1' => '111111',
    'url' => 'http://www.qwp.com/test.php',
    'd1' => '2015-09-01',
    'd2' => '2015-09-01 18:20:11',
    'age' => '21',
    'invalid' => '2'
);
initialize_request();
assert(qwp_validate_form() === true);
assert(F('invalid') === null);
<?php
$form_rule = array(
    'selector' => '.form-signin',
    'rules' => array(
        'user' => array(
            'required' => true,
            'email' => true,
            '_msg' => 'Please input a correct email. eg. admin@qwp.com',
        ),
        'pwd' => array(
            'required' => true,
            'rangelength' => array(6, 32),
        ),
    ),
    'message' => L('Login is in processing, please wait...'),
    'invalidHandler'  => 'loginInvalidHandler',
    'beforeSubmit' => 'loginBeforeSubmit',
    'actionHandler' => 'loginActionHandler',
);
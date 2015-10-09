<?php
$form_rule = array(
    'cssSelector' => '#user_info',
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
        'pwd1' => array(
            'required' => true,
            'equalTo' => array('#inputPassword1', 'pwd'),
        ),
        'phone' => array(
            'required' => true,
            'digits' => true,
        ),
    ),
    'confirmDialog' => '#dialog_save_user',
    'actionMessage' => L('User is being save, please wait...'),
    'actionHandler' => '$noop',
);
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
            '=' => array('#inputPassword1', 'pwd'),
        ),
        'phone' => array(
            'required' => true,
            'digits' => true,
        ),
    ),
    'confirmDialog' => 'qwp_mbox',
    'mbox' => array(
        'title' => L('Save user info confirmation'),
        'message' => L('Are you sure to save user info?'),
    ),
    'submitButton' => "#user_info button[type='submit']",
    'actionMessage' => L('User is being save, please wait...'),
    'actionHandler' => '$noop',
);
<?php
$form_rule = array(
    'cssSelector' => '#user_info',
    'rules' => array(
        'account' => array(
            'required' => true,
            'letters' => true,
            '_msg' => 'Account is required and must be letters',
        ),
        'email' => array(
            'required' => true,
            'email' => true,
            '_msg' => 'Please input a correct email. eg. admin@qwp.com',
        ),
        'pwd' => array(
            'required' => true,
            'rangelength' => array(6, 32),
            'password' => true,
        ),
        'role' => array(
            'required' => true,
            'in' => get_user_roles_ids(),
        ),
        'phone' => array(
            'digits' => true,
        ),
    ),
    'confirmDialog' => 'qwp_mbox',
    'formParentDialog' => 'dialog_user',
    'mbox' => array(
        'title' => L('Save user info confirmation'),
        'message' => L('Are you sure to save user info?'),
    ),
    'actionMessage' => L('User is being save, please wait...'),
    'actionHandler' => 'userOpsCallback',
);
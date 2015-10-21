<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function get_user_roles(&$roles) {
    qwp_db_get_data('qwp_role', $roles, 'id,name', $option);
}
function get_user_data_modal(&$modal) {
    $modal = array(
        array(
            'table' => 'u',
            array('account', 'Account', 100, true),
            array('name', 'Name', 100, true),
            'id,create_time',
            'last_login_time',
        ),
        array(
            'table' => 'r',
            array('name', 'Role', 100, true),
        ),
        array(
            'table' => 'u',
            array('phone', 'Phone', 100),
            array('age', 'Age', 60),
        ),
        'alias' => array(
            'r.name' => 'role_name',
        )
    );
}
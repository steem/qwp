<?php
define('QWP_ROOT', dirname(__FILE__));
require_once(QWP_ROOT . '/config.php');
require_once(QWP_ROUTER_ROOT . '/required.php');

//$_GET['m'] = 'sample';
$_GET['m'] = 'passport';
$_GET['op'] = 'logout';
//$_GET['p'] = 'form';
/*$_POST['f'] = array(
    'user' => 'admin@qwp.com',
    'pwd' => '111111',
);*/

$test = array(
    array(
        'table' => 'u',
        array('account', 'Account', 100),
        array('name', 'Name', 100),
        'id,create_time',
        'last_login_time',
    ),
    array(
        'table' => 'r',
        array('name', 'Role', 100),
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
qwp_db_get_fields_from_modal($test, $fields);
qwp_db_get_table_header_from_modal($test, $header);
$options = array(
    'data modal' => $test,
    'left join' => array(
        array('qwp_role', 'r', 'r.id=u.role')
    ),
    'default order' => array('id', array('role', 'desc')),
    'search condition' => array(
        'values' => array(
            'role' => '1',
            'account' => 'te',
            'u.name' => 'Test',
            'age' => array(18, 32),
            'phone' => '111'
        ),
        'condition' => array(
            'fields' => array(
                'role' => '<>',
                'u.name' => 'like',
            ),
            'condition' => array(
                'op' => 'or',
                'fields' => array(
                    'phone' => 'like',
                    'account' => 'like',
                ),
            )
        ),
    ),
    'fields alias' => array(
        'r.name' => 'role_name',
    ),
);
qwp_db_retrieve_data(array('qwp_user', 'u'), $data, $options);
print_r($data);
$option = array(
    'where' => 'id<>1'
);
qwp_db_get_data('qwp_role', $data, 'id,name', $option);
print_r($data);
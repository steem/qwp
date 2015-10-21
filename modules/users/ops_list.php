<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function list_users(&$msg, &$data) {
    get_user_data_modal($user_modal);
    $options = array(
        'data modal' => $user_modal,
        'left join' => array(
            array('qwp_role', 'r', 'r.id=u.role')
        ),
        'default order' => array('id', array('role', 'desc')),
        'search condition' => array(
            'values' => array(
                'role' => '1',
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
    );
    qwp_db_retrieve_data(array('qwp_user', 'u'), $data, $options);
}
define('IN_MODULE', 1);
qwp_set_data_processor('list_users');
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
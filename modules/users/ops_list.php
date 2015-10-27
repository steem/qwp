<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function list_users(&$msg, &$data) {
    get_user_data_modal($user_modal);
    $user_id = P('id');
    $options = array(
        'data modal' => $user_modal,
        'left join' => array(
            array('qwp_role', 'r', 'r.id=u.role')
        ),
        'where' => 'u.id<>1 and role<>1',
    );
    if ($user_id) {
        $data = array();
        if ($user_id != '1' && is_digits($user_id)) {
            $options['where'] .= ' and u.id=' . $user_id;
            qwp_db_get_data(array('qwp_user', 'u'), $data, null, $options);
        }
    } else {
        $options['default order'] = array('role', array('id', 'desc'));
        $options['search condition'] = array(
            'condition' => array(
                'fields' => array(
                    'u.name' => 'like',
                ),
                'condition' => array(
                    'op' => 'or',
                    'fields' => array(
                        'phone' => 'like',
                        'account' => 'like',
                        'email' => 'like',
                        'name' => 'like',
                    ),
                )
            ),
        );
        qwp_db_retrieve_data(array('qwp_user', 'u'), $data, $options);
    }
}
define('IN_MODULE', 1);
qwp_set_data_processor('list_users');
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
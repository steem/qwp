<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function qwp_set_response_type() {
    global $qwp_response_type;

    if (isset($qwp_response_type) && !empty($qwp_response_type)) {
        set_content_type($qwp_response_type);
    } else {
        set_content_type(QWP_TP_JSON);
    }
}
function qwp_create_json_response($result, $msg, $msg_type = 'error', $additional_fields = null) {
    $json = array('ret' => $result, 'msg' => $msg);
    if ($additional_fields) {
        copy_from($json, $additional_fields);
    }
    if ($msg_type) {
        $json['msg_type'] = $msg_type;
    }
    return $json;
}
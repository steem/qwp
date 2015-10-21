<?php
if(!defined('IN_MODULE')){exit('Invalid Request');}
require_once(QWP_CORE_ROOT . '/form_validator.php');
do {
    set_content_type(QWP_TP_JSON);
    $msg_type = "error";
    $ret = false;
    $msg = "";
    $data = array();
    global $F;
    if (!isset($F)) {
        break;
    }
    if (qwp_ops_pre_check($msg) === false) {
        break;
    }
    $msg = qwp_validate_form();
    if ($msg !== true) {
        break;
    }
    $msg = "";
    if (qwp_custom_validate_form($msg) === false) {
        if (!$msg) {
            $msg = L("Parameter error");
        }
        break;
    }
    try {
        global $FN_PROCESS_OPS;
        if (isset($FN_PROCESS_OPS)) {
            if ($FN_PROCESS_OPS($msg, $data) !== false) {
                $msg_type = "info";
                $ret = true;
            }
        } else {
            $msg = L("No ops processor!");
        }
    } catch (PDOException $e) {
        if ($e->errorInfo[1] == 1062) {
            $msg = L("Duplicated record when doing ops, please check the parameters!");
        } else {
            $msg = L("Failed to execute query: ") . $e->getMessage();
        }
    } catch (Exception $e) {
        $msg = L("Exception happens: ") . $e->getMessage();
    }
} while (false);
if (!$ret && !$msg) {
    $msg = L("Parameter error");
}
try {
    qwp_custom_ops_logger($ret, $msg);
} catch (Exception $e) {
    log_exception($e, 'ops logger error');
}
$msg = qwp_create_json_response($ret, $msg, $msg_type);
$msg['data'] = $data;
echo_json($msg);
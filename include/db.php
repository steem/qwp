<?php
require_once(DRUPAL_DB_ROOT . '/database.inc');

global $QWP_ACTIVE_DB;
if (isset($QWP_ACTIVE_DB)) {
    db_set_active($QWP_ACTIVE_DB);
}
function qwp_db_try_connect_db() {
    try {
        db_query('select version()')->execute();
    } catch (PDOException $e) {
        log_db_exception($e, "try_connect_db");
        db_remove_active();
    }
}
function qwp_db_error_is_duplicated(&$pdo_exception) {
    return $pdo_exception->errorInfo[1] == 1062;
}
function qwp_db_error_is_connection_gone(&$pdo_exception) {
    return $pdo_exception->errorInfo[1] == 2006;
}
function qwp_db_has_record($table_name, $where) {
    $query = db_select($table_name, 't');
    if ($where) {
        $query->where($where);
    }
    $query->addExpression("count(1)", "n");
    $result = $query->execute();
    if ($result && $result->rowCount() > 0) {
        $r = $result->fetchAssoc();
        return intval($r["n"]) > 0;
    }
    return false;
}
function qwp_db_get_fields_from_modal(&$modal, &$fields) {
    $fields = array();
    foreach ($modal as &$item) {
        $table = $item['table'];
        if (!isset($fields[$table])) {
            $fields[$table] = array();
        }
        foreach ($item as $k => $v) {
            if ($k === 'table') {
                continue;
            } else if (is_string($v)) {
                $fields[$table][] = $v;
            } else if ($v[0] != 'qwp_ops') {
                $fields[$table][] = $v[0];
            }
        }
    }
}
function qwp_db_get_table_header_from_modal(&$modal, &$header) {
    $header = array();
    foreach ($modal as &$item) {
        foreach ($item as $k => $v) {
            if ($k === 'table' || is_string($v) || count($v) == 1) continue;
            $header[] = $v;
        }
    }
}
<?php
require_once(DRUPAL_DB_ROOT . '/database.inc');

global $QWP_ACTIVE_DB;
if (isset($QWP_ACTIVE_DB)) {
    db_set_active($QWP_ACTIVE_DB);
}
function qwp_try_connect_db() {
    try {
        db_query('select version()')->execute();
    } catch (PDOException $e) {
        log_db_exception($e, "try_connect_db");
        db_remove_active();
    }
}
function qwp__error_is_duplicated(&$pdo_exception) {
    return $pdo_exception->errorInfo[1] == 1062;
}
function qwp__error_is_connection_gone(&$pdo_exception) {
    return $pdo_exception->errorInfo[1] == 2006;
}
function qwp__has_record($table_name, $where) {
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
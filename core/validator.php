<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
function qwp_custom_validate_form(&$msg) {
    global $FN_QWP_FORM_VALIDATOR;
    return isset($FN_QWP_FORM_VALIDATOR) ? $FN_QWP_FORM_VALIDATOR($msg) : true;
}
function qwp_validate_files(&$form_rule) {
    if (!isset($form_rule['files'])) {
        return true;
    }
    global $_FILES, $F;

    // files field name must be f[xxx]
    // use required or optional to do validate
    if (!isset($_FILES['f'])) {
        return true;
    }
    $files = &$_FILES['f'];
    // use required or optional to do validate
    if (!is_array($files['name'])) {
        @unlink($files['tmp_name']);
        return true;
    }
    $files_rule = &$form_rule['files'];
    foreach ($files['name'] as $file_field => $file_names) {
        $file_rule = &$files_rule[$file_field];
        if (is_string($file_names)) {
            $files['name'][$file_field] = array($file_names);
            $files['tmp_name'][$file_field] = array($files['tmp_name'][$file_field]);
            $files['type'][$file_field] = array($files['type'][$file_field]);
            $files['error'][$file_field] = array($files['error'][$file_field]);
            $files['size'][$file_field] = array($files['size'][$file_field]);
        }
        if (!isset($files_rule[$file_field])) {
            foreach ($files['tmp_name'][$file_field] as $i => $file_path) {
                if (is_string($file_path)) {
                    @unlink($file_path);
                }
            }
            continue;
        }
        $valid_files = array();
        $total = 0;
        $last_file = false;
        foreach ($files['tmp_name'][$file_field] as $i => $file_path) {
            if (!is_string($file_path)) {
                continue;
            }
            $file_name = $files['name'][$file_field][$i];
            $file_size = $files['size'][$file_field][$i];
            if (is_array($file_rule)) {
                if ($file_rule[0]) {
                    if (!is_correct_ext($file_name, $file_rule[0])) {
                        @unlink($file_path);
                        return L('File extension should be {0}.', $file_rule[0]);
                    }
                }
                if ($file_rule[1]) {
                    $size = explode(',', $file_rule[1]);
                    if (count($size) == 1) {
                        if ($file_size > $size[0]) {
                            @unlink($file_path);
                            return L('File size should not bigger than {0}', format_file_size($size[0]));
                        }
                    } else {
                        if ($file_size < $size[0] || $file_size > $size[1]) {
                            @unlink($file_path);
                            return L('File size should between {0} and {1}', format_file_size($size[0]), format_file_size($size[1]));
                        }
                    }
                }
            }
            ++$total;
            $last_file = array(
                'name' => $file_name,
                'size' => $file_size,
                'path' => $file_path,
                'type' => $files['type'][$file_field][$i],
                'error' => $files['error'][$file_field][$i],
            );
            $valid_files[$i] = $last_file;
        }
        if ($total > 1) {
            $F[$file_field] = $valid_files;
        } else {
            $F[$file_field] = $last_file;
        }
    }
    return true;
}
function qwp_filter_form_values(&$f, &$all_filters) {
    foreach ($all_filters as $field => &$filters) {
        if (!isset($f[$field]) || !$f[$field]) {
            continue;
        }
        $filters = explode(',', $filters);
        foreach ($filters as $filter) {
            if ($filter == 'html') {
                $f[$field] = htmlspecialchars($f[$field]);
            }
        }
    }
}
function qwp_validate_data(&$f, &$rules, &$filters = null) {
    $msg_base = L('Invalid form data');
    $valid_fields = array();
    $predefined_rules = get_input_rules();
    foreach ($rules as $field_name => &$rule) {
        $field_value = isset($f[$field_name]) ? $f[$field_name] : null;
        $valid_fields[$field_name] = true;
        if (isset($rule['_msg'])) {
            $msg = &$rule['_msg'];
            unset($rule['_msg']);
        } else {
            $msg = &$msg_base;
        }
        foreach ($rule as $key => $item) {
            if ($key == 'required') {
                if ($field_value === null || $field_value === '') {
                    return $msg;
                }
                continue;
            }  else if ($key == 'optional') {
                if ($field_value === null || $field_value === '') {
                    continue;
                }
            }
            // if value is not set, ignore the validation if not required
            if (!$field_value === null || $field_value === '') {
                continue;
            }
            if ($key == 'date') {
                if (!date_to_int($field_value)) {
                    return false;
                }
            } else if ($key == 'datetime') {
                if (!datetime_to_int($field_value)) {
                    return false;
                }
            } else if ($key == 'digits') {
                if (!is_digits($field_value)) {
                    return $msg;
                }
            } else if ($key == 'minlength') {
                $len = mb_strlen($field_value, 'utf8');
                if ($len < $item) {
                    return $msg;
                }
            } else if ($key == 'maxlength') {
                $len = mb_strlen($field_value, 'utf8');
                if ($len > $item) {
                    return $msg;
                }
            } else if ($key == 'rangelength') {
                $len = mb_strlen($field_value, 'utf8');
                if ($len < $item[0] || $len > $item[1]) {
                    return $msg;
                }
            } else if ($key == 'min') {
                if ($field_value < $item) {
                    return $msg;
                }
            } else if ($key == 'max') {
                if ($field_value > $item) {
                    return $msg;
                }
            } else if ($key == 'range' || $key == '[]') {
                if ($field_value < $item[0] || $field_value > $item[1]) {
                    return $msg;
                }
            } else if ($key == 'equalTo' || $key == '=') {
                $equal_item = isset($f[$item[1]]) ? $f[$item[1]] : null;
                if ($field_value != $equal_item) {
                    return $msg;
                }
            } else if ($key == 'in') {
                if (!in_array($field_value, $item)) {
                    return $msg;
                }
            } else if ($key == '[)') {
                if ($field_value < $item[0] || $field_value >= $item[1]) {
                    return $msg;
                }
            } else if ($key == '(]') {
                if ($field_value <= $item[0] || $field_value > $item[1]) {
                    return $msg;
                }
            } else if ($key == '()') {
                if ($field_value <= $item[0] || $field_value >= $item[1]) {
                    return $msg;
                }
            } else {
                $fn_ret = is_valid_input($field_value, $key, $predefined_rules);
                if ($fn_ret !== -1 && !$fn_ret) {
                    return $msg;
                }
            }
        }
    }
    if ($filters) qwp_filter_form_values($f, $filters);
    remove_unwanted_data($f, $valid_fields);
    return true;
}
/*
 * $form_rule = array(
 *      'cssSelector' => '#form',
 *      'rules' => array(
 *          'user' => array(
 *              'required' => true,
 *              'email' => true,
 *              ...
 *              '_msg' => '',
 *          ),
 *      ),
 *      'confirmDialog' => 'dialog id or qwp_mbox',
 *      'filters' => array('' => ''),
 *      'mbox' => array(
 *          'title' => '',
 *          'message' => '',
 *      ),
 *      'submitButton' => 'css selector',
 *      'actionMessage' => 'Operation message',
 *      'invalidHandler' => 'function name',
 *      'beforeSubmit'  => 'function name',
 *      'dataType' => 'json|xml|script default is json',
 *      'actionHandler' => 'function name',
 *      'handlerOption' => array( //for createOpsHandler function in qwp.js
 *          'quiet' => true|false default is false, if true, notice information won't come up,
 *          'reload' => true|false, default is false, if true, page will reload after request is successfully processed
 *      ),
 * );
 * You can add more handler and modify createFormValidation function in qwp.js
 */
function qwp_validate_form() {
    global $QWP_FORM_VALIDATOR_RULE, $MODULE_ROOT;

    if (!isset($QWP_FORM_VALIDATOR_RULE)) {
        return true;
    }
    $form_rule = null;
    require($MODULE_ROOT . '/validator_' . $QWP_FORM_VALIDATOR_RULE . '.php');
    if (!$form_rule) {
        return true;
    }
    $tmp = qwp_validate_files($form_rule);
    if ($tmp !== true) {
        return $tmp === false ? L('Invalid form data') : $tmp;
    }
    $rules = &$form_rule['rules'];
    if (isset($form_rule['filters'])) $filters = &$form_rule['filters'];
    else $filters = null;
    global $F;
    return qwp_validate_data($F, $rules, $filters);
}
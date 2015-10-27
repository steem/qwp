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
    $msg = L('Invalid form data');
    $rules = &$form_rule['rules'];
    $valid_fields = array();
    $predefined_rules = get_input_rules();
    foreach ($rules as $field_name => $rule) {
        $field_value = F($field_name);
        $valid_fields[$field_name] = true;
        unset($rule['_msg']);
        foreach ($rule as $key => $item) {
            if ($key == 'required') {
                if ($field_value === null || $field_value === '') {
                    return $msg;
                }
                continue;
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
                $equal_item = F($item[1]);
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
    global $F;
    remove_unwanted_data($F, $valid_fields);
    return true;
}
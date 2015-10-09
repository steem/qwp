<?php
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
 *      'confirmDialog' => 'css selector',
 *      'actionMessage' => 'Operation message',
 *      'invalidHandler' => 'function name',
 *      'beforeSubmit'  => 'function name',
 *      'dataType' => 'json|xml|script default is json',
 *      'actionHandler' => 'function name',
 *      'handlerOption' => array( //for createOpsHandler function in qwp.js
 *          'quiet' => true|false default is false,
 *          'reload' => true|false, default is false
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
            if ($key == 'email') {
                // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
                // Retrieved 2014-01-14
                // If you have a problem with this implementation, report a bug against the above spec
                // Or use custom methods to implement your own email validation
                if (!preg_match("/^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/", $field_value)) {
                    return $msg;
                }
            } else if ($key == 'url') {
                // Copyright (c) 2010-2013 Diego Perini, MIT licensed
                // https://gist.github.com/dperini/729294
                // see also https://mathiasbynens.be/demo/url-regex
                // modified to allow protocol-relative URLs
                if (!preg_match('/^(https?|ftp):\/\/[^\s\/\$.?#].[^\s]*$/i', $field_value)) {
                    return $msg;
                }
            } else if ($key == 'date') {
                if (!date_to_int($field_value)) {
                    return false;
                }
            } else if ($key == 'datetime') {
                if (!datetime_to_int($field_value)) {
                    return false;
                }
            } else if ($key == 'number') {
                if (!preg_match("/^(?:-?\\d+|-?\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$/", $field_value)) {
                    return $msg;
                }
            } else if ($key == 'digits') {
                if (!preg_match("/^\\d+$/", $field_value)) {
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
            } else if ($key == 'range') {
                if ($field_value < $item[0] || $field_value > $item[1]) {
                    return $msg;
                }
            } else if ($key == 'equalTo') {
                $equal_item = F($item[1]);
                if ($field_value != $equal_item) {
                    return $msg;
                }
            }
        }
    }
    global $F;
    remove_unwanted_data($F, $valid_fields);
    return true;
}
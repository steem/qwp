## Why using file based router? 
For startup companies, sometimes, the staff is not stable or is not very professional in coding.
It's better to provide an easiest and compulsive way to optimize the code structure. 
You can use compile tools to clear all the code warnings. But you can't use tools to check whether 
the code structure is good. It's depend on the framework you are using. If all the code are 
messed up together, the project may consume lots of time for maintaining. 
With qwp, the code could be organized very well.

## qwp code structure
* core -- the core code for qwp
* router -- the core code for router
* modules -- the main code of your project will be implemented
* template -- template file for module pages
* lang -- the localization module
* include -- common project independent code
* common -- project common code
* sample -- some sample code
* ui -- php related UI code
* tool -- tools for generating code from template
* unit_tests -- unit tests code

## Request convention
Typically, a basic web request will be like this:
* http://somedomain/?m=module1-module2-module3
* http://somedomain/?m=module1-module2-module3&op=operation
* http://somedomain/?m=module1-module2-module3&p=edit
* http://somedomain/?m=module1-module2-module3&p=edit&op=operation

The qwp router is help to resolve web request to your php module file in modules directory.

For parameter m, it will used to location the directory in modules. In this example, it will
 locate the directory: 'modules/module1/module2/module3'. And you code must be written in that 
 directory.

For parameter p, if not provided, it will be resolved to php file: 'modules/module1/module2/module3/home.php'.
If provide in the example above, it will be resolved modules/module1/module2/module3/edit.php

For parameter op, if not provide, it means the response type must be html. If not provide, it means
that the response type is customized by the resolved php file after execution. Typically, it's used by
by ajax request and return json data. The op priority is higher than p;
In the example above, the two op request will be resolved to files:
* modules/module1/module2/module3/ops_operation.php
* modules/module1/module2/module3/edit_ops_operation.php

With the rule above, you must create the corresponding php file. If not, the qwp framework will raise errors.
Then, the code for the corresponding will be organized in the same directory.

For html response type, qwp provide template to organize your web UI html code. If you use full JS based UI,
then you can just provide the basic startup html/js code in the template directory. If not, you can provide 
different web template for different module. In the qwp example, it provide basic portal and admin page template.
Each template must provide header.php and footer.php.

Form data parameter format: f[xxx]=xxx, and search data parameter format: s[xxx]=xxx. Here is the example:
```html
<form id="user_info">
    <input type="text" name="f[user]" placeholder="Email">
</form>
<form id="search_info">
    <input type="text" name="s[user]" placeholder="Email">
</form>
```
qwp will automatically collect the data into $F and $S global variables. You can use F() and S() function to get
the values.

## Other files
For separate your different code in different files, the following files also will help you to do this. And finally 
qwp will combine them together just as one file.
* common.css
* common.css.php
* common.js
* common.js.php
* xxx.css
* xxx.js
* xxx.css.php
* xxx.js.php
* xxx.init.php

xxx is standards for home or the 'p' parameter indicated page file name and will be loaded only for that page. 
You can use *.css.php and *.js.php to generate css/js code dynamically. And the css will be added into style label, 
the js will be added into script label. *.init.php is used for initialize your module. You can use this file to 
preload data or set css/js code files to be loaded.

The files with 'common' as prefix are used for the same module. Those files in modules directory will be loaded for all modules.
Those files in the template directory will be loaded for all the template. Those files in modules/xxx/xxx/... directory 
will be loaded just for the same module.

## Including sequence
The php including sequence for a web page is:
* index.php
* common.php
* xxx.init.php
* xxx.php
* xxx.footer.php
* xxx.js.php
* xxx.js

For ops:
* index.php
* common.php
* xxx_ops_xxx.php or ops_xxx.php

## Form validation
User data validation is an duplicate work for browser side and php side. So, qwp provides an uniform code to work on this.
qwp use f[xxx] for form data submitted to server. And every form validation rule will be written in a file named validator_xxx.php,
just looks like below:
```php
$form_rule = array(
    'selector' => '#user_info',
    'rules' => array(
        'user' => array(
            'required' => true,
            'email' => true,
            '_msg' => 'Please input a correct email. eg. admin@qwp.com',
        ),
        'pwd' => array(
            'required' => true,
            'rangelength' => array(6, 32),
            '_msg' => array(
                'required' => 'Password must not be empty',
                'rangelength' => 'Password length must between 6 and 32',
            ),
        ),
        'pwd1' => array(
            'required' => true,
            '=' => array('#inputPassword1', 'pwd'),
        ),
        'phone' => array(
            'required' => true,
            'digits' => true,
        ),
    ),
    'confirmDialog' => 'dialog_save_user',
    'message' => L('User is being save, please wait...'),
    'actionHandler' => '$noop',
);
```

Use the following code in xxx.init.php for javascript validation in browser, if you don't want
to use gritter, you can change the code related with gritter with your own implementation.
```php
qwp_render_add_form_js();
qwp_add_form_validator('user_info');
```
For php side, use the following code to do validation.
```php
qwp_set_form_validator('user_info');
qwp_validate_form()
```
qwp provide tmpl_json_ops.php to provide template code for ops and you can following the code in
sample/form_ops_edit.php for using.

Also, you can extend form_validation.php and jquery.validate.js to provide more validation rules.
The easiest way is just add more rules in 'get_input_rules' function in 'include/common.php' and 
add error messages in 'ui/form.js'. qwp recommends you to do validation with detail message in 
 front side and with generic parameter error message in backend.

## Multi-language support 
The qwp implementation of location provide the uniform localization for PHP and JS code. You can 
use similar api to do localization. And the js localization will only load the module related texts to
reduce the response packet size.

## CRUD UI template
The CRUD UI template help you to create a single page with a table, operation buttons, paging,
sorted header, slimscroll and loading table data easily by AJAX or URL navigation. PHP and JS code share
the same data modal. For PHP, the data modal API is help to create SQL query statement easily.
For JS, the data modal API help you to create the table easily. Related API files are db.php, table.js.
The demo code is under directory is 'modules/users'.
For example:
![Table](https://github.com/steem/qwp/blob/master/doc/table.png)
```php
$test_table = array(
    array(
        'table' => 's',
        array('name', L('Name'), 100, true),
        array('age', L('Age'), 60, true),
        array('phone', L('Phone'), 60),
        'id',
    ),
);
qwp_db_get_table_header_from_modal($test_table, $test_header);
```
```javascript
qwp.table.create('#test-table', 'test', {
    fetchData: 'fetchTestData',
    btns: {
        new:{
            click: 'addNewUser',
            tooltip:'Create a new user'
        },
        edit:{
            click: 'editUser',
            tooltip:'Edit user information'
        },
        del:{
            click: function() {
                qwp.notice('Delete user message');
            },
            tooltip:'Delete selected users'
        }
    },
    topCols:{
        left:4,
        right:8
    },
    sortf:'age',
    header:<?php echo_json($test_header)?>
});
var loadingNotes = {success: $L('Users data is loading...'), failed: $L('Failed to load user data')};
function fetchTestData(page, psize, sortf, sort) {
    qwp.table.load(tableName, loadingNotes, page, psize, sortf, sort);
    return false;
}
```

## Form's data automatically be filled
For example:
```php
$user_info = array(
    'user' => 'Test',
    'pwd' => '111',
    'phone' => '111111'
);
qwp_set_form_data('#user_info', $user_info);
```
Form '#user_info' will be automatically filled with $user_info(a php variable):
```html
<form id="#user_info">
<input type="text" name="f[user]" class="form-control">
<input type="password" name="f[pwd]" class="form-control">
<input type="text" name="f[phone]" class="form-control">
</form>
```
You can also use the following code to fill form manually:
```javascript
qwp.form.fill('#user_info', userData);
```

## Search data automatically be filled
All the s[xxx] params in URL will be automatically filled into search form with qwp.search module.

## URI related APIs
For javascript, it's in namespace qwp.uri. For PHP, there are qwp_uri_xxx help functions.

## Future work:
* Provide security helper api

## Security check sample code
Coming soon...

## DB operation
qwp use drupal database api for db operation. Thanks for drupal to provide such a beautiful API framework. [drupal](https://www.drupal.org/).
* qwp_db_retrieve_data: This php function helps you to list data, search and paging easily.
* qwp_db_get_data: This php function helps you to list data and search easily.

All the APIs are in 'include/db.php', it helps to create CRUD UI template easily. 

## Sample code in qwp
* lang -- a simple file base localization implementation
* modules/passport -- a simple login example, also for demo of form validation
* modules/portal -- portal template from bootstrap
* modules/sample -- example for form validation with confirm dialog(form.php), form automatically filling(form.php) and search automatically filling(table.php).
* sample/security.php --  simple file based privilege checking
* tools -- tools for generate code from template files

For shipment, you can add grunt or gulp to minimize code files.
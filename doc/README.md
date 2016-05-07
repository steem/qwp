## Why mapping web requests to separated PHP files? 
QWP provides an easiest and compulsive way to organize the code structure. 
When you want to write code to process a web request, the first thing with QWP is to create a new PHP file in a proper directory using request name convention. 
This helps everyone in your team to have good habit in manging the code files and directories.

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

## Request name convention
Typically, a basic web request of QWP will be like this:
* http://somedomain/?m=module1-module2-module3
* http://somedomain/?m=module1-module2-module3&op=operation
* http://somedomain/?m=module1-module2-module3&p=edit
* http://somedomain/?m=module1-module2-module3&p=edit&op=operation

The qwp router helps to resolve web request to PHP files in modules directory.

* Parameter m
It will used to location the directory in modules. In this example, it will
 locate the directory: 'modules/module1/module2/module3'. And you code must be written in that 
 directory.

* Parameter p
If not provided, it will be resolved to php file: 'modules/module1/module2/module3/home.php'.
If provide in the example above, it will be resolved modules/module1/module2/module3/edit.php

* Parameter op
If not provide, it means the response type must be html. 
If provide, it means that the response type is customized by the resolved php file after execution. Typically, it's used by
by AJAX request and return JSON data.
In the example above, the two op request will be resolved to files:
* modules/module1/module2/module3/ops_operation.php
* modules/module1/module2/module3/edit_ops_operation.php

With the simple rules above, you must create the corresponding php files and directories. 
If file is not found, the QWP will route to error page rendered with proper template.

QWP also provides simple template render html UI content. It provides basic portal and admin page template.
Each template must provide header.php and footer.php.

## Forms name convention
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

If you want to post one file for one field, following the code:
```html
<input type="file" name="f[avatar]" id="f_avatar" class="form-control" placeholder="Phone">
```
And this file field in $F looks like:
![File](https://github.com/steem/qwp/blob/master/doc/one-file.png)

If you want to post multiple files for one field, following the code:
```html
<input type="file" name="f[avatar][]" id="f_avatar" class="form-control" placeholder="Phone" multiple>
```
And this file field in $F looks like: 
![File](https://github.com/steem/qwp/blob/master/doc/multi-files.png)

## Execution sequence
QWP recommends that different functional code should be placed in different files and finally all the files will be combined together just as one file.
This prevents code be messed up in one big file. These files include:
* common.css
* common.css.php
* common.js
* common.js.php
* x.css
* x.css.php
* x.js
* x.js.php
* x.init.php
* x.php
* x_ops_y.php or ops_y.php(if parameter p is not provided)

If p is not provided, x=home. If p is provided, x is the value of parameter 'p'. y is the value of parameter op. These file will be executed 
 in order. The files with 'common' as prefix are used for the same module, Those files in sub modules directory will be loaded. This feature 
 helps to provide helper class or functions for one module in one file and be used in all the module's related files.
 
Files in the template directory also will be loaded for all the template.

The execution sequence for html page:
* index.php
* common.php(in modules directory)
* common.php(in parent module directory)
* common.php(in current module)
* template/common.php
* x.init.php
* template/x.header.php
* x.php
* template/x.footer.php
* template/common.css.php
* common.css.php
* x.js.php

For ops page:
* index.php
* common.php(in modules directory)
* common.php(in parent module directory)
* common.php(in current module)
* x_ops_y.php or ops_x.php

## Form validation
QWP provides an uniform verification code that both works on JS and PHP file. It's easy to use to prevent invalid data and avoid
code duplication for the complicated verification code.
With the form name verification and form validation rule, all the verification code is provided in form_x_validator.php(x is the form name), just looks like:
```php
$form_rule = array(
    'selector' => '#user_info',
    'rules' => array(
        'user' => array(
            'required' => true,
            'email' => true,
            '_msg' => 'Please input a correct email. eg. admin@qwp.com',
            '_avoidSqlInj' => 1,
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
_avoidSqlInj rule provide simple SQL injection protection.

For JS side, use the following code in xxx.init.php.
```php
qwp_add_form_validator('user_info');
```
For php side, use the following code to do validation.
```php
qwp_set_form_validator('user_info');
```

Also, you can extend get_input_rules(in include/common.php file) and ui/form.js to provide more validation rules. 
QWP recommends you to do validation with detail message in front side and with generic parameter error message in backend.
If no forms, QWP provide qwp_validate_data function, you just provide rules and data for validation.

## ops template code
For AJAX like request, QWP provides template code in tmpl_json_ops.php and tmpl_json_data.php. All you need to do is write your 
business logic code. The form data verification and database transaction are already in the template code. You can find sample code in
sample/form_ops_edit.php and sample/table_ops_list.php.

## Multi-language support
The qwp provide uniform localization files for PHP and JS code. All the text are in php files in different language directory. You can use
L and EL function to output text. Also QWP will only load language text in common module and the current module. Then, network data package size will be reduced.

## CRUD UI template
The CRUD UI template help you to create a single page with a table, operation buttons, paging,
sorted header, slimscroll and loading table data easily by AJAX. Usually, the table header is complicated, so, QWP shares PHP and JS
for table data modal. 
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

## Automatically fill out forms
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

## Automatically fill out search form
All the s[xxx] params in URL will be automatically filled into search form with qwp.search module. This feature
helps you to avoid complicated code.

## URI related APIs
Because of QWP has defined request name convention, to create web request url, please use qwp.uri for JS and qwp_uri_xxx for PHP.

## Future work
* Provide XSS, SafeHTML, SQL injection helper functions

## DB operation
qwp use drupal database api for db operation. Thanks for drupal team[drupal](https://www.drupal.org/).
* qwp_db_retrieve_data
* qwp_db_get_data

With the two functions above, it's very easy to implement searching data(with complicated field conditions) and paging. All the APIs are 
in 'include/db.php', it helps to write CRUD code easily. 

## Sample code in qwp
* lang -- a simple file base localization implementation
* modules/passport -- a simple login example, also for demo of form validation
* modules/portal -- portal template from bootstrap
* modules/sample -- example for form validation with confirm dialog(form.php), form automatically filling(form.php) and search automatically filling(table.php).
* sample/security.php --  simple file based privilege checking
* tools -- tools for generate code from template files

For shipment, please use tools (eg. webpack) to minimize code.
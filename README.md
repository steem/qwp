The qwp is a Quick Web Platform of php. It lets you write web project easily including those features:
 router, security check, localization, ajax form operations, template and form/search data automatically filling.

It's not a UI framework, but it can help you to coding you UI framework. 

Future work:
* Provide more DB template code for doing CRUD operations quickly
* Provide security helper api

## Goal

The basic goal of qwp is to provide a file based router for PHP web development. This means
that every web page request will be located to a php file to process the request.

## Why use file based router? 

For startup companies, sometimes, the staff is not stable or
 is not very professional in coding. It's better to provide an easiest and compulsive way 
 to optimize the code structure. You can use compile tools to clear all the code warnings.
But you can't use tools to check whether the code structure is good. It's depend on the 
framework you are use. If all the code are messed up together, the project may consume lots
 of time for maintaining. With qwp, the code could be organized very well.

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
* unit_tests -- unit tests code


The qwp router is help to resolve web request to your php module file in modules directory.
Typically, a basic web request will be like this:
* http://somedomain/?m=module1-module2-module3
* http://somedomain/?m=module1-module2-module3&op=operation
* http://somedomain/?m=module1-module2-module3&p=edit
* http://somedomain/?m=module1-module2-module3&p=edit&op=operation

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

## Execution order
``` php

```

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
            'equalTo' => array('#inputPassword1', 'pwd'),
        ),
        'phone' => array(
            'required' => true,
            'digits' => true,
        ),
    ),
    'confirmDialog' => '#dialog_save_user',
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

## Localization 
The qwp implementation of location provide the uniform localization for PHP and JS code. You can 
use similar api to do localization. And the js localization will only load the module related texts to
reduce the response packet size.

## Security check sample code

## Form's data automatically be filled


## Search data automatically be filled


## DB operation
qwp use drupal database api for db operation. Thanks for drupal to provide such a beatiful framework. [drupal](https://www.drupal.org/).
Comming song...

## License
Copyright (c) 2005-2016 Steem & The qwp Licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

## Thanks
Thanks to the project owner of jquery, jquery.form, jquery.validator, jquery.gritter. Without them, qwp won't be come out.
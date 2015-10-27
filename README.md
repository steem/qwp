If you like the following code:
```php
// index.php
Router::post('/', function(){
    return 'Hello world';
});
Router::post('foo/bar', function(){
    return 'Hello world';
});
```
Why not try this without any Router::xxx like code, just write your code in separated files:
http://localhost/ =&gt;:
![Demo portal](https://github.com/steem/qwp/blob/master/doc/demo_portal.png)
http://localhost/?m=foo&op=bar =&gt;:
![Demo foo bar](https://github.com/steem/qwp/blob/master/doc/demo_foo_bar.png)

## qwp
qwp is a file based PHP web router that helps you translate each page request to a PHP file.
For your convenient, qwp also includes the following features:
* form validation using one copy of validation rule file for both JS and PHP code
* multi-language support using one copy of localization file for both JS and PHP code
* automatically fill out forms
* security/privilege check
* page template
* CRUD UI template
UI template is based on jquery and bootstrap, you can change it other UI framework easily.
Please ref [API doc](https://github.com/steem/qwp/blob/master/doc) for more information.

## License
Copyright (c) 2005-2016 Steem & The qwp Licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

## Thanks
Thanks to the project owner of bootstrap, jquery, jquery.form, jquery.validator, jquery.gritter, jquery.slimscroll.

## Snapshots
CRUD UI template helps you to create the pages easily
Phone
![Phone](https://github.com/steem/qwp/blob/master/doc/crud_phone.jpg)
PC
![Phone](https://github.com/steem/qwp/blob/master/doc/crud_pc.png)
Others:
![Portal](https://github.com/steem/qwp/blob/master/doc/portal.png)
![Login](https://github.com/steem/qwp/blob/master/doc/login.png)
![Form](https://github.com/steem/qwp/blob/master/doc/form.png)
![Form Validation](https://github.com/steem/qwp/blob/master/doc/form_validation.png)
![Table](https://github.com/steem/qwp/blob/master/doc/table_loading.png)
![Table](https://github.com/steem/qwp/blob/master/doc/table_loaded.png)
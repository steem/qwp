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
* http://localhost

![Demo portal](https://github.com/steem/qwp/blob/master/doc/demo_portal.png)

* http://localhost/?m=foo&op=bar

![Demo foo bar](https://github.com/steem/qwp/blob/master/doc/demo_foo_bar.png)

## qwp
qwp is a PHP router that helps you to map web requests to separated PHP file.
For your convenient, qwp also includes the following features:
* form validation using one copy of validation rule file for both JS and PHP code
* multi-language support using one copy of localization file for both JS and PHP code
* automatically fill out forms
* security/privilege check
* page template
* CRUD UI template

Current UI solution is for quick development for admin portal. Feel free to fork and provide other type of UI solution. 

## Documentation
Guides and the API reference are located in the [docs](https://github.com/steem/qwp/blob/master/doc) directory.

## Documentation Translations
[Simplified Chinese](https://github.com/steem/qwp/blob/master/doc-translations/zh-CN)

## License
Copyright (c) 2005-2016 Steem & The qwp Licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

## Thanks
Thanks to the project owner of bootstrap, jquery, jquery.form, jquery.validator, jquery.gritter, jquery.slimscroll.

## Snapshots
CRUD UI template helps you to create the pages easily.

* Phone
![Phone](https://github.com/steem/qwp/blob/master/doc/crud_phone.jpg)

* PC
![Phone](https://github.com/steem/qwp/blob/master/doc/crud_pc.png)

* Other snapshots:
![Form Validation](https://github.com/steem/qwp/blob/master/doc/form_validation.png)
![Form](https://github.com/steem/qwp/blob/master/doc/form.png)
![Table](https://github.com/steem/qwp/blob/master/doc/table_loading.png)
![Table](https://github.com/steem/qwp/blob/master/doc/table_loaded.png)
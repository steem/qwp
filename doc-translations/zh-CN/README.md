## qwp
qwp提供了页面请求和PHP代码文件的路由映射关系，为了方便快速搭建Web应用，qwp提供了如下功能：
* 表单验证 - PHP和JS共享同一份代码
* 多语言支持 - PHP和JS共享同一份代码
* 自动表单填充
* 权限安全检查
* 页面模板
* CRUD界面模板

当前的界面解决方案对开发管理后台很方便。请Fork分支来分享不同场景的界面解决方案。 

## 为什么要做映射页面请求到单独的PHP代码文件
QWP提供了简单而强制性的方式来管理代码。当你准备写页面请求代码时，QWP让你最先想到的是：利用请求的命名规范，在合适的目录下，创建一个新的PHP文件。这样就帮助你的组员在组织代码方面养成良好的习惯

## qwp code structure
* core -- QWP核心代码
* router -- QWP路由部分
* modules -- 项目的各模块代码目录
* template -- 各模块的HTML模板文件
* lang -- 多语言处理模块及各种语言的翻译
* include -- QWP使用的一些基础库
* common -- 项目相关的公共代码
* sample -- 示例代码目录
* ui -- QWP的UI相关代码
* tool -- QWP工具集
* unit_tests -- 单元测试代码

## 页面请求命名规范
QWP定义的页面请求格式如下：
* http://somedomain/?m=module1-module2-module3
* http://somedomain/?m=module1-module2-module3&op=operation
* http://somedomain/?m=module1-module2-module3&p=edit
* http://somedomain/?m=module1-module2-module3&p=edit&op=operation

QWP路由模块把页面请求转换到modules目录下的PHP代码文件执行。

* 参数m
用于定位modules下面的目录，这个例子中，对应的目录为：
modules/module1/module2/module3
所有代码文件必须在这个目录下。

* 参数p
可选参数，如果不提供，默认对应的PHP文件是：
modules/module1/module2/module3/home.php
如果提供了该参数，这个请求http://somedomain/?m=module1-module2-module3&p=edit，对应的文件是：
modules/module1/module2/module3/edit.php

* 参数op
可选参数，如果不提供， 表示这个请求页面是的HTTP内容类型是html。
如果提供了，则由映射的PHP代码文件动态决定页面请求的HTTP内容类型。典型的应用场景是处理一个AJAX请求并返回JSON格式的数据。
请求http://somedomain/?m=module1-module2-module3&op=operation，对应的文件是
modules/module1/module2/module3/ops_operation.php
请求http://somedomain/?m=module1-module2-module3&p=edit&op=operation，对应的文件是：
modules/module1/module2/module3/edit_ops_operation.php

利用这几个简单的规则，强制要求代码文件在合适的目录下创建，如果文件找不到，QWP将路由到用合适的模板产生的错误页面。

QWP提供简单的模板来渲染HTML UI内容。并提供门户和后台管理页面模板,模板文件由header.php和footer.php组成。

## 表单命名规范
表单的参数格式为：f[xxx]=xxx
搜索表单的参数格式为：s[xxx]=xxx
例如：
```html
<form id="user_info">
    <input type="text" name="f[user]" placeholder="Email">
</form>
<form id="search_info">
    <input type="text" name="s[user]" placeholder="Email">
</form>
```
QWP自动把这些表单放到全局变量$F和$S中。并提供F()和S()函数来获取参数的值。

## 加载顺序
QWP推荐把不同功能的代码放在不同的文件中，最后又能自动合并成一个文件，这样能保证你的代码不会混在一个大的代码文件中。这些文件包括：
* common.css
* common.css.php
* common.js
* common.js.php
* x.css
* x.css.php
* x.js
* x.js.php
* x.init.php
* x_ops_y.php or ops_y.php(如果未提供参数p)

如果参数p未提供时，x=home，如果提供了参数p，则x为p的值。y为参数op的值。这些文件将会按照一定顺序执行。以common为前缀的文件是一个模块
的公共文件，每个页面都会被加载执行，并且该模块的子模块也会加载这些文件。这个功能帮助你把辅助类或方法写到一个代码文件，而模块内部的其它
文件也能够使用这些类或方法。

在模板目录下的文件也将会被加载执行。

html类型的页面加载顺序为：
* index.php
* common.php(modules目录)
* common.php(在父模块目录)
* common.php(当前模块)
* x.init.php
* template/common.php
* template/common.css
* template/common.css.php
* common.css
* common.css.php
* template/x.header.php
* x.php
* template/x.footer.php
* x.js
* x.js.php

ops类型的页面加载顺序为:
* index.php
* common.php
* x_ops_y.php or ops_x.php

## 表单验证
QWP提供了统一的JS和PHP验证代码，使用起来非常方便，能帮你有效的阻止异常数据，并避免重复而繁琐的验证代码
结合表单命名规范和验证规则，所有的验证代码都必须写在单独的form_x_validator.php中，如下：
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
_avoidSqlInj规则提供简单的SQL注入防护。

利用下面的代码可以完成JS端的验证
```php
qwp_add_form_validator('user_info');
```
利用下面的代码可以完成PHP端的验证
```php
qwp_set_form_validator('user_info');
qwp_validate_form()
```

通过扩展get_input_rules（在文件include/common.php中）和ui/form.js来提供更多数据类型的验证。QWP推荐在前端提供详细的表单验证错误信息，而后端仅提示数据格式错误。
在没有使用表单时，可以通过qwp_validate_data来直接验证，你只需要提供规则和数据。

## ops代码模板
对于类似AJAX的请求，QWP提供了tmpl_json_ops.php and tmpl_json_data.php模板代码来帮助你快速的完成业务代码。你只需要写核心的业务代码即可，其它验证和数据库事物逻辑模板代码完成。
在sample/form_ops_edit.php and sample/table_ops_list.php可以找到相应的示例代码。

## Multi-language support 
QWP提供了JS和PHP统一的语言文件支持，所有的语言文件都在不同语言目录的php文件中。你可以用L和EL函数来输出文本。QWP只会把功公共模块和本模块的语言文本输出至html，这样做是为了减少网络流量。

## CRUD UI template
这个模板代码帮助你创建单数据表页面，包括操作按钮、分页和排序，并且支持slimscroll滚动和AJAX加载数据。通常一个表页面的表头会比较繁琐，QWP使JS和PHP共享同一套数据模型代码。
示例代码在modules/users，例如：
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

## 表单自动填充
例如：
```php
$user_info = array(
    'user' => 'Test',
    'pwd' => '111',
    'phone' => '111111'
);
qwp_set_form_data('#user_info', $user_info);
```
'#user_info'表单将自动使用$user_info填充：
```html
<form id="#user_info">
<input type="text" name="f[user]" class="form-control">
<input type="password" name="f[pwd]" class="form-control">
<input type="text" name="f[phone]" class="form-control">
</form>
```
也可以用下面的JS代码来填充表单：
```javascript
qwp.form.fill('#user_info', userData);
```

## 搜索表单自动填充
所有的在URL中的s[xxx]参数将通过qwp.search自动填充到搜索表单中。避免编写类似这样的繁琐的代码。

## URI相关函数
由于QWP规范了请求参数，通过uri相关的代码可以来生成页面请求，参考JS的qwp.uri和PHP的qwp_uri_xxx系列函数。

## 后期打算增加的功能
* 提供XSS、SafeHTML和SQL injection辅助函数

## 数据库操作
QWP使用了drupal提供的database api，非常好用，感谢drupal团队[drupal](https://www.drupal.org/)。
* qwp_db_retrieve_data
* qwp_db_get_data
这两个函数使数据的查询（包括各种条件组合）和分页非常方便。所有的代码在include/db.php中，里面的函数让你写CRUD相关的代码非常方便。

## 代码目录介绍
* lang -- 多语言文件
* modules/passport -- 登录示例代码
* modules/portal -- 基于bootstrap提供的门户页面模板
* modules/sample -- 表单和数据表等示例代码
* sample/security.php --  权限验证示例代码
* tools -- 工具代码

对于生成环境，请使用类似webpack来缩小代码。
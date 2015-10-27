<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
global $roles;
?>
<form id="user_info" class="form-horizontal col-lg-12" action="" method="post">
    <div class="form-group">
        <label for="f_account" class="col-sm-3 control-label">Account</label>
        <div class="col-sm-9">
            <input type="text" name="f[account]" id="f_account" class="form-control" placeholder="Account">
        </div>
    </div>
    <div class="form-group">
        <label for="f_email" class="col-sm-3 control-label">Email</label>
        <div class="col-sm-9">
            <input type="text" name="f[email]" id="f_email" class="form-control" placeholder="Email">
        </div>
    </div>
    <div class="form-group">
        <label for="f_pwd" class="col-sm-3 control-label">Password</label>
        <div class="col-sm-9">
            <input type="password" name="f[pwd]" id="f_pwd" class="form-control" placeholder="Password">
        </div>
    </div>
    <div class="form-group">
        <label for="f_role" class="col-sm-3 control-label">Role</label>
        <div class="col-sm-9">
            <select name="f[role]" id="f_role" class="form-control">
                <?php foreach($roles as $role_item) {
                    echo(format('<option value="{0}">{1}</option>', $role_item['id'], L($role_item['name'])));
                }?>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label for="f_phone" class="col-sm-3 control-label">Phone</label>
        <div class="col-sm-9">
            <input type="text" name="f[phone]" id="f_phone" class="form-control" placeholder="Phone">
        </div>
    </div>
</form>
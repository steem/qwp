<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
/*qwp_create_dialog("dialog_save_user", "Save user info confirmation", array(
    "lang_save" => "Save",
    'dialog_html' => L('Are you sure to save user info?'),
    'width' => '520px',
    'height' => '160px',
));*/
qwp_init_message_box();
?><h1 class="page-header"><?php EL('Save user info of ({0})', $USER->name);?></h1>
<form id="user_info" class="form-horizontal col-lg-6" action="<?php echo(qwp_uri_current_ops('edit'));?>" method="post">
    <div class="form-group">
        <label for="inputEmail3" class="col-sm-3 control-label">Email</label>
        <div class="col-sm-9">
            <input type="text" name="f[user]" class="form-control" id="inputEmail3" placeholder="Email">
        </div>
    </div>
    <div class="form-group">
        <label for="inputPassword3" class="col-sm-3 control-label">Password</label>
        <div class="col-sm-9">
            <input type="password" name="f[pwd]" class="form-control" id="inputPassword1" placeholder="Password">
        </div>
    </div>
    <div class="form-group">
        <label for="inputPassword3" class="col-sm-3 control-label">Password Confirmation</label>
        <div class="col-sm-9">
            <input type="password" name="f[pwd1]" class="form-control" id="inputPassword2" placeholder="Password">
        </div>
    </div>
    <div class="form-group">
        <label for="inputPassword3" class="col-sm-3 control-label">Phone</label>
        <div class="col-sm-9">
            <input type="text" name="f[phone]" class="form-control" id="inputPhone1" placeholder="Phone">
        </div>
    </div>
    <div class="form-group">
        <div class="col-sm-offset-3 col-sm-9">
            <div class="checkbox">
                <label>
                    <input type="checkbox"> Remember me
                </label>
            </div>
        </div>
    </div>
    <div class="form-group">
        <div class="col-sm-offset-3 col-sm-9">
            <button type="submit" class="btn btn-default"><?php EL('Save');?></button>
        </div>
    </div>
    <div class="form-group">
        <div class="col-sm-offset-3 col-sm-9">
            <button type="button" onclick="qwp.dialog.showMsgBox({title:'A test message box', message:'Are you sure to save user info?'});" class="btn btn-info"><?php EL('Show message box');?></button>
        </div>
    </div>
</form>
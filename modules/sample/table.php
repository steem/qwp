<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
qwp_ui_init_table();
?>
<div class="row well qwp-search hide">
    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <form class="form-inline" id="search_form">
        <div class="form-group">
            <input type="text" name="s[name]" class="form-control" id="exampleInputName2" placeholder="Name">
        </div>
        <div class="form-group">
            <input type="text" name="s[email]" class="form-control" id="exampleInputEmail2" placeholder="Email">
        </div>
        <div class="form-group">
            <select name="s[gender]" class="form-control" id="exampleInputSex2" placeholder="Gender">
                <option>Gender</option>
                <option value="m">Male</option>
                <option value="f">Female</option>
            </select>
        </div>
        <button type="submit" class="btn btn-info btn-sm"><i class="glyphicon glyphicon-search"></i></button>
        <button type="reset" class="btn btn-info btn-sm"><i class="glyphicon glyphicon-remove"></i></button>
    </form>
</div>
<div id="test-table" class="row qwp-table"></div>
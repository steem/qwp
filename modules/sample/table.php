<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');} ?>
<div class="breadcrumbs">
    <ol class="breadcrumb">
        <li><a href="#">Home</a></li>
        <li><a href="#">Library</a></li>
        <li class="active">Data</li>
    </ol>
</div>
<form class="form-inline" id="search_form">
    <div class="form-group">
        Search:
    </div>
    <div class="form-group">
        <input type="text" name="s[name]" class="form-control" id="exampleInputName2" placeholder="Name">
    </div>
    <div class="form-group">
        <input type="text" name="s[email]" class="form-control" id="exampleInputEmail2" placeholder="Email">
    </div>
    <button type="submit" class="btn btn-success nav-btn"><i class="glyphicon glyphicon-search"></i></button>
    <button type="reset" class="btn btn-success nav-btn"><i class="glyphicon glyphicon-remove"></i></button>
</form>
<div class="table-responsive">
    <table class="table">
        <thead>
        <tr>
            <th>#</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <th scope="row">1</th>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
        </tr>
        <tr>
            <th scope="row">2</th>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
        </tr>
        <tr>
            <th scope="row">3</th>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
        </tr>
        </tbody>
    </table>
</div><!-- /.table-responsive -->
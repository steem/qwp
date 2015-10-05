<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function get_user_file_path() {
    return join_paths(sys_get_temp_dir(), 'user.txt');
}
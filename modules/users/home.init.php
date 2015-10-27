<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
qwp_render_import_ui_table();
qwp_render_import_ui_dialog();
qwp_render_add_search_code();
qwp_render_add_form_js();
qwp_add_form_validator('user');
qwp_render_add_gritter();
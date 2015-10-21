<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
qwp_render_import_ui('table');
qwp_render_import_ui('dialog');
qwp_render_add_form_js();
qwp_add_form_validator('user_info');
qwp_render_add_gritter();
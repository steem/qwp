<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
qwp_render_add_form_js();
qwp_add_form_validator('login');
qwp_include_css_file('jquery.gritter.css');
qwp_include_js_file('jquery.gritter.min.js');
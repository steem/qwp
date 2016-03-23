<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_set_site_info() {
?><?php if (defined('PRODUCT_NAME')) {?>
<title><?php echo(PRODUCT_NAME);?></title>
<?php }?>
<?php if (defined('SITE_KEYWORDS')) {?>
<meta name="keywords" content="<?php echo(SITE_KEYWORDS);?>" />
<?php }?>
<?php if (defined('SITE_DESCRIPTION')) {?>
<meta name="description" content="<?php echo(SITE_DESCRIPTION);?>" />
<?php }?>
<script>
var qwp={
    _r:[],
    r: function(f){qwp._r.push(f);},
    isEmpty: function(o){return !o || !o.length;}
};
</script>
<?php
}
function qwp_get_logo() {
    $img = 'img/logo.png';
    $file_path = join_paths(QWP_ROOT, $img);
    return file_exists($file_path) ? "<img src='$img'> " : '';
}
function qwp_render_footer() {
?>
<script src="js/jquery-1.11.3.min.js"></script>
<script src="js/jquery-ui-1.11.4.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<?php qwp_render_js_lang();?>
<script src="js/qwp.js"></script>
<?php
    qwp_render_js();
}

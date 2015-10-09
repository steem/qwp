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
<?php if(!defined('QWP_ROOT')){exit('Invalid Request');}
if (qwp_tmpl_has_sub_modules($MODULE[0])) {?>
        </div>
    </div>
</div>
<?php } else {?>

<?php }?>
    <script src="js/jquery-1.11.3.min.js"></script>
    <script src="js/jquery-ui-1.11.4.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <?php qwp_render_js_lang();?>
    <script src="js/qwp.js"></script>
    <?php qwp_render_js();?>
</body>
</html>
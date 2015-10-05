<?php if(!defined('QWP_ROOT')){exit('Invalid Request');} ?>
<div class="container">
    <hr class="featurette-divider">
    <!-- FOOTER -->
    <footer>
        <p class="pull-right"><a href="#">Back to top</a></p>
        <p>&copy; <?php echo(COMPANY_NAME. ' ' . get_year());?></p>
    </footer>
</div>
    <script src="js/jquery-1.11.3.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <?php qwp_render_js_lang();?>
    <script src="js/qwp.js"></script>
    <?php qwp_render_js();?>
</body>
</html>
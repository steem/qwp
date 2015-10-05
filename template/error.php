<?php if(!defined('QWP_ROOT')){exit('Invalid Request');} ?><!DOCTYPE html>
<html lang="<?php echo(qwp_html_lang());?>">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php qwp_set_site_info();?>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <?php qwp_render_css();?>
    <!--[if lt IE 9]>
    <script src="js/html5shiv.min.js"></script>
    <script src="js/respond.min.js"></script>
    <![endif]-->
</head>
<body>
<div class="container">
    <div class="page-header">
        <h1>Ops... </h1>
    </div>
    <p class="lead">Something goes wrong! Please follow the instructions below to fix the issue.</p>
    <p><?php echo($error_description);?></p>
</div>
<footer class="footer">
    <div class="container">
        <p class="text-muted">&copy; <?php echo(COMPANY_NAME. ' ' . get_year());?></p>
    </div>
</footer>
<script src="js/jquery-1.11.3.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<?php qwp_render_js_lang();?>
<script src="js/qwp.js"></script>
<?php qwp_render_js();?>
</body>
</html>
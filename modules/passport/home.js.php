<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');} ?>
<script>
    function loginInvalidHandler(e, v) {
        gritterNotice($L('Number of invalid items: {0}', v.numberOfInvalids()));
    }
    function loginBeforeSubmit(v, f, e) {

    }
    function loginActionHandler(res, data) {

    }
</script>
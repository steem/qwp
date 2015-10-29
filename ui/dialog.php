<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_init_message_box() {
    static $created_msg_box;
    if (isset($created_msg_box)) {
        return;
    }
    $created_msg_box = true;
    qwp_create_dialog('qwp_mbox', L('Message box'), array(
        "lang_save" => "Ok",
        'dialog_html' => '&nbsp',
        'width' => '380px',
        'height' => '100px',
        'z-index' => '99999998',
        'margin-top' => '36px',
    ));
}
function qwp_create_dialog($tmp_md_id, $tmp_md_lang_title, $options)
{
    qwp_init_message_box();
    $tmp_md_frm_url = P('iframe_url', '', $options);
    $tmp_md_width = P('width', '400px', $options);
    $tmp_md_height = P('height', '120px', $options);
    $tmp_md_lang_save = P('lang_save', 'Save', $options);
    $tmp_md_lang_close = P('lang_close', 'Cancel', $options);
    $tmp_save_auto_hide = P('auto_hide', true, $options);
    $tmp_md_no_save = P('no_save', false, $options);
    $tmp_md_no_cancel = P('no_cancel', false, $options);
    $tmp_md_btn_html = P('additional_btns', false, $options);
    $iframe_scroll = P('no_iframe_scroll', false, $options);
    $tmp_no_btns = P('no_btns', false, $options);
    if ($iframe_scroll) {
        $iframe_scroll = ' scrolling="no"';
    } else {
        $iframe_scroll = '';
    }
    $tmp_dialog_html_file = NULL;
    $tmp_dialog_html = NULL;
    if (!$tmp_md_frm_url) {
        $tmp_dialog_html_file = P('dialog_file', '', $options);
        if (!$tmp_dialog_html_file) {
            $tmp_dialog_html = P('dialog_html', '', $options);
        }
    }
    $auto_hide = "";
    if($tmp_save_auto_hide) {
        $auto_hide = 'data-dismiss="modal"';
    }
    $zIndex = P('z-index', '99999997', $options);
    $marginTop = P('margin-top', '20px', $options);
?>
    <div class="modal fade" tabindex="-1" role="dialog" id="<?php echo($tmp_md_id);?>" style="display: none;z-index:<?php echo($zIndex);?>;margin-top:<?php echo($marginTop);?>;" aria-hidden="true" qwp="dialog">
        <div class="modal-dialog" style="width:<?php echo($tmp_md_width);?>;">
            <div class="modal-content" style="width:<?php echo($tmp_md_width);?>;">
                <div class="modal-header" style="font-weight: bold">
                    <div class="table-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            <span class="white">×</span>
                        </button>
                        <span qwp="title"><?php EL($tmp_md_lang_title);?></span>
                    </div>
                </div>
                <div class="modal-body" style="height:<?php echo($tmp_md_height);?>;padding: 8px;">
                    <?php if (!$tmp_md_frm_url) {
                        if ($tmp_dialog_html_file) {
                            require($tmp_dialog_html_file);
                        } else if ($tmp_dialog_html) {
                            echo($tmp_dialog_html);
                        }
                    } else {?>
                        <iframe qwp="frame"<?php echo($iframe_scroll);?> id="<?php echo($tmp_md_id);?>_frame" name="<?php echo($tmp_md_id);?>_frame" frameborder="0" width="100%" height="100%" src="<?php echo($tmp_md_frm_url);?>"></iframe>
                    <?php } ?>
                </div>
                <?php if (!$tmp_no_btns){?>
                    <div class="modal-footer no-top-margin">
                        <table border="0" cellspacing="0" cellpadding="0" width=100%>
                            <tr><td align="left">
                                    <?php if (isset($tmp_highlight)){?>
                                        <form class="form-inline"><input type="text" placeholder="<?php EL("Please input keywords to highlight");?>" qwp="highlight" value=""></form>
                                    <?php }?>
                                </td><td>
                                    <?php if ($tmp_md_btn_html) { echo $tmp_md_btn_html; }
                                    if (!$tmp_md_no_save) {?>
                                        <button class="btn btn-sm btn-info" qwp="ok" <?php echo $auto_hide;?> type="button"><i class="icon-ok"></i><?php EL($tmp_md_lang_save);?></button>
                                    <?php }?>
                                    <?php if (!$tmp_md_no_cancel){ ?>
                                        <button class="btn btn-sm btn-danger" qwp="cancel" data-dismiss="modal"><i class="icon-remove"></i><?php EL($tmp_md_lang_close);?></button>
                                    <?php }?>
                                </td>
                            </tr>
                        </table>
                    </div>
                <?php }?>
            </div>
        </div>
    </div>
<?php
}
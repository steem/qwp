/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
qwp.dialog = {
    init: function() {
        if (!qwp.dialog.tmpl) {
            qwp.dialog.tmpl = qwp.ui.tmpl('dialog_base');
        }
        qwp.dialog.create('qwp_mbox', {
            content : '&nbsp',
            width : '380px',
            height : '100px',
            'z-index' : '99999998',
            'margin-top' : '36px'
        });
        if (qwp.components && qwp.components.dialogs) {
            var dialogs = qwp.components.dialogs;
            for (var id in dialogs) {
                qwp.dialog.create(id, dialogs[id]);
            }
        }
    },
    showMsgBox: function(opt) {
        if (!opt) opt = {};
        qwp.dialog.show('qwp_mbox', opt);
    },
    create: function(id, opt) {
        opt.id = id;
        if (qwp.isString(opt.url)) {
            if (!opt.url) opt.url = qwp.uri.blank;
            var scroll = '';
            if (opt.noScroll) scroll = ' scrolling="no"';
            opt.content = '<iframe qwp="frame"{2} id="{0}_frame" name="{0}_frame" frameborder="0" width="100%" height="100%" src="{1}"></iframe>'.format(opt.url, id, scroll)
        } else if (opt.tmpl) {
            opt.content = qwp.ui.tmpl(id);
        }
        if (!opt['z-index']) opt['z-index'] = '99999997';
        if (!opt['margin-top']) opt['margin-top'] = '20px';
        if (!opt.title) opt.title = '';
        $('body').append(qwp.dialog.tmpl.format(opt));
        qwp.dialog.customize(id, opt);
    },
    show: function(id, opt) {
        if (opt) {
            qwp.dialog.customize(id, opt);
        }
        $('#' + id).modal();
        qwp.dialog._updateDialogSize(id);
    },
    confirmForm: function (dialogId, btn) {
        var id = "#" + dialogId;
        var f = $(id + " [qwp='ok']");
        f.unbind("click");
        f.click(function () {
            $(id).data('clicked', true);
            if (qwp.isString(btn)) $(btn).click();
            else $(btn[1]).submit();
        });
    },
    customizeMsgBox: function(opt) {
        qwp.dialog.customize('qwp_mbox', opt);
    },
    customize: function(dialogId, opt) {
        var id = "#" + dialogId;
        if (opt.noBtns) {
            $(id + ' .modal-footer').hide();
        } else {
            var obj = $(id + " [qwp='ok']");
            obj.unbind("click");
            if (opt.noOk) {
                obj.hide();
            } else {
                var t = $(id + " [qwp='txt-ok']").text();
                if (!t || opt.txtOk) {
                    $(id + " [qwp='txt-ok']").text(opt.txtOk ? $L(opt.txtOk) : $L('Ok'));
                }
                if (opt.ok) obj.click(opt.ok);
            }
            obj = $(id + " [qwp='cancel']");
            obj.unbind("click");
            if (opt.noCancel) {
                obj.hide();
            } else {
                var t = $(id + " [qwp='txt-cancel']").text();
                if (!t || opt.txtCancel) {
                    $(id + " [qwp='txt-cancel']").text(opt.txtCancel ? $L(opt.txtCancel) : $L('Cancel'));
                }
                if (opt.cancel) obj.click(opt.cancel);
            }
        }
        if (opt.title) {
            $(id + " [qwp='title']").html(opt.title);
        }
        if (opt.message) {
            $(id + " .modal-body").html(opt.message);
        }
        if (opt.max) {
            opt.height = $(window).height() - 20;
            if ($(id + " .modal-footer").length > 0) {
                opt.height -= 66;
            }
            opt.width = $(window).width() - 20;
            $(id + " .modal-dialog").css("padding-top", '8px');
        } else if (opt.maxHeight) {
            opt.height = $(window).height() - 20;
            if ($(id + " .modal-footer").length > 0) {
                opt.height -= 66;
            }
            $(id + " .modal-dialog").css("padding-top", '8px');
        }
        if (opt.height) {
            $(id + " .modal-body").css("height", opt.height + "px");
        }
        if (opt.width) {
            $(id + " .modal-content").css("width", opt.width + "px");
            $(id + " .modal-dialog").css("width", opt.width + "px");
        }
        if (opt.url && opt.url != qwp.uri.blank) {
            qwp.ui.loadingFrame(dialogId + "_frame", opt.url);
        }
    },
    _updateDialogSize: function(id) {
        id = qwp.id(id);
        if ($(id + " iframe[qwp='frame']").length > 0) return;
        qwp.ui.setPaddingLeft(id, '0');
        var content = $(id + ">.modal-dialog>.modal-content .modal-body");
        content.slimscroll({height: content.height() + 'px'});
    }
};
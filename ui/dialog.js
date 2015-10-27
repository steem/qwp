/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
qwp.dialog = {
    init: function() {

    },
    showMsgBox: function(opt) {
        if (!opt) opt = {};
        qwp.dialog.show('qwp_mbox', opt);
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
        var obj = $(id + " [qwp='ok']");
        obj.unbind("click");
        if (opt.ok) {
            obj.click(opt.ok);
        }
        obj = $(id + " [qwp='cancel']");
        obj.unbind("click");
        if (opt.cancel) {
            obj.click(opt.cancel);
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
        if (opt.url) {
            qwp.ui.loadingFrame(dialogId + "_frame", opt.url);
        }
    },
    _updateDialogSize: function(id) {
        id = qwp.id(id);
        $(id).css('padding-left', '0');
        var content = $(id + ">.modal-dialog>.modal-content .modal-body");
        content.slimscroll({height: content.height() + 'px'});
    }
};
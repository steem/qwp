qwp.dialog = {
    showMsgBox: function(opt) {
        if (!opt) opt = {};
        qwp.dialog.customize('qwp_mbox', opt);
        $('#qwp_mbox').modal();
    },
    confirmForm: function (dialog, btn) {
        var f = $(dialog + " [qwp='ok']");
        f.unbind("click");
        f.click(function () {
            $(dialog).data('clicked', true);
            $(btn).click();
        });
    },
    customize: function(dialogId, opt) {
        id = "#" + dialogId;
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
            $(id + " [qwp='content']").html(opt.message);
        }
        if (opt.max) {
            opt.height = $(window).height() - 80;
            if ($(id + " .modal-footer").length > 0) {
                opt.height -= 66;
            }
            opt.width = $(window).width() - 60;
            $(id + " .modal-dialog").css("padding-top", '8px');

        } else if (opt.maxHeight) {
            opt.height = $(window).height() - 80;
            if ($(id + " .modal-footer").length > 0) {
                opt.height -= 66;
            }
            $(id + " .modal-dialog").css("padding-top", '8px');
        } else {
            $(id + " .modal-dialog").css("padding-top", '80px');
        }
        if (opt.height) {
            $(id + " [qwp='content']").css("height", opt.height + "px");
        }
        if (opt.width) {
            $(id + " .modal-content").css("width", opt.width + "px");
            $(id + " .modal-dialog").css("width", opt.width + "px");
        }
        if (opt.url) {
            qwp.loadingFrame(dialogId + "_frame", opt.url);
        }
    }
}
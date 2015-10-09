qwp.dialog = {
    bindActions: function (dialogId, opt) {
        dialogId = "#" + dialogId;
        if (opt.ok) {
            var obj = $(dialogId + " [mtag='ok']");
            obj.unbind("click");
            obj.click(opt.ok);
        }
        if (opt.cancel) {
            var obj = $(dialogId + " [mtag='cancel']");
            obj.unbind("click");
            obj.click(opt.cancel);
        }
    },
    confirmForm: function (dialog, btn) {
        var f = $(dialog + " [mtag='ok']");
        f.unbind("click");
        f.click(function () {
            $(dialog).data('clicked', true);
            $(btn).click();
        });
    }
}
function dialogBtnActions(dialogId, opt) {
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
}
function dialogConfirmForm(dialogId, btn) {
    dialogId = '#' + dialogId;
    f = $(dialogId + " [mtag='ok']");
    f.unbind("click");
    f.click(function(){
        $(dialogId).data('checked', true);
        $(btn).click();
    });
}
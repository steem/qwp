function $noop() {}
function $img(src) {
    var m = new Image();
    m.src = src;
    return m;
}
function $L(txt) {
    if (!_LANG) return txt;
    return _LANG[txt] ? _LANG[txt] : txt;
}
function $To(url) {
    window.location = url;
}
function $TopTo(url) {
    top.location = url;
}
function $Reload() {
    window.location.reload();
}
if (top == window) {
    var _loading_img = $img('img/loading_small.gif');
}
function loading(frameId, page, bdcache) {
    var frame = $("#"+frameId);
    if (frame.length == 0) return;
    var ifm = typeof(frameId) == 'string' ? F(frameId) : frameId;
    var org_page = frame.attr("src");
    if (isNull(org_page) && (!page || isNull(page))){
        return;
    }
    if (!page || isNull(page)) {
        page = frame.attr("src");
    }
    if (bdcache && !isNull(org_page) && org_page == page){
        return;
    }
    var img_url = top._loading_img.src;
    frame.attr("src", "about:blank");
    if (ifm.window && ifm.window.document && ifm.window.document.body) {
        ifm.window.document.body.style.backgroundColor = "white";
        ifm.window.document.body.style.fontSize = "12px";
        ifm.window.document.body.innerHTML = "&nbsp;<br>"+html_div(html_img({border:'0',src:img_url})+"<br>" + _L("Loading page..."),{align:'center'});
    }
    frame.attr("src", page);
}
$H = {};
(function(){
    window.$H.$attr = function(attrs, sep) {
        if (!attrs) {
            return '';
        }
        sep = sep || ' ';
        var at = ' ', preSep = '';
        for(var k in attrs) {
            if (!attrs[k]) {
                continue;
            }
            if (attrs[k] === true) {
                at += preSep + k;
                continue;
            }
            var t = typeof(attrs[k]);
            if (t == 'function') {
                continue;
            }
            if (t == 'object') {
                at += preSep + window.$H.$attr(attrs[k], ';');
            } else {
                at += preSep + k + '="' + attrs[k].toString() + '"';
            }
            preSep = sep;
        }
        return at;
    };
    window.$H.$ele = function(tag, txt, attrs) {
        return txt ? "<" + tag + window.$H.$attr(attrs) + ">" + txt + "</" + tag + ">" : "<" + tag + window.$H.$attr(attrs) + " />";
    };
    function fn1(tag) {
        return function(txt, attrs) {
            return window.$H.$ele(tag, txt, attrs);
        }
    }
    function fn2(tag) {
        return function(attrs) {
            return window.$H.$ele(tag, false, attrs);
        }
    }
    function fn3(tag, type) {
        return function(attrs) {
            attrs = attrs || {};
            attrs.type = type;
            return window.$H.$ele(tag, false, attrs);
        }
    }
    var tag, htmlElements = ['p', 'h1', 'h2', 'h3', 'ul', 'li', 'b', 'div', 'option', 'select', 'label', 'span', 'em', 'table', 'th', 'tr', 'td', 'pre', 'code', 'option'];
    for (var i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        window.$H[tag] = fn1(tag)
    }
    htmlElements = ['img', 'br', 'input'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        window.$H[tag] = fn2(tag);
    }
    htmlElements = ['radio', 'checkbox', 'text', 'submit', 'hidden', 'reset', 'file', 'password'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        window.$H[tag] = fn3('input', tag);
    }
})();
var $PAGE={};
function fillDateRange(selector) {
    var o = $("input[data-rel='date-range']");
    o.each(function (i, d) {
        var v = this.value;
        if (v.length > 0) {
            v = v.split('-');
            v[0] = v[0].trim();
            v[1] = v[1].trim();
            d = $(d);
            d.data('daterangepicker').setStartDate(v[0]);
            d.data('daterangepicker').setEndDate(v[1]);
        }
    });
}
function fillOneForm(selector, values) {
    for (var n in values) {
        var fields = $(selector + " input[name='f[" + n + "]']");
        if (fields.length > 0) {
            fields.val(values[n]);
            continue;
        }
        fields = $(selector + " textarea[name='f[" + n + "]']");
        if (fields.length > 0) {
            fields.val(values[n]);
            continue;
        }
        fields = $(selector + " select[name='f[" + n + "]']");
        if (fields.length > 0) {
            fields.val(values[n]);
        }
    }
}
function $F() {
    if (!$PAGE.forms) return;
    for (var f in $PAGE.forms) {
        fillOneForm(f, $PAGE.forms[f]);
    }
}
function $S() {
    if (!$PAGE.search) return;
    var s = $PAGE.search;
    for (var n in s) {
        var fields = $("input[name='s[" + n + "]']");
        if (fields.length > 0) {
            fields.val(s[n]);
            continue;
        }
        fields = $("textarea[name='s[" + n + "]']");
        if (fields.length > 0) {
            fields.val(s[n]);
            continue;
        }
        fields = $("select[name='s[" + n + "]']");
        if (fields.length > 0) {
            fields.val(s[n]);
        }
    }
}
//title, notice, timeout, type, position, image, callbacks, css
var lastGritterId = false;
function gritterNotice(notice, opt) {
    if (lastGritterId) $.gritter.remove(lastGritterId);
    var option = {};
    if (opt) $.extend(option, opt);
    var title = option.title || "";
    var image = option.image || "";
    var css = option.css || "";
    var timeout = option.timeout || 2;
    timeout *= 1000;
    if (option.fn) setTimeout(option.fn, timeout);
    var types = {
        error:"gritter-error",
        success:"gritter-success",
        warning:"gritter-warning",
        info:"gritter-info"
    };
    var type = types[option.type] ? types[option.type] : types["info"];
    var positions = {
        center:"gritter-center",
        right:""
    };
    var position = option.position ? positions[option.position] : positions["right"];
    lastGritterId = $.gritter.add({
        text: notice,
        title: title,
        image: image,
        time: timeout,
        class_name: type + " " + position + " " + css,
        before_open: function(e) {
            if (option.before_open) {
                option.before_open(e);
            }
        },
        after_open: function(e) {
            if (option.after_open) {
                option.after_open(e);
            }
        },
        before_close: function(e, manual_close) {
            if (option.before_close) {
                option.before_close(e, manual_close);
            }
        },
        after_close: function(e, manual_close) {
            if (option.after_close) {
                option.after_close(e, manual_close);
            }
        }
    });
    return lastGritterId;
}
function createOpsHandler(actionHandler, option, confirmDialog) {
    var opt = {}, fn = $noop;
    if (actionHandler) {
        var ft = $.type(actionHandler);
        if (ft == 'string') {
            fn = window[actionHandler];
        } else if (ft == 'function') {
            fn = actionHandler;
        }
    }
    if (option) $.extend(opt, option);
    return function(res) {
        if (confirmDialog) $(confirmDialog).data('checked', false);
        var data = res.data || {}, timeout = res.ret ? 3 : 5;
        if (!res.ret && data.toLogin) {
            gritterNotice(res.msg, {
                timeout: timeout,
                type: 'error',
                image: 'img/loading_small.gif',
                fn: function () {
                    $TopTo(data.toLogin);
                }
            });
            return;
        }
        if (opt.quiet) {
            fn(res, data);
            if (res.ret && opt.reload) $Reload();
            return;
        }
        if (res.ret && opt.reload) {
            fn(res, data);
            gritterNotice(res.msg + "<br />" + $L("Prepare to refresh page..."), {
                timeout: timeout,
                type: res.msg_type,
                image: 'img/loading_small.gif',
                fn: function () {
                    $Reload();
                }
            });
            return;
        }
        fn(res, data);
        if (res.ret && (data.to || data.topTo)) {
            gritterNotice(res.msg + "<br />" + $L("Prepare to relocation..."), {
                timeout: timeout,
                type: res.msg_type,
                image: 'img/loading_small.gif',
                fn: function () {
                    if (data.to) $To(data.to);
                    else if (data.topTo) $TopTo(data.topTo);
                }
            });
            return;
        }
        gritterNotice(res.msg, {
            timeout: timeout,
            type: res.msg_type
        });
    }
}
function createSubmitHandler(submitHandler, message, confirmDialog) {
    var fn = submitHandler ? window[submitHandler] : function(){return true};
    return function(v, f, e) {
        if (fn(v, f, e) === false) return false;
        if (!confirmDialog) {
            return  true;
        }
        if ($(confirmDialog).data('checked')) {
            gritterNotice(message);
            return true;
        }
        return false;
    }
}
function createOneFormValidation(v) {
    var rules = {}, messages = {};
    for (var r in v.rules) {
        var item = {}, fieldName = 'f[' + r + ']';
        for (var k in v.rules[r]) {
            var rv = v.rules[r][k];
            if (k == '_msg') {
                messages[fieldName] = rv;
            } else {
                item[k] = k == 'equalTo' ? rv[0] : rv;
            }
        }
        rules[fieldName] = item;
    }
    var opt = {
        errorElement: 'div',
        errorClass: 'help-inline',
        rules: rules,
        messages: messages,
        submitHandler: createSubmitHandler(v.submitHandler, v.message, v.confirmDialog)
    };
    if (v.invalidHandler) opt.invalidHandler = window[v.invalidHandler];
    var aF = $(v.selector);
    aF.validate(opt);
    if (v.actionHandler) {
        var fnHandler = createOpsHandler(v.actionHandler, v.handlerOption, v.confirmDialog);
        opt = {
            error: function() {fnHandler({ret:false, msg: $L('Operation failed')});},
            success: fnHandler
        };
        opt.dataType = v.dataType ? v.dataType : 'json';
        aF.ajaxForm(opt);
    }
}
function ajaxAction(options) {
    if (!options.quiet) {
        gritter_notice(options.text,{
            timeout:4,
            image:'img/loading_small.gif'
        });
    }
    var fn = createOpsHandler(options.fn, options);
    $.ajax({
        url: options.url,
        data: options.params ? options.params : "",
        type: options.type,
        dataType: options.dataType || 'json',
        async:true,
        success: fn,
        timeout: options.timeout || 60000,
        error: function() {
            fn({ret:false, msg: $L('Operation failed')});
        }
    });
}
function $post(options) {
    options.type = "POST";
    ajaxAction(options);
}
function $get(options) {
    options.type = "GET";
    ajaxAction(options);
}
function $FV() {
    for (var i = 0, cnt = $PAGE.validator.length; i < cnt; ++i) {
        createOneFormValidation($PAGE.validator[i]);
    }
}
function $READY() {
    for (var i = 0; i < _$R.length; ++i) {
        _$R[i]();
    }
    $FV();
    $F();
    $S();
    fillDateRange();
}
function searchAction(f) {
    $(f + " button[type='submit']").click(function(){
        var p = $(f).serialize();
        if (p.length === 0) return false;
        $To($PAGE.baseUrl.indexOf('?') != -1 ? $PAGE.baseUrl + '&' + p : $PAGE.baseUrl + '?' + p);
        return false;
    });
    $(f + " button[type='reset']").click(function(){
        $To($PAGE.baseUrl);
    });
}
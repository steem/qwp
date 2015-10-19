if (typeof String.prototype.format != 'function') {
    String.prototype.format = function() {
        var s = this;
        if (arguments.length === 0) return s;
        for (var i = 0, cnt = arguments.length; i < cnt; ++i) {
            s = s.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i]);
        }
        return s;
    };
}
function $noop() {}
function $L(txt) {
    if (_LANG && _LANG[txt]) txt = _LANG[txt];
    if (arguments.length == 1) return txt;
    for (var i = 1, cnt = arguments.length; i < cnt; ++i) {
        var idx = i - 1;
        txt = txt.replace(new RegExp("\\{" + idx + "\\}", "gm"), arguments[i]);
    }
    return txt;
}
$H = {};
(function($H){
    $H.anonymousIndex = 1;
    $H.attr = function(attrs, sep, eq, vtag) {
        if (!attrs) {
            return '';
        }
        sep = sep || ' ';
        eq = eq || '=';
        if ($.type(vtag) == 'undefined') vtag = '"';
        var at = ' ', preSep = '';
        for (var k in attrs) {
            if (!attrs[k]) {
                continue;
            }
            var v = attrs[k];
            if (v === true) {
                at += preSep + k;
                continue;
            }
            var t = $.type(v), d;
            var isFn = t == 'function';
            if (isFn) {
                if (k != 'onclick') {
                    continue;
                }
            }
            var d;
            if (t == 'object') {
                var t1 = ';', t2 = ':', t3 = '', vt = {};
                $.extend(vt, v);
                if (vt._sep) {
                    t1 = vt._sep;
                    delete vt._sep;
                }
                if (vt._eq) {
                    t2 = vt._eq;
                    delete vt._eq;
                }
                if (vt._vtag) {
                    t3 = vt._vtag;
                    delete vt._vtag;
                }
                d = $H.attr(vt, t1, t2, t3);
            } else {
                if (k == 'onclick') {
                    if (!isFn) {
                        d = v;
                        if (v.indexOf('(') == -1) {
                            d += '()'
                        }
                    } else {
                        var fIdx = 'qwp_anon' + $H.anonymousIndex;
                        d = fIdx + '()';
                        window[fIdx] = v;
                        ++$H.anonymousIndex;
                    }
                } else {
                    d = v.toString();
                }
            }
            at += preSep + k + eq + vtag + d + vtag;
            preSep = sep;
        }
        return at;
    };
    $H.ele = function(tag, txt, attrs) {
        return txt ? "<" + tag + $H.attr(attrs) + ">" + txt + "</" + tag + ">" : "<" + tag + $H.attr(attrs) + " />";
    };
    $H.tagStart = function(tag, attrs) {
        return "<" + tag + $H.attr(attrs) + ">";
    };
    function fn1(tag) {
        return function(txt, attrs) {
            return $H.ele(tag, txt, attrs);
        }
    }
    function fn2(tag) {
        return function(attrs) {
            return $H.ele(tag, false, attrs);
        }
    }
    function fn3(tag, type) {
        return function(attrs) {
            attrs = attrs || {};
            attrs.type = type;
            return $H.ele(tag, false, attrs);
        }
    }
    function fn4(tag) {
        return function(attrs) {
            return $H.tagStart(tag, attrs);
        }
    }
    var tag, htmlElements = ['p', 'h1', 'h2', 'h3', 'ul', 'li', 'b', 'div', 'option', 'select', 'thead',
        'label', 'span', 'em', 'table', 'tbody', 'th', 'tr', 'td', 'pre', 'code', 'option', 'i', 'a', 'nav'];
    for (var i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $H[tag] = fn1(tag)
    }
    htmlElements = ['img', 'br', 'input'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $H[tag] = fn2(tag);
    }
    htmlElements = ['radio', 'checkbox', 'text', 'submit', 'hidden', 'reset', 'file', 'password'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $H[tag] = fn3('input', tag);
    }
    htmlElements = ['table'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $H[tag + 'Start'] = fn4(tag);
        $H[tag + 'End'] = '</' + htmlElements[i] + '>';
    }
    $H.spacer = $H.img({border:0, src:'img/spacer.gif'});
})($H);
function $img(src) {
    var m = new Image();
    m.src = src;
    return m;
}
if (top == window) {
    qwp.loadingImg = $img('img/loading_small.gif');
}
$.extend(qwp, {
    _:'&nbsp',
    to: function(url, isTop) {
        (isTop ? top : window).location = url;
    },
    reload: function() {
        window.location.reload();
    },
    once: function(f, timeout) {
        return setTimeout(f, timeout);
    },
    fillOneForm: function(selector, values) {
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
    },
    fillForm: function() {
        for (var f in qwp.page.forms) {
            qwp.fillOneForm(f, qwp.page.forms[f]);
        }
    },
    fillSearch: function() {
        var s = qwp.page.search;
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
    },
    lastGritterId: false,
    //title, notice, timeout, type, position, image, callbacks, css
    notice: function(notice, opt) {
        if (qwp.lastGritterId) $.gritter.remove(qwp.lastGritterId);
        var option = {};
        if (opt) $.extend(option, opt);
        var title = option.title || "";
        var image = option.image || "";
        var css = option.css || "";
        var timeout = option.timeout || 2;
        timeout *= 1000;
        if (option.fn) qwp.once(option.fn, timeout);
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
        qwp.lastGritterId = $.gritter.add({
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
        return qwp.lastGritterId;
    },
    createOpsHandler: function(actionHandler, option) {
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
            if (opt.confirmDialog) $(opt.confirmDialog).data('clicked', false);
            var data = res.data || {}, timeout = res.ret ? 3 : 5;
            if (!res.ret && data.toLogin) {
                qwp.notice(res.msg, {
                    timeout: timeout,
                    type: 'error',
                    image: 'img/loading_small.gif',
                    fn: function () {
                        qwp.to(data.toLogin, true);
                    }
                });
                return;
            }
            if (opt.quiet) {
                fn(res, data);
                if (res.ret && opt.reload) qwp.reload();
                return;
            }
            if (res.ret && opt.reload) {
                fn(res, data);
                qwp.notice(res.msg + "<br />" + $L("Prepare to refresh page..."), {
                    timeout: timeout,
                    type: res.msg_type,
                    image: 'img/loading_small.gif',
                    fn: function () {qwp.reload();}
                });
                return;
            }
            fn(res, data);
            if (res.ret && (data.to || data.topTo)) {
                qwp.notice(res.msg + "<br />" + $L("Prepare to relocation..."), {
                    timeout: timeout,
                    type: res.msg_type,
                    image: 'img/loading_small.gif',
                    fn: function () {
                        if (data.to) qwp.to(data.to);
                        else if (data.topTo) qwp.to(data.topTo, true);
                    }
                });
                return;
            }
            qwp.notice(res.msg, {
                timeout: timeout,
                type: res.msg_type
            });
        }
    },
    createSubmitHandler: function(submitHandler, message, confirmDialog, mbox, submitButton) {
        var fn = submitHandler ? window[submitHandler] : function(){return true};
        return function(v, f, e) {
            if (fn(v, f, e) === false) return false;
            if (!confirmDialog || $(confirmDialog).data('clicked')) {
                qwp.notice(message);
                return true;
            }
            if (confirmDialog == '#qwp_mbox') {
                qwp.dialog.showMsgBox(mbox);
                qwp.dialog.confirmForm(confirmDialog, submitButton);

            } else {
                $(confirmDialog).modal();
            }
            return false;
        }
    },
    createOneFormValidation: function(v) {
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
            submitHandler: qwp.createSubmitHandler(v.beforeSubmit, v.actionMessage, v.confirmDialog, v.mbox, v.submitButton)
        };
        if (v.invalidHandler) opt.invalidHandler = window[v.invalidHandler];
        var aF = $(v.cssSelector);
        aF.validate(opt);
        if (v.actionHandler) {
            opt = {};
            if (v.handlerOption) $.extend(opt, v.handlerOption);
            if (v.confirmDialog) opt.confirmDialog = v.confirmDialog;
            var fnHandler = qwp.createOpsHandler(v.actionHandler, opt);
            opt = {
                error: function() {fnHandler({ret:false, msg: $L('Operation failed')});},
                success: fnHandler
            };
            opt.dataType = v.dataType ? v.dataType : 'json';
            aF.ajaxForm(opt);
        }
        if (v.confirmDialog) {
            qwp.dialog.confirmForm(v.confirmDialog, v.submitButton);
        }
    },
    ajax: function(options) {
        if (!options.quiet) {
            qwp.notice(options.text,{
                timeout:4,
                image:'img/loading_small.gif'
            });
        }
        var fn = qwp.createOpsHandler(options.fn, options);
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
    },
    post: function(options) {
        options.type = "POST";
        qwp.ajax(options);
    },
    get: function(options) {
        options.type = "GET";
        qwp.ajax(options);
    },
    copy: function(dst, src, attr) {
        if (!attr) {
            $.extend(dst, src);
            return;
        }
        if ($.type(attr) == 'string') attr = [attr];
        for (var i = 0, cnt = attr.length; i < cnt; ++i) {
            var k = attr[i];
            if (src[k]) dst[k] = src[k];
        }
    },
    copyWhenEmpty: function(dst, src, attr) {
        if ($.type(attr) == 'string') attr = [attr];
        for (var i = 0, cnt = attr.length; i < cnt; ++i) {
            var k = attr[i];
            if (!dst[k] && src[k]) dst[k] = src[k];
        }
    },
    createFormValidation: function() {
        for (var i = 0, cnt = qwp.page.validator.length; i < cnt; ++i) {
            qwp.createOneFormValidation(qwp.page.validator[i]);
        }
    },
    search: function(f, fetchData) {
        $(f + " button[type='submit']").click(function(){
            var p = $(f).serialize();
            if (p.length === 0) return false;
            if (fetchData) {
                window[fetchData](1,0,0,0,p);
            } else {
                qwp.to(qwp.uri.hasParams ? qwp.uri.baseUrl + '&' + p : qwp.uri.baseUrl + '?' + p);
            }
            return false;
        });
        $(f + " button[type='reset']").click(function() {
            if (fetchData) {
                window[fetchData](1, 0, 0, 0, 0);
            } else {
                qwp.to(qwp.uri.baseUrl);
            }
        });
    },
    frameWindow: function(name) {
        return document.all ? window.frames[name] : $("#"+name)[0].contentWindow;
    },
    loadingFrame: function(frameId, page, reloadWhenSrcIsSame) {
        var frame = $("#"+frameId);
        if (frame.length == 0) return;
        var ifm = typeof(frameId) == 'string' ? qwp.frameWindow(frameId) : frameId;
        var oldPage = frame.attr("src");
        if (qwp.isEmpty(oldPage) && qwp.isEmpty(page)){
            return;
        }
        if (qwp.isEmpty(page)) {
            page = frame.attr("src");
        }
        if (!reloadWhenSrcIsSame && !qwp.isEmpty(oldPage) && oldPage == page){
            return;
        }
        var imgUrl = top.qwp.loadingImg.src;
        frame.attr("src", "about:blank");
        if (ifm.window && ifm.window.document && ifm.window.document.body) {
            ifm.window.document.body.style.backgroundColor = "white";
            ifm.window.document.body.style.fontSize = "12px";
            ifm.window.document.body.innerHTML = "&nbsp;<br>" + $H.div($H.img({border:'0', src:imgUrl}) +
                "<br>" + $L("Loading page..."), {align:'center'});
        }
        frame.attr("src", page);
    },
    _ui: [],
    ui: function(f) {
        qwp._ui.push(f);
    },
    initUIComponents: function () {
        $('[data-rel=tooltip]').each(function (i, e) {
            e = $(e);
            if (!e.hasClass('tooltip-info')) e.addClass('tooltip-info');
            e.tooltip();
        });
        for (var i = 0; i < qwp._ui.length; ++i) {
            qwp._ui[i]();
        }
    },
    resize: function(f) {
        $(window).resize(f);
    }
});
qwp.uri = {
    root: './',
    currentPage: function(p, params) {
        return qwp.page(p ? p : qwp.p, params);
    },
    currentOps: function(ops, params) {
        return qwp.ops(ops, qwp.p, params);
    },
    currentHome: function(params) {
        return qwp.module(qwp.m, params);
    },
    defaultModule: function(params) {
        return qwp.module(qwp.m, params);
    },
    createUrlWithoutSortParams: function(params) {
        var p = $.type(params) == 'string' ? params : $.param(params);
        if (!p) return qwp.uri.curUrlNoSort;
        return qwp.uri.curUrlNoSort + (qwp.uri.curUrlNoSortHasParams ? '&' : '?') + p;
    },
    join: function() {
        var p = '', sep = '';
        for (var i = 0, cnt = arguments.length; i < cnt; ++i) {
            if (arguments[i].length) {
                p += sep + arguments[i];
                sep = '&';
            }
        }
        return p;
    },
    module: function(m, params) {
        var p = '';
        if (m) p = 'm=' + m;
        if (params) {
            if ($.type(params) != 'string') {
                params = $.param(params);
            }
            p = qwp.uri.join(p, params);
        }
        if (p.length) return qwp.uri.root + '?' + p;
        return qwp.uri.root;
    },
    page: function(p, params, m) {
        if (!m) {
            m = qwp.m;
        }
        var p = '';
        if (m) p = 'm=' + m;
        if (p) p = qwp.uri.join(p, 'p=' + p);
        if (params) {
            if ($.type(params) != 'string') {
                params = $.param(params);
            }
            p = qwp.uri.join(p, params);
        }
        if (p.length) return qwp.uri.root + '?' + p;
        return qwp.uri.root;
    },
    ops: function(ops, p, params, m) {
        if (!m) {
            m = qwp.m;
        }
        var p = '';
        if (m) p = 'm=' + m;
        if (p) p = qwp.uri.join(p, 'p=' + p);
        p = qwp.uri.join(p, 'op=' + ops);
        if (params) {
            if ($.type(params) != 'string') {
                params = $.param(params);
            }
            p = qwp.uri.join(p, params);
        }
        if (p.length) return qwp.uri.root + '?' + p;
        return qwp.uri.root;
    },
    logout: function() {
        return qwp.ops('logout', false, false, 'passport');
    },
    createPagerParams: function(page, psize, sortf, sort) {
        var p = {};
        if (page) p.page = page;
        if (psize) p.psize = psize;
        if (sortf) p.sortf = sortf;
        if (sort) p.sort = sort;
        return p;
    },
    clearSortParams: function(url) {
        return url.replace(/&sortf=[\w-]+/ig, '').
            replace(/&sort=[\w-]+/ig, '').
            replace(/&sort=[\w-]+/ig, '').
            replace(/&sort=[\w-]+/ig, '');
    },
    init: function() {
        var tmp = location.search ? location.search.replace(/(&s\[.+\]=[%|\w|\+\-\.\+]+)|(&s%5b.+%5d=[%|\w|\+\-\.\+]+)/i, '').replace(/(&s\[.+\]=)|(&s%5b.+%5d=)/i, '') : '';
        qwp.uri.baseUrl = './' + (tmp ? tmp : '');
        qwp.uri.baseUrlHasParams = !!tmp;
        qwp.uri.curUrl = './' + (location.search ? location.search : '');
        tmp = qwp.uri.clearSortParams(qwp.uri.curUrl);
        qwp.uri.curUrlNoSort = tmp;
        qwp.uri.curUrlNoSortHasParams = !!tmp;
        qwp.uri.hasParams = location.search ? true : false;
    }
};
function $READY() {
    qwp.uri.init();
    for (var i = 0; i < qwp._r.length; ++i) {
        qwp._r[i]();
    }
    qwp.initUIComponents();
    if (qwp.page) {
        qwp.createFormValidation();
        qwp.fillForm();
        qwp.fillSearch();
    }
}
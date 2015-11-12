/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
// return function name if it's global function
qwp.$fn = function(fn) {
    var t = $.type(fn);
    if (t == 'string') return fn;
    if (t != 'function') return false;
    var s = fn.toString().substr(8);
    t = s.indexOf('{');
    if (t == -1) return false;
    s = s.substr(0, t - 1).trim();
    if (!s.length || s == 'anonymous') return false;
    return window[s] ? s : false;
};
function $img(src) {
    var m = new Image();
    m.src = src;
    return m;
}
if (top == window) {
    qwp.loadingImg = $img('img/loading_small.gif');
}
if (typeof String.prototype.format != 'function') {
    String.prototype.format = function() {
        var s = this;
        if (arguments.length === 0) return s;
        if ($.isPlainObject(arguments[0])) {
            for (var p in arguments[0]) {
                s = s.replace(new RegExp("\\{" + p + "\\}", "g"), arguments[0][p]);
            }
            return s;
        }
        for (var i = 0, cnt = arguments.length; i < cnt; ++i) {
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        }
        return s;
    };
}
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) == str;
    };
}
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
if (typeof String.prototype.trim != 'function') {
    String.prototype.trim = function() {
        return this.replace(/(^\s+)|(\s+$)/g, "");
    };
}
if (typeof String.prototype.ltrim != 'function') {
    String.prototype.ltrim = function() {
        return this.replace(/(^\s+)/g, "");
    };
}
if (typeof String.prototype.ltrim != 'function') {
    String.prototype.rtrim = function() {
        return this.replace(/(\s+$)/g, "");
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
$h = {};
(function($, $h){
    $h.anonymousIndex = 1;
    $h.anon = function(fn, prefix) {
        if (!prefix) prefix = 'anon';
        prefix = 'qwp_' + prefix + '_' + $h.anonymousIndex;
        ++$h.anonymousIndex;
        window[prefix] = fn;
        return prefix;
    };
    $h.attr = function(attrs, sep, eq, vtag) {
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
            if (t == 'function') {
                if (k != 'onclick') {
                    continue;
                }
            }
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
                d = $h.attr(vt, t1, t2, t3);
            } else {
                if (k == 'onclick') {
                    d = qwp.$fn(v);
                    if (d) {
                        if (d.indexOf('(') == -1) d += '()';
                    } else {
                        d = $h.anon(v) + '()';
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
    $h.ele = function(tag, txt, attrs) {
        return txt ? "<" + tag + $h.attr(attrs) + ">" + txt + "</" + tag + ">" : "<" + tag + $h.attr(attrs) + " />";
    };
    $h.tagStart = function(tag, attrs) {
        return "<" + tag + $h.attr(attrs) + ">";
    };
    function fn1(tag) {
        return function(txt, attrs) {
            return $h.ele(tag, txt, attrs);
        }
    }
    function fn2(tag) {
        return function(attrs) {
            return $h.ele(tag, false, attrs);
        }
    }
    function fn3(tag, type) {
        return function(attrs) {
            attrs = attrs || {};
            attrs.type = type;
            return $h.ele(tag, false, attrs);
        }
    }
    function fn4(tag) {
        return function(attrs) {
            return $h.tagStart(tag, attrs);
        }
    }
    var tag, htmlElements = ['p', 'h1', 'h2', 'h3', 'ul', 'li', 'b', 'div', 'option', 'select', 'thead',
        'label', 'span', 'em', 'table', 'tbody', 'th', 'tr', 'td', 'pre', 'code', 'option', 'i', 'a', 'nav'];
    for (var i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $h[tag] = fn1(tag)
    }
    htmlElements = ['img', 'br', 'input'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $h[tag] = fn2(tag);
    }
    htmlElements = ['radio', 'checkbox', 'text', 'submit', 'hidden', 'reset', 'file', 'password'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $h[tag] = fn3('input', tag);
    }
    htmlElements = ['table'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $h[tag + 'Start'] = fn4(tag);
        $h[tag + 'End'] = '</' + htmlElements[i] + '>';
    }
    $h.spacer = $h.img({border:0, src:'img/spacer.gif'});
    $.extend(qwp, {
        _:'&nbsp',
        isString: function(v) {
            return $.type(v) == 'string';
        },
        in: function(v, arr) {
            if (!arr) return false;
            for (var i = 0, cnt = arr.length; i < cnt; ++i) {
                if (v == arr[i]) return true;
            }
            return false;
        },
        id: function(id) {
            return '#' + id;
        },
        cls: function(cls) {
            return '.' + cls;
        },
        to: function(url, isTopOrP, p) {
            if (!url) url = qwp.uri.curUrl;
            var isTop = false;
            if (isTopOrP === true) isTop = true;
            else if (isTopOrP) p = isTopOrP;
            if (p) {
                if (url.indexOf('?') == -1) url += '?';
                else url += '&';
                if (qwp.isString(p)) url += p;
                else url += $.param(p);
            }
            (isTop ? top : window).location = url;
        },
        reload: function() {
            window.location.reload();
        },
        once: function(f, timeout) {
            return setTimeout(f, timeout);
        },
        camelCase: function(s) {
            if (!s) return s;
            return s.substr(0, 1).toUpperCase() + s.substr(1);
        },
        isCorrectExt: function(fileName, exts) {
            fileName = fileName.toLowerCase();
            if (!$.isArray(exts)) exts = exts.split(',');
            for (var i = 0, cnt = exts.length; i < cnt; ++i) {
                if (fileName.endsWith('.' + exts[i])) {
                    return true;
                }
            }
            return false;
        },
        createOpsHandler: function(actionHandler, option) {
            var opt = {}, fn = $noop, formParams = null;
            if (actionHandler) {
                var ft = $.type(actionHandler);
                if (ft == 'string') {
                    fn = window[actionHandler];
                } else if (ft == 'function') {
                    fn = actionHandler;
                }
            }
            if (option.form) {
                formParams = $(option.form).data('qwp-params');
                delete option.form;
            }
            if (option) $.extend(opt, option);
            return function(res) {
                if (opt.confirmDialog) $('#' + opt.confirmDialog).data('clicked', false);
                if (res.ret && opt.formParentDialog) $('#' + opt.formParentDialog).modal('hide');
                var data = res.data || {}, timeout = res.ret ? 3 : 6;
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
                    fn(res, data, formParams);
                    if (res.ret && opt.reload) qwp.reload();
                    return;
                }
                if (res.ret && opt.reload) {
                    fn(res, data, formParams);
                    qwp.notice(res.msg + "<br />" + $L("Prepare to refresh page..."), {
                        timeout: timeout,
                        type: res.msg_type,
                        image: 'img/loading_small.gif',
                        fn: function () {qwp.reload();}
                    });
                    return;
                }
                fn(res, data, formParams);
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
        ajax: function(options) {
            if (!options.quiet) {
                qwp.notice(options.text || $L('Operation is in processing, please wait...'),{
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
            if (qwp.isString(attr)) attr = [attr];
            for (var i = 0, cnt = attr.length; i < cnt; ++i) {
                var k = attr[i];
                if (src[k]) dst[k] = src[k];
            }
        },
        copyWhenEmpty: function(dst, src, attr) {
            if (qwp.isString(attr)) attr = [attr];
            for (var i = 0, cnt = attr.length; i < cnt; ++i) {
                var k = attr[i];
                if (!dst[k] && src[k]) dst[k] = src[k];
            }
        },
        isValidInput: function(v, ruleName) {
            if (!qwp.page.inputRules || !qwp.page.inputRules[ruleName]) return false;
            var re, r = qwp.page.inputRules[ruleName];
            if (qwp.isString(r)) {
                re = new RegExp(r);
                return re.test(v);
            } else if (qwp.isString(r[0])) {
                re = new RegExp(r[0], r[1]);
                return re.test(v);
            }
            var sub = r[0];
            for (var i = 0, cnt = sub.length; i < cnt; ++i) {
                if (r[1][i]) {
                    re = new RegExp(sub[i], r[1][i]);
                } else {
                    re = new RegExp(sub[i]);
                }
                if (!re.test(v)) {
                    return false;
                }
            }
            return true;
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
            var timeout = option.timeout || ((option.type && (option.type == 'error' || option.type == 'warning')) ? 6 : 3);
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
            var position = option.position ? positions[option.position] : positions["center"];
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
        removeNotice: function() {
            if (qwp.lastGritterId) {
                $.gritter.remove(qwp.lastGritterId);
                qwp.lastGritterId = false;
            }
        }
    });
    qwp.ui = {
        defaultIcon: 'glyphicon',
        icon: function(cls, full) {
            cls = qwp.ui.defaultIcon + '-' + cls;
            return full ? qwp.ui.defaultIcon + ' ' + cls : cls;
        },
        init: function() {
            qwp.ui._createFns();
            qwp.ui.createUIComponents();
        },
        _createFns: function() {
            if (qwp.ui._inited) return;
            qwp.ui._inited = true;
            var e4 = ['padding', 'margin'];
            for (var i = 0, cnt = e4.length; i < cnt; ++i) {
                qwp.ui._createFn4(e4[i]);
            }
            qwp.ui._createFn4('border', 'width');
        },
        _createFn4: function(n, suffix) {
            var inside = '';
            if (suffix) inside = '-' + suffix;
            qwp.ui[n] = function(o) {
                if (qwp.isString(o)) o = $(o);
                return {
                    left: parseInt(o.css(n + '-left' + inside)),
                    right: parseInt(o.css(n + '-right' + inside)),
                    top: parseInt(o.css(n + '-top' + inside)),
                    bottom: parseInt(o.css(n + '-bottom' + inside))
                };
            };
            qwp.ui['set' + qwp.camelCase(n)] = function(o, v) {
                if (qwp.isString(o)) o = $(o);
                o.css(n, v);
            };
            var e4 = ['left', 'right', 'top', 'bottom'];
            for (var i = 0, cnt = e4.length; i < cnt; ++i) {
                qwp.ui._createFn(n, e4[i], suffix);
            }
        },
        _createFn: function(n, side, suffix) {
            var inside = '';
            if (!suffix) suffix = '';
            else inside = '-' + suffix;
            var tmp = qwp.camelCase(side);
            qwp.ui[n + tmp + qwp.camelCase(suffix)] = function(o) {
                if (qwp.isString(o)) o = $(o);
                return parseInt(o.css(n + '-' + side + inside));
            };
            qwp.ui['set' + qwp.camelCase(n)  + tmp] = function(o, v) {
                if (qwp.isString(o)) o = $(o);
                o.css(n, v);
            };
        },
        _fns: [],
        push: function(f) {
            qwp.ui._fns.push(f);
        },
        createUIComponents: function() {
            $('[data-rel=tooltip]').each(function (i, e) {
                e = $(e);
                if (!e.hasClass('tooltip-info')) e.addClass('tooltip-info');
                e.tooltip();
            });
            for (var i = 0; i < qwp.ui._fns.length; ++i) {
                qwp.ui._fns[i]();
            }
        },
        resize: function(f) {
            $(window).resize(f);
        },
        e: function(s) {
            s = $(s);
            return s && s.length > 0 ? s[0] : !!0;
        },
        tmpl: function(id, noRemove) {
            var o = $("qwp[tmpl='" + id + "']");
            var h = o.html();
            if (!noRemove) o.remove();
            return h;
        },
        toggleClass: function(o, cls1, cls2) {
            if (qwp.isString(o)) o = $(o);
            if (o.hasClass(cls1)) {
                o.removeClass(cls1);
                o.addClass(cls2);
            } else {
                o.removeClass(cls2);
                o.addClass(cls1);
            }
        },
        frame: function(name) {
            return document.all ? window.frames[name] : $("#"+name)[0].contentWindow;
        },
        loadingFrame: function(frameId, page, reloadWhenSrcIsSame) {
            var frame = $("#"+frameId);
            if (frame.length == 0) return;
            var ifm = qwp.isString(frameId) ? qwp.ui.frame(frameId) : frameId;
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
                ifm.window.document.body.innerHTML = "&nbsp;<br>" + $h.div($h.img({border:'0', src:imgUrl}) +
                "<br>" + $L("Loading page..."), {align:'center'});
            }
            frame.attr("src", page);
        }
    };
    qwp.uri = {
        root: './',
        blank: 'about:blank',
        currentPage: function(p, params) {
            return qwp.uri.page(p ? p : qwp.page.p, params);
        },
        currentOps: function(ops, params) {
            return qwp.uri.ops(ops, qwp.page.p, params);
        },
        currentHome: function(params) {
            return qwp.uri.module(qwp.page.m, params);
        },
        defaultModule: function(params) {
            return qwp.uri.module(qwp.page.m, params);
        },
        createUrlWithoutSortParams: function(params) {
            var p = false;
            if (params) p = qwp.isString(params) ? params : $.param(params);
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
                if (!qwp.isString(params)) {
                    params = $.param(params);
                }
                p = qwp.uri.join(p, params);
            }
            if (p.length) return qwp.uri.root + '?' + p;
            return qwp.uri.root;
        },
        page: function(p, params, m) {
            if (!m) {
                m = qwp.page.m;
            }
            var s = '';
            if (m) s = 'm=' + m;
            if (p) s = qwp.uri.join(s, 'p=' + p);
            if (params) {
                if (!qwp.isString(params)) {
                    params = $.param(params);
                }
                s = qwp.uri.join(s, params);
            }
            if (s.length) return qwp.uri.root + '?' + s;
            return qwp.uri.root;
        },
        ops: function(ops, p, params, m) {
            if (!m) {
                m = qwp.page.m;
            }
            var s = '';
            if (m) s = 'm=' + m;
            if (p) s = qwp.uri.join(s, 'p=' + p);
            s = qwp.uri.join(s, 'op=' + ops);
            if (params) {
                if (!qwp.isString(params)) {
                    params = $.param(params);
                }
                s = qwp.uri.join(s, params);
            }
            if (s.length) return qwp.uri.root + '?' + s;
            return qwp.uri.root;
        },
        logout: function() {
            return qwp.uri.ops('logout', false, false, 'passport');
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
            var base = './';
            if (!tmp && qwp.page) base = './?' + qwp.page.m;
            qwp.uri.baseUrl = base + (tmp ? tmp : '');
            qwp.uri.baseUrlHasParams = !!tmp;
            qwp.uri.curUrl = base + (location.search ? location.search : '');
            tmp = qwp.uri.clearSortParams(qwp.uri.curUrl);
            qwp.uri.curUrlNoSort = tmp;
            qwp.uri.curUrlNoSortHasParams = !!tmp;
            qwp.uri.hasParams = location.search ? true : false;
        }
    };
})(jQuery, $h);
function $READY() {
    qwp.uri.init();
    qwp.ui.init();
    $.each(['table', 'dialog', 'form', 'search'], function(i, v){
        if (qwp[v]) qwp[v].init();
    });
    for (var i = 0; i < qwp._r.length; ++i) {
        qwp._r[i]();
    }
    qwp.ui.init();
}
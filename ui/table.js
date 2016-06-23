/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
qwp.table = {
    init: function() {
        qwp.table.tmpl = qwp.ui.tmpl('table_base');
    },
    create: function(container, tableName, option, data) {
        var toolbar = '', btns = option.btns || {}, rightWidth = 12, topColsLeft, topColsRight;
        qwp.table._formatHeaders(option);
        if (!option.did) option.did = 'id';
        if (!option.attr) option.attr = {};
        if (!option.txtNoRecord) option.txtNoRecord = $L('Record is empty...');
        if (!option.txtLoadingData) option.txtLoadingData = $L('Table data is loading, please wait...');
        if (btns.new) toolbar += qwp.table._createBtn(btns.new, 'New', 'btn-primary', 'plus-sign');
        if (btns.edit) toolbar += qwp.table._createBtn(btns.edit, 'Edit', 'btn-warning', 'edit');
        if (btns.del) toolbar += qwp.table._createBtn(btns.del, 'Delete', 'btn-danger', 'trash');
        if (btns.search) toolbar += qwp.table._createBtn(btns.search, '', 'btn-info', 'search');
        if (btns.addons) {
            for (var i = 0, cnt = btns.addons.length; i < cnt; ++i) {
                toolbar += qwp.table._createBtn(btns.addons[i]);
            }
        }
        if (option.topCols) {
            topColsLeft = option.topCols.left;
            topColsRight = option.topCols.right;
        } else {
            topColsLeft = 3;
            topColsRight = 9;
        }
        $(container).html(qwp.table.tmpl.format(tableName, toolbar,
            qwp.table.createTable(tableName, option), topColsLeft, topColsRight));
        if (topColsLeft === 0) $("div[qwp='"+tableName+"-op-row'] div[qwp='table-top-left']").remove();
        container = qwp.table.container(tableName);
        $(container).data('option', option);
        if (option.selectable && !option.radio) {
            $(container + " table[qwp='table-header'] thead>tr>th:first-child>input[type='checkbox']").change(function(){
                qwp.table.checkAllRows(tableName, this.checked);
            });
        }
        qwp.table._createResize(tableName);
        qwp.table.update(tableName, data);
        qwp.table.createSortFields(tableName, option);
        var opsRow = "div[qwp='" + tableName + "-op-row']";
        if (qwp.loading) {
            qwp.loading.line.create(container);
            qwp.loading.overlay.create(opsRow);
        }
        if (option.hideOps) $(opsRow).hide();
        if (btns.search) qwp.table._initSearch(tableName, option);
    },
    addRows: function(tableName, data, prepend) {
        if (!data) return;
        var d = $.isArray(data) ? data : [data], h = '', container = qwp.table.container(tableName);
        if (d.length === 0) return;
        $(container + " table[qwp='data-table'] tbody > tr[rid='none']").remove();
        var option = $(container).data('option'), tbl = $(container + " table[qwp='data-table'] tbody");
        for (var i = 0, cnt = d.length; i < cnt; ++i) {
            var r = {};
            $.extend(r, d[i]);
            h += qwp.table._createRow(r, tableName, option, i);
        }
        if (prepend) tbl.prepend(h);
        else tbl.append(h);
        qwp.table._checkboxChange(d, container, option);
        qwp.ui.createUIComponents(tbl);
        qwp.table._fnResize[tableName]();
    },
    deleteRows: function(tableName, id) {
        if (!id) return;
        var d = $.isArray(id) ? id : [id], container = qwp.table.container(tableName);
        for (var i = 0, cnt = d.length; i < cnt; ++i) {
            $(container + " table[qwp='data-table'] tbody > tr[rid='" + d[i].toString() + "']").remove();
        }
        if ($(container + " table[qwp='data-table'] tbody > tr[rid]").length === 0) {
            var option = $(container).data('option');
            $(container + " table[qwp='data-table'] tbody").append(
                qwp.table._createNoDataRow(option.txtNoRecord, option.cols)
            );
        }
    },
    clearRows: function(tableName) {
        qwp.table.update(tableName, {total:0,data:[]});
    },
    update: function(tableName, data, page, psize, sortf, sort) {
        qwp.table.stopLoading(tableName);
        var container = qwp.table.container(tableName);
        var option = $(container).data('option'), total = 0;
        option.data = data;
        var tbl = $(container + " table[qwp='data-table'] tbody"), h = '';
        if (data && data.total) {
            total = data.total;
            if (option.localSort) qwp.sortData(option, data, sortf, sort);
            for (var i = 0, cnt = data.data.length; i < cnt; ++i) {
                var r = {};
                $.extend(r, data.data[i]);
                h += qwp.table._createRow(r, tableName, option, i);
            }
        } else {
            h = qwp.table._createNoDataRow(data ? option.txtNoRecord : option.txtLoadingData, option.cols);
        }
        tbl.html(h);
        if (data && data.page) {
            option.page = parseInt(data.page);
        } else if (page) {
            option.page = page;
        } else if (!option.page) {
            if (qwp.page && qwp.page.page) option.page = qwp.page.page;
            else option.page = 1;
        }
        if (data && data.psize) {
            option.psize = parseInt(data.psize);
        } else if (psize) {
            option.psize = psize;
        } else if (!option.psize) {
            if (qwp.page && qwp.page.psize) option.psize = qwp.page.psize;
            else option.psize = 30;
        }
        qwp.table._updateTopRightHtml(tableName, option, total);
        qwp.table.updateSortField(tableName, option, sortf, sort);
        if (option.selectable && !option.radio) {
            h = $(container + " table[qwp='table-header'] thead>tr>th:first-child>input[type='checkbox']");
            h[0].checked = false;
        }
        if (option.selectable && !option.radio && data && data.total) qwp.table._checkboxChange(data.data, container, option);
        qwp.ui.createUIComponents($("div[qwp='"+tableName+"-op-row']"));
        qwp.ui.createUIComponents(tbl);
        qwp.table._fnResize[tableName]();
    },
    get:function(tableName) {
        return $(qwp.table.container(tableName) + " table[qwp='data-table']");
    },
    data: function(tableName) {
        var option = $(qwp.table.container(tableName)).data('option');
        return option && option.data ? option.data : [];
    },
    item: function (tableName, id) {
        return $(qwp.table.container(tableName) + " table[qwp='data-table'] >tbody>tr[rid=" + id + "]").data('r');
    },
    th: function(tableName, field) {
        return $(qwp.table.container(tableName) + " table[qwp='table-header'] th[data-field='" + field + "']");
    },
    selectedIDs: function(tableName) {
        var container = qwp.table.container(tableName);
        var option = $(container).data('option');
        if (!option.selectable) return false;
        if (option.radio) {
            return $(container + " input[type='radio'][name='"+tableName+"']:checked").val();
        }
        var ids = [], sel = $(container + " table[qwp='data-table'] >tbody>tr[rid]>td:first-child>input[type='checkbox']:checked");
        for (var i = 0; i < sel.length; i++) {
            ids[i] = sel[i].value;
        }
        return ids;
    },
    checkAllRows: function(tableName, chk) {
        chk = chk ? true : false;
        var container = qwp.table.container(tableName), option = $(container).data('option');
        $(container + " table[qwp='data-table'] >tbody>tr[rid]>td:first-child>input[type='checkbox']").each(function(i,o){
            qwp.table._checkOneRow(tableName, o, o.value, chk, option);
        });
    },
    checkRow: function(tableName, rid, chk) {
        var container = qwp.table.container(tableName), option = $(container).data('option');
        var o = $(container + " table[qwp='data-table'] >tbody>tr[rid="+rid+"]>td:first-child>input[type='checkbox']");
        if (o.length === 0) return;
        chk = chk ? true : false;
        qwp.table._checkOneRow(tableName, o[0], rid, chk, option);
    },
    loading: function(tableName) {
        if (qwp.loading) {
            qwp.loading.line.show(qwp.table.container(tableName));
            qwp.loading.overlay.show("div[qwp='" + tableName + "-op-row']");
        }
    },
    stopLoading: function(tableName) {
        if (qwp.loading) {
            qwp.loading.line.hide(qwp.table.container(tableName));
            qwp.loading.overlay.hide("div[qwp='" + tableName + "-op-row']");
        }
    },
    resize: function(tableName) {
        var option = $(qwp.table.container(tableName)).data('option');
        var h = $(window).height(), o = $(qwp.table.container(tableName) + " table[qwp='table-header']");
        var defaultDelta = o.offset().top + o.height() + 10;
        h -= (option.heightDelta || defaultDelta);
        $(qwp.table.container(tableName) + " div[qwp='scroll']").slimscroll({height: h + 'px'});
    },
    load: function(tableName, notes, page, psize, sortf, sort, op, params, noRemoveNotice) {
        qwp.table.loading(tableName);
        qwp.notice(notes.success ? notes.success : $L('Table data is loading...'));
        if (!op) op = 'list';
        qwp.get({
            url:qwp.table._createOpsURI(tableName, op, page, psize, sortf, sort, params),
            quiet: true,
            fn:function(res, data) {
                if (res.ret) {
                    if (!noRemoveNotice) qwp.removeNotice();
                    qwp.table.update(tableName, data, page, psize, sortf, sort);
                    var option = $(qwp.table.container(tableName)).data('option');
                    if (option.onLoadData) qwp.fn(option.onLoadData)(data, page, psize, sortf, sort, tableName);
                } else {
                    qwp.notice(res.msg ? res.msg : (notes.failed ? notes.failed : $L('Failed to load table data')));
                    qwp.table.stopLoading(tableName);
                }
            }
        });
    },
    // private functions, please don't use
    container: function(tableName) {
        return '#' + tableName + '_table_container';
    },
    createTable: function(tableName, option) {
        if (!option.attr.class) option.attr.class = 'table table-striped table-bordered table-hover';
        $.extend(option.attr, {
            style: {
                'margin-bottom': '0',
                'border-bottom': '0'
            },
            qwp:'table-header'
        });
        $.extend(option, {
            cols: option.header.names.length,
            colsWidth: []
        });
        var tmp = 0, sh = '';
        for (var i = 0, cnt = option.header.names.length; i < cnt; ++i) {
            tmp += option.header.names[i][2];
        }
        var html = $h.tableStart(option.attr), r1 = '', r2 = '', hasDetailBtn = option.getRowDetail && !option.noRowDetailBtn;
        if (option.selectable || hasDetailBtn) {
            ++option.cols;
            var tdc = {'opt-col':'1'}, imgWidth, ml = false;
            if ((option.selectable && !option.radio) && hasDetailBtn) {
                option.colsWidth.push('45px');
                imgWidth = '38px';
                ml = 20;
            } else {
                option.colsWidth.push('27px');
                imgWidth = '20px';
            }
            option.imgWidth = imgWidth;
            tdc.width = option.colsWidth[0];
            if (option.header.group) {
                tdc.rowspan = 2;
                tdc['group-row'] = '1';
            }
            if (option.selectable && !option.radio) {
                var chkOpt = {"name": "checkall", "value": "on", "type": 'checkbox'};
                if (ml) chkOpt.style = {'margin-left':ml + 'px!important'};
                sh = $h.input(chkOpt);
            } else if (hasDetailBtn) {
                sh = $h.spacer({width: imgWidth});
            }
            r1 += $h.th(sh, tdc);
        }
        var per = 0, gHdr = {};
        for (i = 0, cnt = option.header.names.length - 1; i <= cnt; ++i) {
            var item = option.header.names[i];
            var tmpPer = Math.round(100 * item[2] / tmp);
            per += tmpPer;
            if (i == cnt && per < 100) tmpPer += 100 - per;
            var w = tmpPer + '%';
            option.colsWidth.push(w);
            var thAttr={width:w, 'data-field':option.header.fields[i]}, grp = option.header.group ? qwp.table._getGroup(option, thAttr['data-field']) : false;
            if (option.header.group) thAttr['group-row'] = '1';
            if (grp) {
                if (!gHdr[grp.name]) {
                    gHdr[grp.name] = true;
                    r1 += $h.th(grp.text, {'data-group':grp.name, colspan: grp.count, 'group-row':'1'});
                }
                r2 += $h.th(item[1], thAttr);
            } else {
                if (option.header.group) thAttr.rowspan = 2;
                r1 += $h.th(item[1], thAttr);
            }
        }
        html += $h.thead($h.tr(r1) + (r2.length > 0 ? $h.tr(r2) : ''));
        html += $h.tableEnd;
        html = $h.div(html, {'class': "table-responsive"});
        delete option.attr.style['border-bottom'];
        option.attr.qwp = 'data-table';
        return html + $h.div($h.table($h.tbody(), option.attr), {'class': "table-responsive", qwp: 'scroll'});
    },
    updateSortField: function(tableName, option, sortf, sort) {
        if (!option.sort) option.sort = 'desc';
        if (!option.isSortFieldCreated) return;
        if ((!sortf || option.sortf == sortf) && (!sort || option.sort == sort)) return;
        var oldSortField;
        if (sortf) {
            oldSortField = option.sortf;
            option.sortf = sortf;
        }
        if (sort) {
            option.sort = sort;
        }
        var p, s = qwp.table.container(tableName) + " table[qwp='table-header'] th[data-field='";
        if (oldSortField != option.sortf && oldSortField) {
            p = $(s + oldSortField + "']");
            p.removeClass('th_sort_asc').removeClass('th_sort_desc').attr('data-original-title', qwp.table.txtSortDesc()).addClass('th_sort_both');
            $(s + oldSortField + "']").removeClass('th-sorted');
            $(s + oldSortField + "'] > i").attr('data-original-title', qwp.table.txtSortDesc());
        }
        p = $(s + option.sortf + "']");
        p.removeClass('th_sort_asc').removeClass('th_sort_desc').removeClass('th_sort_both').attr('data-original-title', qwp.table.txtSortDesc(sort)).addClass('th_sort_' + sort);
        $(s + option.sortf + "'] > i").attr('data-original-title', qwp.table.txtSortDesc(sort));
        s = $(s + option.sortf + "']");
        if (!s.hasClass('th-sorted')) $(s).addClass('th-sorted');
    },
    txtSortDesc: function(dir) {
        if (!dir) return $L("Click to sort data");
        return dir == 'asc' ? $L('Click to change to descending order') : $L('Click to change to ascending order');
    },
    createSortFields: function(tableName, option) {
        option.isSortFieldCreated = true;
        var header = option.header, newUrl = qwp.uri.curUrlNoSort, s = qwp.table.container(tableName) + " table[qwp='table-header'] th[data-field='";
        if (newUrl.indexOf('?') == -1) newUrl += '?';
        for (var i = 0, cnt = header.names.length; i < cnt; ++i) {
            var item = header.names[i];
            if (!item[3]) continue;
            var p = $(s + header.fields[i] + "']");
            var dir = 0;
            if (option.sortf == item[0]) {
                dir = option.sort;
                p.addClass('th-sorted');
            } else {
                dir = 'both';
            }
            p.addClass('th-sort').addClass("th_sort_" + dir);
            p.click(function () {
                var newDir = 'desc', f = $(this).data("field");
                if (option.sortf == f) newDir = option.sort == "asc" ? "desc" : "asc";
                if (option.fetchData) return window[option.fetchData](0, 0, f, newDir, tableName);
                qwp.to(newUrl, {sortf:f, sort:newDir});
            });
            p.prepend($h.i('&nbsp', qwp.ui.addTooltip({'data-placement': 'bottom', title: qwp.table.txtSortDesc(dir)})));
        }
    },
    toPage: function(page, psize) {
        var url = location.href.replace(/&page=\w+/i, '');
        url = url.replace(/&pgsize=\w+/i, '');
        url = url.replace(/&page=/i, '');
        url = url.replace(/&pgsize=/i, '');
        url += "&page=" + page + "&psize=" + psize;
        location.assign(url);
    },
    txt:{
        prev:$h.i('',{class:qwp.ui.icon('chevron-left', true)}),
        next:$h.i('',{class:qwp.ui.icon('chevron-right', true)}),
        first:$h.i('',{class:qwp.ui.icon('step-backward', true)}),
        last:$h.i('',{class:qwp.ui.icon('step-forward', true)})
    },
    toggleDetail: function(rid, tableName) {
        $('#' + tableName + 'dtl_' + rid).toggleClass('hide');
        qwp.ui.toggleClass('#' + tableName + 'dtla_' + rid, qwp.ui.icon('plus-sign'), qwp.ui.icon('minus-sign'));
    },
    tag: function(i) {
        return 'qwp' + i;
    },
    leftHtml: function(tableName, html, append) {
        if (append) $("div[qwp='"+tableName+"-op-row'] div[qwp='table-top-left'] .toolbar .btn-group").append(html);
        else $("div[qwp='"+tableName+"-op-row'] div[qwp='table-top-left']").html(html);
    },
    rightHtml: function(tableName, html) {
        $("div[qwp='"+tableName+"-op-row'] div[qwp='table-top-right']").html(html);
    },
    cell: function(tableName, id, fieldName, child) {
        var s = qwp.table.container(tableName) + " table[qwp='data-table'] >tbody>tr[rid=" + id + "] td[qwp="+fieldName+"]";
        if (child) s += ' ' + child;
        return $(s);
    },
    updateSize: function(tableName) {
        var container = qwp.table.container(tableName);
        var option = $(container).data('option');
        if (option.data && option.data.total) {
            var fields = option.header.fields;
            var hasAdCol = option.cols != fields.length, thPrefix = container + " table[qwp='table-header'] > thead ";
            for (var i = 0; i < option.cols; ++i) {
                var th = $(container + " table[qwp='data-table'] > tbody > tr:eq(0) td:eq(" + i.toString() + ")");
                var padding = qwp.ui.padding(th), border = qwp.ui.border(th);
                var w = th.width() + padding.left + padding.right + border.left + border.right, s;
                if (hasAdCol) s = thPrefix + "th[data-field='"+fields[i-1]+"']";
                else s = thPrefix + "th[data-field='"+fields[i]+"']";
                $(s).attr('width', w + 'px');
            }
        }
        qwp.table.resize(tableName);
        qwp.table._resizeTimer[tableName] = false;
    },
    _checkOneRow: function(tableName, o, rid, chk, option) {
        if (o.checked === chk) return;
        var container = qwp.table.container(tableName);
        o.checked = chk;
        if (option.onSelection) {
            qwp.fn(option.onSelection)(o.value, o.checked, $(container + " table[qwp='data-table'] >tbody>tr[rid=" + rid + "]").data('r'));
        }
    },
    _createRow: function(r, tableName, option, idx) {
        var h = '', td = '', header = option.header, base = ((option.getRowDetail && !option.noRowDetailBtn) || option.selectable) ? 1 : 0;
        if (option.dataConvertor) option.dataConvertor(r, tableName);
        var subTd = '';
        if (option.getRowDetail && !option.noRowDetailBtn) {
            subTd += $h.a($h.i('', {
                'class': qwp.ui.icon('plus-sign', true),
                'id': tableName + 'dtla_' + r[option.did]
            }), {
                'class': 'btn btn-xs btn-info',
                'role': 'button',
                'onclick': "qwp.table.toggleDetail('" + r[option.did] + "', '" + tableName + "')"
            });
        }
        if (option.selectable) {
            if (option.radio) {
                subTd += $h.input({
                    name:tableName,
                    value: r[option.did],
                    rid: r[option.did],
                    type: "radio"
                });
            } else {
                subTd += $h.input({
                    value: r[option.did],
                    rid: r[option.did],
                    type: "checkbox"
                });
            }
        }
        if (subTd.length > 0) {
            var attr = {'style': 'text-align:center','opt-col':'1'};
            if (idx === 0) attr.width = option.colsWidth[0];
            td = $h.td($h.div($h.spacer({width: option.imgWidth}),{style:{height:'1px',width:option.imgWidth}}) + subTd, attr);
        }
        if (idx === 0) {
            for(var j= 0, jCnt=header.names.length; j < jCnt; ++j) {
                var f = header.names[j][0], tdAttr = {qwp: header.names[j][0], width: option.colsWidth[j + base]};
                if (r._tdCss && r._tdCss[f]) tdAttr['class'] = r._tdCss[f];
                if (r._tdTitle && r._tdTitle[f]) tdAttr.title = r._tdTitle[f];
                td += $h.td(r[f] ? r[f] : '&nbsp;', tdAttr);
            }
        } else {
            for(var j= 0, jCnt=header.names.length; j < jCnt; ++j) {
                var f = header.names[j][0], tdAttr = {qwp: header.names[j][0]};
                if (r._tdCss && r._tdCss[f]) tdAttr['class'] = r._tdCss[f];
                if (r._tdTitle && r._tdTitle[f]) tdAttr.title = r._tdTitle[f];
                td += $h.td(r[f] ? r[f] : '&nbsp;', tdAttr);
            }
        }
        var trAttr = {'rid': r[option.did]};
        if (r._bgColor) trAttr.style = {'background-color': r._bgColor};
        if (r._title) trAttr.title = r._title;
        if (r._css) trAttr['class'] = r._css;
        h+=$h.tr(td, trAttr);
        if (option.getRowDetail) {
            var cls = option.noRowDetailBtn ? '' : 'hide';
            h += $h.tr($h.td(option.getRowDetail(r), {'colspan': option.cols}),{'id': tableName + 'dtl_'+ r[option.did],'class':cls});
            h += $h.tr($h.td('&nbsp', {'colspan': option.cols, qwp:'detail'}),{'class':'hide'});
        }
        return h;
    },
    _checkAll: function(container) {
        var o = $(container + " table[qwp='data-table'] >tbody>tr[rid]>td:first-child>input[type='checkbox']:checked");
        var c = $(container + " table[qwp='table-header'] thead>tr>th:first-child>input[type='checkbox']")[0];
        c.checked = o.length > 0;
    },
    _checkboxChange: function(data, container, option) {
        for (var i = data.length - 1; i >= 0; --i) {
            qwp.table._setCheckboxChangeEvent(container, data[i], option);
        }
    },
    _setCheckboxChangeEvent: function(container, d, option) {
        $(container + " table[qwp='data-table'] >tbody>tr[rid=" + d[option.did] + "]").data('r', d);
        $(container + " table[qwp='data-table'] >tbody>tr[rid=" + d[option.did] + "]>td:first-child>input[type='checkbox']").change(function(o){
            o = $(o.delegateTarget);
            if (option.onSelection) option.onSelection(o.val(), o[0].checked, $(container + " table[qwp='data-table'] >tbody>tr[rid=" + o.val() + "]").data('r'));
            qwp.table._checkAll(container);
        });
    },
    _createBtn: function(btn, txt, cls, icon) {
        var opt = {txt: $L(txt),
            class: cls,
            icon: icon};
        if (qwp.isString(btn)) {
            opt.txt = $L(btn);
        } else if (btn !== true){
            $.extend(opt, btn);
        }
        if (opt.click) {
            opt.onclick = opt.click;
            delete opt.click;
        }
        var h;
        if (opt.icon) {
            h = $h.i('', {class: opt.fullIcon ? opt.icon : qwp.ui.icon(opt.icon, true)}) + opt.txt;
            delete opt.icon;
        } else {
            h = opt.txt;
        }
        delete opt.txt;
        if (opt.tooltip) {
            $.extend(opt, {
                'data-rel': 'tooltip',
                'data-original-title': $L(opt.tooltip)
            });
            if (!opt['data-placement']) opt['data-placement'] = 'bottom';
            delete opt.tooltip;
        }
        if (!opt.class) opt.class = 'btn-info';
        opt.class += ' btn btn-sm';
        opt.role = 'button';
        return $h.a(h, opt);
    },
    _createOpsURI: function(tableName, ops, page, psize, sortf, sort, params) {
        var p = qwp.uri.createPagerParams(page, psize, sortf, sort);
        var option = $(qwp.table.container(tableName)).data('option');
        qwp.copyWhenEmpty(p, option, ['page', 'psize', 'sortf', 'sort']);
        var mp = false;
        if (qwp.isString(ops)) {
            p.op = ops;
        } else {
            mp = ops[1];
            p.op = ops[0];
        }
        if (params && qwp.isString(params)) {
            p = $.param(p);
            p += '&' + params;
        } else if (params) {
            $.extend(p, params);
        }
        if (option.params) {
            if (qwp.isString(p)) p += '&' + $.param(option.params);
            else $.extend(p, option.params);
        }
        return qwp.uri.createUrlWithoutSortParams(p, mp);
    },
    _formatHeaders: function(option) {
        var i = 0, cnt = option.header.names.length, qwpIdx = 1;
        if (!option.header.fields) {
            option.header.fields = [];
            for (; i < cnt; ++i) {
                if (!option.header.names[i][0]) {
                    option.header.names[i][0] = 'qwp' + qwpIdx;
                    ++qwpIdx;
                }
                option.header.fields.push(option.header.names[i][0]);
            }
        } else {
            for (; i < cnt; ++i) {
                if (!option.header.names[i][0]) {
                    option.header.names[i][0] = 'qwp' + qwpIdx;
                    ++qwpIdx;
                    option.header.fields[i] = option.header.names[i][0];
                }
            }
        }
    },
    _createNoDataRow: function(txt, cols) {
        return $h.tr($h.td(txt, {colspan:cols}), {rid: 'none'});
    },
    _goPage: function(tableName, page) {
        var option = $(qwp.table.container(tableName)).data('option');
        if (option.fetchData) {
            qwp.fn(option.fetchData)(page, option.psize, null, null, tableName);
            return false;
        }
        qwp.table.toPage(page, option.psize, null, null, tableName);
        return false;
    },
    _updateTopRightHtml: function(tableName, option, total) {
        if (option.noPager || option.rightHtml) {
            if (option.rightHtml) $('#' + tableName + '_top_right').html(option.rightHtml);
            return;
        }
        var pagerFn = "return qwp.table._goPage('"+tableName+"',";
            psize = option.psize,
            curPage = option.page,
            totalPage = Math.ceil(total / psize),
            summary = $h.form($h.a(totalPage + ' / ' + total, qwp.ui.addTooltip({'class':'btn btn-info btn-sm', title:$L('Total pages and total records')})) +
                $h.input(qwp.ui.addTooltip({value:curPage,'class':'table-pager-input form-control',
                    qwp:'number', props:"defaultValue=1|minValue=1|enter=qwp.table._goPage('"+tableName+"', this.value)",
                    title:$L('Current page, press ENTER to switch page.')})), {'class':'form-inline'}),
            h = "",
            showCnt = 2,
            txtFirstPage = $L('First page'),
            txtLastPage = $L('Last page'),
            txtPrePage = $L('Previous page'),
            txtGoPage = $L('Go this page'),
            txtNextPage = $L('Next page'),
            txtRefreshPage = $L('Refresh current page'),
            fnSuffix = ")";
            place = option.pageToolTipPlacement ? option.pageToolTipPlacement : 'bottom';
        if (total > 0) {
            var prePage = curPage - 1, nextPage = curPage + 1;
            if (curPage > 1) {
                h += $h.li($h.a(qwp.table.txt.first, {
                    'data-rel':'tooltip','data-original-title':txtFirstPage,'data-placement':place,
                    'onclick': pagerFn+"1"+fnSuffix,
                    'style':'cursor:pointer'
                }));
                h += $h.li($h.a(qwp.table.txt.prev, {
                    'data-rel':'tooltip','data-original-title':txtPrePage,'data-placement':place,
                    'onclick': pagerFn + prePage + fnSuffix,
                    'style':'cursor:pointer'
                }));
            }
            var i = curPage - showCnt > 0 ? curPage - showCnt : 1;
            for (i; i < curPage; ++i) {
                h += $h.li($h.a(i, {
                    'data-rel':'tooltip','data-original-title':txtGoPage,'data-placement':place,
                    'onclick': pagerFn + i + fnSuffix,
                    'style':'cursor:pointer'
                }));
            }
            h += $h.li($h.a(i, {
                'data-rel':'tooltip','data-original-title':$L('Current page'),'data-placement':place
            }),{'class': 'active'});
            var ni = curPage + showCnt > totalPage ? totalPage : curPage + showCnt;
            for (i++; i <= ni; ++i) {
                h += $h.li($h.a(i, {
                    'data-rel':'tooltip','data-original-title':txtGoPage,'data-placement':place,
                    'onclick': pagerFn + i + fnSuffix,
                    'style':'cursor:pointer'
                }));
            }
            if (curPage < totalPage) {
                h += $h.li($h.a(qwp.table.txt.next, {
                    'data-rel':'tooltip','data-original-title':txtNextPage,'data-placement':place,
                    onclick: pagerFn + nextPage + fnSuffix,
                    'style':'cursor:pointer'
                }));
                h += $h.li($h.a(qwp.table.txt.last, {
                    'data-rel':'tooltip','data-original-title':txtLastPage,'data-placement':place,
                    'onclick': pagerFn + totalPage + fnSuffix,
                    'style':'cursor:pointer'
                }));
            }
        } else {
            i = 1;
            h += $h.li($h.a(i, {'data-rel':'tooltip','data-original-title':$L('Current page'),'data-placement':place}),{'class': 'active'});
        }
        h += $h.li($h.a($h.i('',{'class': qwp.ui.icon('refresh', true)}), {'onclick':pagerFn + curPage + fnSuffix,'href':'#',
            'data-rel':'tooltip','data-original-title':txtRefreshPage,'data-placement':'left'}));
        $('#' + tableName + '_top_right').html($h.div($h.nav($h.ul(h,{'class':'pagination'})),{qwp:'pager-right'}) + $h.div(summary, {qwp:'pager-left'}));
    },
    _createResize: function(name) {
        var resize = function(){
            qwp.table.updateSize(name);
            qwp.table._resizeTimer[name] = false;
        };
        qwp.table._fnResize[name] = function() {
            if (qwp.table._resizeTimer[name]) return;
            qwp.table._resizeTimer[name] = qwp.ui.whenVisible(qwp.table.container(name), resize);
        };
        qwp.ui.resize(qwp.table._fnResize[name]);
    },
    _getGroup: function(option, field) {
        var grps = option.header.group;
        for (var p in grps) {
            var grp = grps[p];
            for (var i = 0, cnt = grp[1].length; i < cnt; ++i) {
                if (field == grp[1][i]) {
                    return {name:p, text: grp[0], count: cnt};
                }
            }
        }
        return false;
    },
    _initSearch: function(tableName, option) {

    },
    _resizeTimer:{},
    _fnResize:{}
};
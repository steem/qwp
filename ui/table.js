qwp.table = {
    create: function(container, tableName, option, data) {
        var toolbar = '', btns = option.btns || {}, rightWidth = 12, topColsLeft, topColsRight;
        if (!option.attr) option.attr = {};
        if (!option.txtNoRecord) option.txtNoRecord = $L('Record is empty...');
        if (!option.txtLoadingData) option.txtLoadingData = $L('Table data is loading, please wait...');
        if (btns.new) toolbar += qwp.table._createBtn(btns.new, 'New', 'btn-primary', 'glyphicon-plus-sign');
        if (btns.edit) toolbar += qwp.table._createBtn(btns.edit, 'Edit', 'btn-warning', 'glyphicon-edit');
        if (btns.del) toolbar += qwp.table._createBtn(btns.del, 'Delete', 'btn-danger', 'glyphicon-trash');
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
        $(container).html(qwp.table.tmpl().format(tableName, toolbar,
            qwp.table.createTable(tableName, option), topColsLeft, topColsRight));
        container = qwp.table.container(tableName);
        $(container).data('option', option);
        qwp.table.update(tableName, data);
        qwp.table.createSortFields(tableName, option);
        var resize = function(){qwp.table._updateSize(tableName)};
        resize();
        qwp.resize(function() {
            if (!qwp.table._resizeTimer[tableName]) {
                qwp.table._resizeTimer[tableName] = setTimeout(resize, 300);
            }
        });
        if (qwp.loading) {
            qwp.loading.line.create(container);
            qwp.loading.overlay.create("div[qwp='" + tableName + "-op-row']");
        }
    },
    update: function(tableName, data, page, psize, sortf, sort) {
        qwp.table.stopLoading(tableName);
        var container = qwp.table.container(tableName);
        var option = $(container).data('option'), total = 0;
        option.data = data;
        var tbl = $(container + " table[qwp='data-table'] tbody"), h = '';
        if (data && data.total) {
            total = data.total;
            for (var i = 0, cnt = data.data.length; i < cnt; ++i) {
                h += qwp.table.createRow(data.data[i], tableName, option, i);
            }
        } else {
            var txt = data ? option.txtNoRecord : option.txtLoadingData;
            h = $H.tr($H.td(txt, {colspan:option.cols}), {rid: 'none'});
        }
        tbl.html(h);
        if (page) {
            option.page = page;
        } else if (!option.page) {
            if (qwp.page && qwp.page.page) option.page = qwp.page.page;
            else option.page = 1;
        }
        if (psize) {
            option.psize = psize;
        } else if (!option.psize) {
            if (qwp.page && qwp.page.psize) option.psize = qwp.page.psize;
            else option.psize = 30;
        }
        qwp.table.updatePager(tableName, option, total);
        qwp.table.updateSortField(tableName, option, sortf, sort);
        qwp.initUIComponents();
        qwp.table._updateSize(tableName);
    },
    get:function(tableName) {
        return $(qwp.table.container(tableName) + " table[qwp='data-table']");
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
    createOpsURI: function(tableName, ops, page, psize, sortf, sort) {
        var p = qwp.uri.createPagerParams(page, psize, sortf, sort);
        p.op = 'list';
        var option = $(qwp.table.container(tableName)).data('option');
        qwp.copyWhenEmpty(p, option, ['page', 'psize', 'sortf', 'sort']);
        return qwp.uri.createUrlWithoutSortParams(p);
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
            cols: option.header.length,
            colsWidth: []
        });
        var tmp = 0, sh = '';
        for (var i = 0, cnt = option.header.length; i < cnt; ++i) {
            tmp += option.header[i][2];
        }
        var html = $H.tableStart(option.attr), headRow = "";
        if (option.showCheckbox || option.getDetail) {
            ++option.cols;
            if (option.showCheckbox) sh = $H.input({"name": "checkall", "value": "on", "type": 'checkbox'});
            var tdc = {'style': 'text-align:center'};
            if (option.showCheckbox && option.getDetail) {
                option.colsWidth.push('60px');
                sh = $H.div($H.img({width: '50px', height:'1px', 'src': 'img/spacer.gif'})) + sh;
            } else if (!sh) {
                sh = qwp._;
                option.colsWidth.push('30px');
            }
            tdc.width = option.colsWidth[0];
            headRow += $H.th(sh, tdc);
        }
        var per = 0;
        for (i = 0, cnt = option.header.length - 1; i <= cnt; ++i) {
            var item = option.header[i];
            var tmpPer = Math.round(100 * item[2] / tmp);
            per += tmpPer;
            if (i == cnt && per < 100) tmpPer += 100 - per;
            var w = tmpPer + '%';
            option.colsWidth.push(w);
            var thAttr={width:w, 'data-field':item[0]};
            if (item[0] != 'qwp_ops') thAttr["id"] = "th_" + tableName + '_' + item[0];
            headRow += $H.th(item[1], thAttr);
        }
        html += $H.thead($H.tr(headRow));
        html += $H.tableEnd;
        html = $H.div(html, {'class': "table-responsive"});
        delete option.attr.style['border-bottom'];
        option.attr.qwp = 'data-table';
        return html + $H.div($H.table($H.tbody(), option.attr), {'class': "table-responsive", qwp: 'scroll'});
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
        var p, s = '#' + "th_" + tableName;
        if (oldSortField != option.sortf && oldSortField) {
            p = $(s + '_' + oldSortField + ' > i');
            p.removeClass('sort_asc');
            p.removeClass('sort_desc');
            p.attr('data-original-title', qwp.table.txtSortDesc());
            p.addClass('sort_both');
            $(s + '_' + oldSortField).removeClass('th-sorted');
        }
        p = $(s + '_' + option.sortf + ' > i');
        p.removeClass('sort_asc');
        p.removeClass('sort_desc');
        p.removeClass('sort_both');
        p.attr('data-original-title', qwp.table.txtSortDesc(sort));
        p.addClass('sort_' + sort);
        s = $(s + '_' + option.sortf);
        if (!s.hasClass('th-sorted')) $(s).addClass('th-sorted');
    },
    txtSortDesc: function(dir) {
        if (!dir) return $L("Click to sort data");
        return dir == 'asc' ? $L('Click to change to descending order') : $L('Click to change to ascending order');
    },
    createSortFields: function(tableName, option) {
        option.isSortFieldCreated = true;
        var header = option.header;
        var newUrl = qwp.uri.curUrlNoSort;
        if (newUrl.indexOf('?') == -1) newUrl += '?';
        for (var i = 0, cnt = header.length; i < cnt; ++i) {
            var item = header[i];
            if (!item[3]) continue;
            var s = '#' + "th_" + tableName + '_' + item[0];
            var p = $(s);
            var dir = 0;
            if (option.sortf == item[0]) {
                dir = option.sort;
                $(s).addClass('th-sorted');
            } else {
                dir = 'both';
            }
            p.append($H.i('', {
                'class': "pull-right sort_" + dir,
                "data-rel": "tooltip",
                "data-original-title": qwp.table.txtSortDesc(dir)
            }));
            p.css("cursor", "pointer");
            p.click(function () {
                var newDir = 'desc', f = $(this).data("field");
                if (option.sortf == f) newDir = option.sort == "asc" ? "desc" : "asc";
                if (option.fetchData) return window[option.fetchData](0, 0, f, newDir);
                qwp.to(newUrl + "&sortf=" + f + "&sort=" + newDir);
            });
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
        prev:$H.i('',{class:'glyphicon glyphicon-chevron-left'}),
        next:$H.i('',{class:'glyphicon glyphicon-chevron-right'}),
        first:$H.i('',{class:'glyphicon glyphicon-step-backward'}),
        last:$H.i('',{class:'glyphicon glyphicon-step-forward'})
    },
    updatePager: function(tableName, option, total) {
        var pagerFn = 'return ' + (option.fetchData || 'qwp.table.toPage'),
            psize = option.psize,
            curPage = option.page,
            totalPage = Math.ceil(total / psize),
            summary = $L("Pages: {0}. Total: {1}").format(totalPage, total),
            h = "",
            showCnt = 2,
            txtFirstPage = $L('First page'),
            txtLastPage = $L('Last page'),
            txtPrePage = $L('Previous page'),
            txtGoPage = $L('Go this page'),
            txtNextPage = $L('Next page'),
            txtRefreshPage = $L('Refresh current page');
        if (total > 0) {
            var prePage = curPage - 1, nextPage = curPage + 1;
            if (curPage > 1) {
                h += $H.li($H.a(qwp.table.txt.first, {
                    'data-rel':'tooltip','data-original-title':txtFirstPage,'data-placement':'bottom',
                    'onclick': pagerFn+"(1," + psize + ")",
                    'style':'cursor:pointer'
                }));
                h += $H.li($H.a(qwp.table.txt.prev, {
                    'data-rel':'tooltip','data-original-title':txtPrePage,'data-placement':'bottom',
                    'onclick': pagerFn+"(" + prePage + "," + psize + ")",
                    'style':'cursor:pointer'
                }));
            }
            var i = curPage - showCnt > 0 ? curPage - showCnt : 1;
            for (i; i < curPage; ++i) {
                h += $H.li($H.a(i, {
                    'data-rel':'tooltip','data-original-title':txtGoPage,'data-placement':'bottom',
                    'onclick': pagerFn+"(" + i + "," + psize + ")",
                    'style':'cursor:pointer'
                }));
            }
            h += $H.li($H.a(i, {
                'data-rel':'tooltip','data-original-title':$L('Current page'),'data-placement':'bottom'
            }),{'class': 'active'});
            var ni = curPage + showCnt > totalPage ? totalPage : curPage + showCnt;
            for (i++; i <= ni; ++i) {
                h += $H.li($H.a(i, {
                    'data-rel':'tooltip','data-original-title':txtGoPage,'data-placement':'bottom',
                    'onclick': pagerFn+"(" + i + "," + psize + ")",
                    'style':'cursor:pointer'
                }));
            }
            if (curPage < totalPage) {
                h += $H.li($H.a(qwp.table.txt.next, {
                    'data-rel':'tooltip','data-original-title':txtNextPage,'data-placement':'bottom',
                    onclick: pagerFn+"(" + nextPage + "," + psize + ")",
                    'style':'cursor:pointer'
                }));
                h += $H.li($H.a(qwp.table.txt.last, {
                    'data-rel':'tooltip','data-original-title':txtLastPage,'data-placement':'bottom',
                    'onclick': pagerFn+"(" + totalPage + "," + psize + ")",
                    'style':'cursor:pointer'
                }));
            }
        } else {
            i = 1;
            h += $H.li($H.a(i, {'data-rel':'tooltip','data-original-title':$L('Current page'),'data-placement':'bottom'}),{'class': 'active'});
        }
        h += $H.li($H.a($H.i('',{'class':'glyphicon glyphicon-refresh'}), {'onclick':pagerFn+"(" + curPage + "," + psize + ")",'href':'#',
            'data-rel':'tooltip','data-original-title':txtRefreshPage,'data-placement':'left'}));
        $('#' + tableName + '_table_pager').html($H.div($H.nav($H.ul(h,{'class':'pagination'})),{qwp:'pager-right'}) + $H.div(summary, {qwp:'pager-left'}));
    },
    toggleDetail: function(rid, tableName) {
        var o = $('#' + tableName + 'dtl_' + rid), a = $('#' + tableName + 'dtla_' + rid);
        if (o.hasClass('hide')) {
            a.removeClass('icon-plus');
            a.addClass('icon-minus');
        } else {
            a.removeClass('icon-minus');
            a.addClass('icon-plus');
        }
        o.toggleClass();
    },
    createRow: function(r, tableName, option, idx) {
        var h = '', td = '', header = option.header, base = (option.getDetail || option.showCheckbox) ? 1 : 0;
        if (option.dataConvertor) option.dataConvertor(r);
        var subTd = '';
        if (option.getDetail) {
            subTd += $H.a($H.i('', {
                'class': 'icon-plus',
                'id': tableName + 'dtla_' + r.id
            }), {
                'class': 'btn btn-minier btn-info',
                'role': 'button',
                'onclick': "qwp.table.toggleDetail('" + r.id + "', '" + tableName + "')"
            });
        }
        if (option.showCheckbox) {
            subTd += $H.input({
                "value": r.id,
                "rid": r.id,
                "type": "checkbox"
            });
        }
        if (subTd) {
            var attr = {'style': 'text-align:center'};
            if (idx === 0) attr.width = option.colsWidth[0];
            td = $H.td(subTd, attr);
        }
        if (idx === 0) {
            for(var j= 0, jCnt=header.length; j < jCnt; ++j) {
                td += $H.td(r[header[j][0]], {qwp: header[j][0], width: option.colsWidth[j + base]});
            }
        } else {
            for(var j= 0, jCnt=header.length; j < jCnt; ++j) {
                td += $H.td(r[header[j][0]], {qwp: header[j][0]});
            }
        }
        h+=$H.tr(td, {'rid': r.id});
        if (option.getDetail) h += $H.tr($H.td(option.getDetail(r), {'colspan': option.cols}),{'id': tableName + 'dtl_'+ r.id,'class':'hide'});
        return h;
    },
    _createBtn: function(btn, txt, cls, icon) {
        var opt = {txt: $L(txt),
            class: cls,
            icon: icon};
        var type = $.type(btn);
        if (type == 'string') {
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
            h = $H.i('', {class: 'glyphicon ' + opt.icon}) + opt.txt;
            delete opt.icon;
        } else {
            h = opt.txt;
        }
        delete opt.txt;
        if (opt.tooltip) {
            $.extend(opt, {
                'data-placement': 'bottom',
                'data-rel': 'tooltip',
                'data-original-title': $L(opt.tooltip)
            });
            delete opt.tooltip;
        }
        if (!opt.class) opt.class = 'btn-info';
        opt.class += ' btn btn-sm';
        opt.role = 'button';
        return $H.a(h, opt);
    },
    tmpl: function() {
        return '<div class="row" qwp="{0}-op-row">'+
            '<div class="col-sm-{3}">'+
                '<div class="toolbar"><div class="btn-group" style="width: 100%">{1}</div></div>'+
            '</div>'+
            '<div class="col-sm-{4}" id="{0}_table_pager" qwp="table-pager"></div>'+
        '</div>'+
        '<div class="row" qwp="{0}-data-row">'+
        '<div class="col-xs-12" id="{0}_table_container" qwp="container">{2}</div>'+
        '</div>';
    },
    _updateSize: function(tableName) {
        var container = qwp.table.container(tableName);
        var option = $(container).data('option');
        if (option.data && option.data.total) {
            for (var i = 0; i < option.cols; ++i) {
                var suffix = "eq(" + i.toString() + ")";
                var th = $(container + " table[qwp='data-table'] tr:eq(0) td:" + suffix);
                var w = th.width() + parseInt(th.css('margin-right')) + parseInt(th.css('margin-left')) + parseInt(th.css('padding-left')) + parseInt(th.css('padding-right')) + parseInt(th.css('border-left-width')) + parseInt(th.css('border-right-width'));
                $(container + " table[qwp='table-header'] th:" + suffix).attr('width', w + 'px');
            }
        }
        qwp.table.resize(tableName);
        qwp.table._resizeTimer[tableName] = false;
    },
    _resizeTimer:{}
};
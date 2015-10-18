qwp.table = {
    create: function(container, tableName, option, data) {
        var toolbar = '', colsCenter = '', colsLeft = '', btns = option.btns || {}, rightWidth = 12, topColsLeft, topColsRight;
        if (!option.attr) option.attr = {};
        if (!option.txtNoRecord) option.txtNoRecord = $L('Record is empty...');
        if (!option.txtLoadingData) option.txtLoadingData = $L('Table data is loading, please wait...');
        if (option.left) {
            if (option.columnLayout) colsLeft = ' class="col-xs-' + option.left.width + '"';
            rightWidth = 12 - option.left.width;
            colsLeft = '<div' + colsLeft + ' id="' + tableName + '_left">' + option.left.content + '</div>';
        }
        if (option.columnLayout) colsCenter = ' class="col-xs-' + rightWidth + '"';
        if (btns.new) toolbar += qwp.table._createBtn(btns.new, 'New', 'btn-info', 'glyphicon-plus-sign');
        if (btns.edit) toolbar += qwp.table._createBtn(btns.edit, 'Edit', 'btn-warning', 'glyphicon-edit');
        if (btns.del) toolbar += qwp.table._createBtn(btns.del, 'Delete', 'btn-danger', 'glyphicon-trash');
        if (option.topCols) {
            topColsLeft = option.topCols.left;
            topColsRight = option.topCols.right;
        } else {
            topColsLeft = 3;
            topColsRight = 9;
        }
        $(container).html('<div class="row">' +
            colsLeft +
            qwp.table.tmpl().format(colsCenter, tableName,
                toolbar, qwp.table.createTable(tableName, option), topColsLeft, topColsRight) +
            '</div>'
        );
        $(qwp.table.container(tableName)).data('option', option);
        qwp.table.update(tableName, data);
        qwp.table.createSortFields(tableName, option);
    },
    update: function(tableName, data, page, psize, sortf, sort) {
        qwp.table.stopLoading(tableName);
        var container = qwp.table.container(tableName);
        var option = $(container).data('option'), total = 0;
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
    },
    timer:{},
    loading: function(tableName) {
        if (qwp.table.timer[tableName]) return;
        var container = qwp.table.container(tableName);
        $(container + " div[qwp='loading']").css('display', 'block');
        var p = 0;
        qwp.table.timer[tableName] = setInterval(function() {
            if (p > 100) p = 100;
            var w = $(container).width();
            w = Math.round(p * w / 100);
            $(container + " div[qwp='loading'] table").attr('width', w + 'px');
            p += 3;
            if (p > 100) p = 0;
        }, 100);
    },
    stopLoading: function(tableName) {
        if (qwp.table.timer[tableName]) {
            $(qwp.table.container(tableName) + " div[qwp='loading'] table").attr('width', '0px');
            $(qwp.table.container(tableName) + " div[qwp='loading']").css('display', 'none');
            clearInterval(qwp.table.timer[tableName]);
            qwp.table.timer[tableName] = false;
        }
    },
    container: function(tableName) {
        return '#' + tableName + '_table_container';
    },
    resize: function(tableName, delta) {
        var h = $(window).height() - delta;
        $(qwp.table.container(tableName) + " div[qwp='scroll']").slimscroll({height: h + 'px'});
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
        for (i = 0, cnt = option.header.length; i < cnt; ++i) {
            var item = option.header[i];
            var w = Math.round(100 * item[2] / tmp) + '%';
            option.colsWidth.push(w);
            var thAttr={width:w, 'data-field':item[0]};
            if (item[0] != 'qwp_ops') thAttr["id"] = "th_" + tableName + '_' + item[0];
            headRow += $H.th(item[1], thAttr);
        }
        html += $H.thead($H.tr(headRow));
        html += $H.tableEnd;
        html = $H.div($H.div($H.table('',{class:'table-loading','style':'background-color:#2796e5'}),{class:'table-loading',style:'display:none',qwp:'loading'})+html, {'class': "table-responsive"});
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
    createOpsURI: function(tableName, ops, page, psize, sortf, sort) {
        var p = qwp.uri.createPagerParams(page, psize, sortf, sort);
        p.op = 'list';
        var option = $(qwp.table.container(tableName)).data('option');
        qwp.copyWhenEmpty(p, option, ['page', 'psize', 'sortf', 'sort']);
        return qwp.uri.createUrlWithoutSortParams(p);
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
            txtRefreshPage = $L('Refresh page');
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
        h = $H.nav($H.ul(h,{'class':'pagination'}));
        h = $H.table($H.tr($H.td(summary+'&nbsp;'+$H.a($H.i('',{'class':'glyphicon glyphicon-refresh'}),
                {'onclick':pagerFn+"(" + curPage + "," + psize + ")",'href':'#',
                    'data-rel':'tooltip','data-original-title':txtRefreshPage,'data-placement':'bottom'}),
            {style:"vertical-align: middle;",align:'right'})+$H.td(h,{qwp:'table-pager',width:'100%',align:'right'})),{width:"100%"});
        var s = '#' + tableName + '_table_pager';
        $(s).html(h);
        h = $(s + " td[qwp='table-pager'] .pagination").width();
        $(s + " td[qwp='table-pager']").attr('width', h + 16 + 'px');
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
        return '<div{0} id="{1}_center" style="padding-left: 0;padding-right: 0;">'+
        '<div class="row">'+
        '<div class="col-sm-{4}" style="padding-left: 0;">'+
        '<div class="toolbar"><div class="btn-group" style="width: 100%">{2}</div></div>'+
        '</div>'+
        '<div class="col-sm-{5}" id="{1}_table_pager" style="padding-right: 0;"></div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-xs-12" id="{1}_table_container" style="padding-left: 0;padding-right: 0;">{3}</div>'+
        '</div>'+
        '</div>';
    }
};
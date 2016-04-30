<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
qwp_db_get_table_header_from_modal($test_table, $test_header);
?>
<script>
var loadingNotes = {success: $L('Users data is loading...'), failed: $L('Failed to load user data')};
function fetchTestData(page, psize, sortf, sort) {
    qwp.table.load('test', loadingNotes, page, psize, sortf, sort);
    return false;
}
function addNewUser() {
    qwp.notice('Add a new user message');
}
function editUser() {
    qwp.notice('Edit user message');
}
function toggleSearch() {
    $('.qwp-search').toggleClass('hide');
    $('#search-toggle').toggleClass('active');
    qwp.table.resize('test');
}
function convertListData(r) {
    return r.name;
}
function getListPopover(r) {
    var h = '';
    for (var i = 0; i < 10; ++i) {
        h += r.desc + i + qwp.br;
    }
    return h;
}
qwp.r(function(){
    qwp.table.create('#test-table', 'test', {
        fetchData: 'fetchTestData',
        btns: {
            new:{
                click: 'addNewUser',
                tooltip:'Create a new user'
            },
            edit:{
                click: 'editUser',
                tooltip:'Edit user information'
            },
            del:{
                click: function() {
                    qwp.notice('Delete user message');
                },
                tooltip:'Delete selected users'
            },
            addons:[{
                txt:'Search',
                'class':'btn-info',
                icon:'search',
                id:'search-toggle',
                click: 'toggleSearch',
                tooltip:'Click to show/hide search options'
            }]
        },
        topCols:{
            left:4,
            right:8
        },
        sortf:'s.age',
        header:<?php echo_json($test_header)?>
    });
    $('.qwp-search > .close').click(toggleSearch);
    var listOption = {
        checkbox: true,
        op:'get_types',
        notes:{
            failed:$L('Failed to load types'),
            text:$L('Prepare to load types')
        },
        dataConvertor: convertListData,
        onSelection: function(r) {
            r = r.name.split(' ')[1];
            qwp.table.load('test', loadingNotes, false, false, false, false, false, 's[r]=' + r);
        },
        popover: {
            height:200,
            width:200,
            content:getListPopover
        }
    };
    qwp.list.create('#test-list', 'test', listOption);
    qwp.list.load('test');
    fetchTestData();
});
</script>
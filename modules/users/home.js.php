<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
get_user_data_modal($user_modal);
qwp_db_get_table_header_from_modal($user_modal, $users_header);
?>
<script>
function fetchUsersData(page, psize, sortf, sort) {
    qwp.table.loading('users');
    qwp.notice($L('Users data is loading...'));
    qwp.get({
        quiet:true,
        url:qwp.table.createOpsURI('users', 'list', page, psize, sortf, sort),
        fn:function(res, data) {
            if (res.ret) {
                qwp.removeNotice();
                qwp.table.update('users', data, page, psize, sortf, sort);
            } else {
                qwp.notice(res.msg ? res.msg : $L('Failed to load data'));
                qwp.table.stopLoading('users');
            }
        }
    });
    return false;
}
function addNewUser() {
    $('#user_info')[0].reset();
    qwp.dialog.show('dialog_user', {
        title: $L('Add a new user')
    });
}
function editUser() {
    qwp.notice('Edit user message');
}
function toggleSearch() {
    $('.qwp-search').toggleClass('hide');
    $('#search-toggle').toggleClass('active');
    qwp.table.resize('users');
}
qwp.r(function(){
    qwp.table.create('#users-table', 'users', {
        fetchData: 'fetchUsersData',
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
                icon:'glyphicon-search',
                id:'search-toggle',
                click: 'toggleSearch',
                tooltip:'Click to show/hide search options'
            }]
        },
        topCols:{
            left:4,
            right:8
        },
        sortf:'age',
        header:<?php echo_json($users_header)?>
    });
    $('.qwp-search > .close').click(toggleSearch);
    fetchUsersData();
});
</script>
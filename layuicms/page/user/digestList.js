layui.use(['form','layer','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    var digestTypeDict = {
            "1": "2buy",
            "2": "2sell"
    };
    var UNDO_STATUS_STR = "undo";
    // digest order list
    var tableIns = table.render({
        elem: '#digestList',
        url : '/order/digest',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 20,
        id : "digestListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'orderId', title: 'orderId', align:"center", width:80},
            {field: 'parentId', title: 'pid', align:"center", width:80},
            {field: 'exName', title: 'ex', align:"center", width:80},
            {field: 'tradingPair', title: 'pair', align:'center', width:100},
            {field: 'orderAmount', title: 'orderAmount', align:'center', width:100},
            {field: 'dealAmount', title: 'dealAmount', align:'center', width:100},
            {field: 'price', title: 'price', align:'center', width:130},
            {field: 'orderType', title: 'type',  align:'center', width:100,
            templet: function(d) {
                return digestTypeDict[d.orderType];
            }},
            {field: 'status', title: 'status', align:'center', width:100},
            {field: 'create', title: 'create / finish', align:'center', minWidth:350,
            templet: function(d){
                return "" + d.createTime + " / " + d.finishTime;
            }},
            {title: 'op', fixed:"right",align:"center", minWidth:170,
            templet: function(d) {
                op_html = '<a class="layui-btn layui-btn-xs" lay-event="cancel">pause trade</a>';
                if (d.status == UNDO_STATUS_STR) {
                    op_html = '<a class="layui-btn layui-btn-xs layui-btn-warm" ' +
                        ' lay-event="redo">' +
                        'recover trade</a>'
                }
                return op_html;
            }}
        ]]
    });

    // TODO
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("newsListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    key: $(".searchVal").val()  //搜索的关键字
                }
            })
        }else{
            layer.msg("请输入搜索的内容");
        }
    });

    //添加用户
    function cancelDigest(data){
        if (data) {
            pdata = '{';
            pdata += '"id":' + data.id;
            pdata += '}';
            console.log(pdata)
            $.ajax({
                type: "POST",
                url: "/order/canceldigest",
                data: pdata,
                dateType: 'JSON',
                success: function(res) {
                    console.log("result:" + JSON.stringify(res));
                    if (res.msg != 'ok') {
                        top.layer.msg("pause失败！");
                    } else {
                        top.layer.msg("pause成功！");
                    }
                },
                error: function(res) {
                    console.log("error:" + JSON.stringify(res));
                    top.layer.msg("pause失败！");
                },
            });
        }
    }
    $(".addNews_btn").click(function(){
        layer.msg("not ok yet.");
    })

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('digestListTable'),
            data = checkStatus.data,
            newsId = [];
        if(data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].newsId);
            }
            layer.confirm('确定撤销选中的订单？', {icon: 3, title: '提示信息'}, function (index) {
                // $.get("删除文章接口",{
                //     newsId : newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                tableIns.reload();
                layer.close(index);
                // })
            })
        }else{
            layer.msg("请选择需要撤销的订单");
        }
    })

    //列表操作
    table.on('tool(digestList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'cancel'){ //编辑
            cancelDigest(data);
        } else if(layEvent == 'redo') {
            // TODO: backend function
            layer.msg("try redo");
        }else if(layEvent === 'usable'){ //启用禁用
            var _this = $(this),
                usableText = "是否确定禁用此用户？",
                btnText = "已禁用";
            if(_this.text()=="已禁用"){
                usableText = "是否确定启用此用户？",
                btnText = "已启用";
            }
            layer.confirm(usableText,{
                icon: 3,
                title:'系统提示',
                cancel : function(index){
                    layer.close(index);
                }
            },function(index){
                _this.text(btnText);
                layer.close(index);
            },function(index){
                layer.close(index);
            });
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){
                // $.get("删除文章接口",{
                //     newsId : data.newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                    tableIns.reload();
                    layer.close(index);
                // })
            });
        }
    });

})

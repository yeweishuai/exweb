var $;
layui.config({
    base : "js/"
}).use(['form','layer','jquery'],function(){
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage;
        $ = layui.jquery;

     var addUserArray = [],addUser;
     form.on("submit(addUser)",function(data){
         //是否添加过信息
         if(window.sessionStorage.getItem("addUser")){
             addUserArray = JSON.parse(window.sessionStorage.getItem("addUser"));
         }

         var userEndTime;

        addUser = '{"orderId":"'+ new Date().getTime() +'",';//id
         addUser += '"exName":"'+ $(".exName").val() +'",';  // exchange name
         addUser += '"tradingPair":"'+ $(".tradingPair").val() +'",';
         addUser += '"orderAmount":"'+ $(".orderAmount").val() +'",';
         addUser += '"price":"'+ $(".price").val() +'",';
         addUser += '"orderType":"'+ $(".orderType").val() +'"}';
         console.log(addUser);
         addUserArray.unshift(JSON.parse(addUser));
         window.sessionStorage.setItem("addUser",JSON.stringify(addUserArray));
         //弹出loading
         var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
         // alert("add user content:" + addUser)
         $.ajax({
               type: 'POST',
               url: '/order/new',
               data: addUser,
               dataType: 'JSON',
               success: function(res) {
                   // alert("result:" + JSON.stringify(res));

                   top.layer.close(index);
                   top.layer.msg("添加成功！");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
               },
               error: function(data) {
                   alert("create new item error:" + JSON.stringify(data));
                   top.layer.close(index);
                   top.layer.msg("添加失败！");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
               },
        });
        /*
        setTimeout(function(){
            top.layer.close(index);
            top.layer.msg("用户添加成功！");
             layer.closeAll("iframe");
             //刷新父页面
             parent.location.reload();
        },5000);
        */
         return false;
     })
    
})

//格式化时间
function formatTime(_time){
    var year = _time.getFullYear();
    var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
    var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
    var hour = _time.getHours()<10 ? "0"+_time.getHours() : _time.getHours();
    var minute = _time.getMinutes()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    return year+"-"+month+"-"+day+" "+hour+":"+minute;
}

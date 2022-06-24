var server = window.location.pathname.split("\/");
var host = window.location.protocol+"//"+window.location.hostname+":"+window.location.port;

var bohuiID =""
$(function () {
    selectApplyByEmail()
    var Loudong=$("#Loudong").val();
    $("#questionnaireLoudong option[value='']").removeAttr("selected");     //3.根据ajax返回的value值来动态选中相对应选项。
    $("#questionnaireLoudong option[value='"+Loudong+"']").attr("selected","selected");  //3.根据ajax返回的value值来动态选中相对应选项。
    // var city = $("#questionnaireXiaowaicity").val().split(",");
    // $("#questionnaireLocation1").html(city[0]);
    // $("#questionnaireLocation2").val(city[1])
    // if($("#questionnaireLocation1").html()=="境外"){
    //     $("#questionnaireLocation2").addClass("show");
    // }else{
    //     $("#questionnaireLocation2").removeClass("show").val("");
    // }
    var lxfs = $(".lsfx").text();
    if(lxfs == ""){
        $(".br").show();
    }else{
        $(".br").hide();
    }
    var yqgzxz = $(".yqgzxz").text();
    if(yqgzxz == ""){
        $(".bryiq").show();
    }else{
        $(".bryiq").hide();
    }


})
function ToastrOptions() {
    toastr.options = {
        "closeButton": true,
        "timeOut": "2000",
        "positionClass": "toast-center-center",
    };
}
//撤销申请
function qxsb() {
    $("#Recancel").modal("show");
}
//查看驳回记录
function BohuiJilu() {
    $("#reject").modal("show");
    //查看驳回记录
    $.ajax({
        url: host + '/findRejectAll',
        type: 'post',
        data:{
             id:bohuiID
        },
        dataType: "json",
        success: function (res) {
            console.log(res.data)
            var bohuiList = res.data
            for (var i = 0; i < bohuiList.length; i++) {
                var index = i+1
                $("#Number_of_rejections").append("<li ><p>第"+index+"次驳回</p><p>驳回人："+bohuiList[i].rejectName+"</p><p>驳回理由："+bohuiList[i].rejectReason+"</p><p>驳回时间："+changeDateFormat1(bohuiList[i].rejectCreatetime)+"</p><hr></li>")
            }
        }
    })
}
$("#reject").on('hidden.bs.modal',function() {
    $("#Number_of_rejections").html("");
});
function btnConfirm() {
    $("#queding").removeAttr("onclick");
    var applyid = $("#applyId").val();
    var applyState = $("#applyState").val();
    //console.log(applyid)
    //console.log(applyState)
    var applyReState = $("#applyReState").val();
    //console.log(applyReState)
    $.ajax({
        url:host+'/cancelApply',
        type:'post',
        data:{
            applyId:applyid,
        },
        dataType:'json',
        success:function (res) {
           // console.log(res)
            if(res.code == 0){
                ToastrOptions();
                toastr.success('撤销成功');
                $("#Recancel").modal("hide");
                $("#ulList").find("li").remove();
                selectApplyByEmail()//历史记录刷新
                // if(applyReState == 0 || applyReState == 1 || applyReState ==2 ){
                //     $("#Recancel").modal("hide");
                //     $("#ulList").find("li").remove();
                //     selectApplyByEmail()//历史记录刷新
                // }
                // if(applyReState == 3){
                //     $("#Recancel").modal("hide");
                //     $("#RecancelLocation").modal("show")
                // }
            }else{
                ToastrOptions();
                toastr.error('操作失败！');
                $("#Recancel").modal("hide");
            }
        }
    })

}
function btnQx() {
    $("#Recancel").modal("hide");
}

//所有记录
function selectApplyByEmail(){
    $.ajax({
        url:host+'/getApplyByEmail',
        type:'post',
        success:function (res) {
            var teavelList=null;
            var dsplist=null;
            if (res.code == 0) {
                 // console.log(res)
                    teavelList = res.data
                if(teavelList[0].applyState == 5 || teavelList[0].applyState == 6){
                    $(".panel-body").text("当前用户暂无申请记录");
                    $("#btnShenBao").hide();
                    var stateList = null;
                    stateList = res.data
                    //历史记录开始-------------------------------------------------
                    var types = "";
                    var states = "";
                    var applyLeavelocations=""
                    for (var s = 0; s < stateList.length; s++){
                        //console.log(travelList[i])
                        if(stateList[s].applyType == 5){
                            types = "19点后返校申请";
                            applyLeavelocations = stateList[s].applyNowlocation+" "+stateList[s].applyNowlocationdetail
                        }

                        if(stateList[s].applyState == 0){
                            states = "已申请";
                        }else if(stateList[s].applyState == 1){
                            states = "审核中";
                        }else if(stateList[s].applyState == 2){
                            states = "审核中";
                        }else if(stateList[s].applyState == 3){
                            states = "审核通过";
                        }else if(stateList[s].applyState == 4){
                            var nameTeacher = stateList[s].applyExamineIndentity
                            states = nameTeacher
                            // "被驳回";
                        }else if(stateList[s].applyState == 5){
                            states = "审核通过撤销";
                        }else if(stateList[s].applyState == 6){
                            states = "中途撤销";
                        }

                        $("#ulList").append("<li class='lis'><div style='height: 4%'><span>"+types+"</span> <span style='float:right;'>"+states+"</span></div><hr> <div> <p>目的地："+applyLeavelocations+"</p><p>行程时间："+formatDate(stateList[s].applyLeavetime)+"</p><p>申请时间："+changeDateFormat1(stateList[s].applyCreatetime)+"</p> </div><hr> <div> <a href='/skipToTravelDetails?Id="+stateList[s].applyId+"'  style='float: right;color: #0388FA; text-decoration: none;margin-top: -12px;' >详情</a></div> </li>")
                    }
                    //历史记录结束-------------
                } else {
                    for (var i = 0; i < teavelList.length; i++) {
                        if (teavelList[i].applyState == 0 || teavelList[i].applyState == 1 || teavelList[i].applyState == 2 || teavelList[i].applyState == 3 || teavelList[i].applyState == 4 || teavelList[i].applyState == 5 || teavelList[i].applyState == 6) {
                            if (teavelList[i].applyType != 4) {
                                // if(formatDate(teavelList[i].applyLeavetime) >= formatDate(new Date())){
                              //  console.log(formatDate(teavelList[i].applyLeavetime))
                               // console.log(formatDate(new Date()))
                                dsplist = teavelList[i];
                                teavelList.splice(i, 1);
                                // console.log(teavelList)
                                // console.log(dsplist)
                                break;
                                // }else{
                                //     console.log(8989)
                                // }
                            } else {
                                console.log(8989)
                            }
                        }
                    }
                    if (dsplist != null) {
                        if(dsplist.applyState == 5 || dsplist.applyState == 6){
                            $(".panel-body").text("当前用户暂无申请记录");
                            $("#btnShenBao").hide();
                            var stateList = null;
                            stateList = res.data
                            stateList.unshift(dsplist)
                            //console.log(stateList)
                            stateList=stateList.sort(function (a,b){
                                return b.applyId-a.applyId;				//通过id进行排序,针对dsplist永远只在第一条
                            })
                            //console.log(stateList)
                            //历史记录开始-------------------------------------------------
                            var types = "";
                            var states = "";
                            var applyLeavelocations=""
                            for (var s = 0; s < stateList.length; s++){
                                //console.log(travelList[i])
                               if(stateList[s].applyType == 5){
                                    types = "19点后返校申请";
                                    applyLeavelocations = stateList[s].applyNowlocation+" "+stateList[s].applyNowlocationdetail
                                }

                                if(stateList[s].applyState == 0){
                                    states = "已申请";
                                }else if(stateList[s].applyState == 1){
                                    states = "审核中";
                                }else if(stateList[s].applyState == 2){
                                    states = "审核中";
                                }else if(stateList[s].applyState == 3){
                                    states = "审核通过";
                                }else if(stateList[s].applyState == 4){
                                    var nameTeacher = stateList[s].applyExamineIndentity
                                    states = nameTeacher
                                    // states = "被驳回";
                                }else if(stateList[s].applyState == 5){
                                    states = "审核通过撤销";
                                }else if(stateList[s].applyState == 6){
                                    states = "中途撤销";
                                }
                                $("#ulList").append("<li class='lis'><div style='height: 4%'><span>"+types+"</span> <span style='float:right;'>"+states+"</span></div><hr> <div> <p>目的地："+applyLeavelocations+"</p><p>行程时间："+formatDate(stateList[s].applyLeavetime)+"</p><p>申请时间："+changeDateFormat1(stateList[s].applyCreatetime)+"</p></div><hr> <div> <a href='/skipToTravelDetails?Id="+stateList[s].applyId+"'  style='float: right;color: #0388FA; text-decoration: none;margin-top: -12px;' >详情</a></div> </li>")
                            }
                            //历史记录结束-------------
                        }else{
                            if(dsplist.applyState == 0 || dsplist.applyState == 1 || dsplist.applyState == 2 || dsplist.applyState == 3){
                                $("#btnShenBao").show();
                                $("#btnReShenqing").hide();
                            }
                            if(dsplist.applyState == 4){
                                $("#btnShenBao").hide();
                                $("#btnReShenqing").show();
                            }
                            var type = ""
                            if (dsplist.applyType == 0) {
                                type = "离沪申请";
                                // $(".qjtMiaoShu").text("学院批复：")
                                $(".hides").hide();
                                $(".hidess").hide();
                                $(".shifouSchoolVehicle").show();
                                $(".lixiaocns").show();
                                $(".lihuhuoche").show();
                                $(".zhiqingtys").show();
                                $("#lihumdd").show();
                                $(".qjtParent").show();
                                $(".shjd").show();
                                $("#xiaonei").show();
                                $("#xiaowai").hide();
                                $(".hideshesuan").hide();
                                $(".hideshesuan1").show();
                                $(".hideshesuan2").hide();
                                $(".muqianszd").show();
                                $(".yidongqian").hide();
                                $(".muqiansuozd").hide();
                                $(".yidongjzd").hide();
                                $(".yidomngxxdz").hide();
                                $('#mdds').text(dsplist.applyNowlocation +" "+ dsplist.applyNowlocationdetail +" "+dsplist.applyMenpai)

                                $(".hesuanbaogao1").text("申请时最近一次的核酸报告：");
                                //核酸
                                if(dsplist.applyHesuanAuto  == "" || dsplist.applyHesuanAuto == null){
                                    $("#wzCK31").hide();
                                }else {
                                    $("#wzCK31").show();
                                    if(dsplist.applyHesuanAuto.split(",")[0] == '阴性'){
                                        $("#wzCK31").css('color','green')
                                        $("#wzCK31").text('检测结果：阴性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                    }else {
                                        $("#wzCK31").css('color','red')
                                        $("#wzCK31").text('检测结果：阳性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                    }
                                }
                                if(dsplist.applyHesuan == null || dsplist.applyHesuan == ""){
                                    $(".hideshesuan1").hide();
                                }else{
                                    $(".hideshesuan").hide();
                                    $("#hsbg").text(dsplist.applyHesuan)
                                }
                                $('#schoolVehicle').text(dsplist.appIfSchoolVehicle)

                                $(".checi").show();
                                $(".shifouSchoolVehicle1").show();
                                $('#checihao').text(dsplist.applyCarnumber)
                                $('#applyDepartureTime').text(dsplist.applyDepartureTime)
                                $('#applyOutcarTime').text(dsplist.applyOutcarTime)
                                $('#applyStartStation').text(dsplist.applyStartStation)
                                $('#applyEndStation').text(dsplist.applyEndStation)


                                // 撤销弹框地址回显
                                $('#mddsRecancel').text(dsplist.applyNowlocation +" "+ dsplist.applyNowlocationdetail +" "+dsplist.applyMenpai)
                            }else if(dsplist.applyType == 2){
                                type = "离校不离沪";
                                // $(".qjtMiaoShu").text("申请离校居家学习告知书：")
                                $(".zhiqingtys").show();
                                $(".hides").hide();
                                $(".hidess").hide();
                                $(".shifouSchoolVehicle").hide();
                                $("#lixiaomdd").show();
                                $(".qjtParent").show();
                                $(".shjd").show();
                                $("#xiaonei").show();
                                $("#xiaowai").hide();
                                $(".hideshesuan").hide();
                                $(".hideshesuan1").show();
                                $(".hideshesuan2").hide();
                                $(".muqianszd").show();
                                $(".yidongqian").hide();
                                $(".muqiansuozd").hide();
                                $(".yidongjzd").hide();
                                $(".yidomngxxdz").hide();
                                $('#mdds').text(dsplist.applyNowlocation +" "+ dsplist.applyNowlocationdetail +" "+dsplist.applyMenpai)

                                $(".hesuanbaogao1").text("申请时最近一次的核酸报告：");
                                //核酸
                                if(dsplist.applyHesuanAuto  == "" || dsplist.applyHesuanAuto == null){
                                    $("#wzCK31").hide();
                                }else {
                                    $("#wzCK31").show();
                                    if(dsplist.applyHesuanAuto.split(",")[0] == '阴性'){
                                        $("#wzCK31").css('color','green')
                                        $("#wzCK31").text('检测结果：阴性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                    }else {
                                        $("#wzCK31").css('color','red')
                                        $("#wzCK31").text('检测结果：阳性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                    }
                                }
                                if(dsplist.applyHesuan == null || dsplist.applyHesuan == ""){
                                    $(".hideshesuan1").hide();
                                }else{
                                    $(".hideshesuan").hide();
                                    $("#hsbg").text(dsplist.applyHesuan)
                                }
                                $('#schoolVehicle').text(dsplist.appIfSchoolVehicle)

                                // $(".shifouSchoolVehicle2").show();
                                // $('#applyPlanway1').text(dsplist.applyPlanway)
                                //
                                //
                                // if(dsplist.applyPlanway == "其他"){
                                //     $(".shifouSchoolVehicle3").show();
                                //     $('#applyPlanwayOther').text(dsplist.applyPlanwayOther)
                                // }else {
                                //     $(".shifouSchoolVehicle3").hide();
                                // }
                                // 撤销弹框地址回显
                                $('#mddsRecancel').text(dsplist.applyNowlocation +" "+ dsplist.applyNowlocationdetail +" "+dsplist.applyMenpai)
                            } else if (dsplist.applyType == 3) {
                                type = "返校申请";
                                $(".hides").show();
                                $(".hidess").show();
                                $(".hideshesuan").show();
                                $(".hideshesuan1").show();
                                $(".hideshesuan2").show();
                                $(".hideshesuan3").show();
                                $("#lihumdd").hide()
                                $(".qjtParent").hide();
                                $(".shjd").show();
                                $("#xiaonei").hide();
                                $("#xiaowai").show();
                                $(".muqianszd").show();
                                $(".yidongqian").hide();
                                $(".muqiansuozd").hide();
                                $(".yidongjzd").hide();
                                $(".yidomngxxdz").hide();
                                $('#mdds').text(dsplist.applyNowlocation +" "+ dsplist.applyNowlocationdetail )
                                $('#checihao').text(dsplist.applyCarnumber)
                                //核酸
                                if(dsplist.applyHesuanAuto  == ""){
                                    $(".hideshesuan").hide();
                                    $(".hideshesuan3").hide();
                                    $(".hesuanbaogao1").text("核酸报告1：");
                                    $(".hesuanbaogao2").text("核酸报告2：")
                                }else{
                                    if(dsplist.applyHesuanAutoTwo  == "" || dsplist.applyHesuanAutoTwo  == null){
                                        $(".hideshesuan3").hide();
                                        $(".hesuanbaogao").text("核酸报告1：")
                                        // $(".hesuanbaogao3").text("核酸报告2：")
                                        $(".hesuanbaogao1").text("核酸报告2：")
                                        $(".hesuanbaogao2").text("核酸报告3：")
                                        if(dsplist.applyHesuanAuto.split(",")[0] == '阴性'){
                                            $(".hideshesuan").show();
                                            $("#wzCK3").css('color','green')
                                            $("#wzCK3").text('检测结果：阴性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                        }else {
                                            $(".hideshesuan").show();
                                            $("#wzCK3").css('color','red')
                                            $("#wzCK3").text('检测结果：阳性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                        }
                                    }else {
                                        $(".hesuanbaogao").text("核酸报告1：")
                                        $(".hesuanbaogao3").text("核酸报告2：")
                                        $(".hesuanbaogao1").text("核酸报告3：")
                                        $(".hesuanbaogao2").text("核酸报告4：")
                                        if(dsplist.applyHesuanAuto.split(",")[0] == '阴性'){
                                            $(".hideshesuan").show();
                                            $("#wzCK3").css('color','green')
                                            $("#wzCK3").text('检测结果：阴性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                        }else {
                                            $(".hideshesuan").show();
                                            $("#wzCK3").css('color','red')
                                            $("#wzCK3").text('检测结果：阳性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                        }
                                        if(dsplist.applyHesuanAutoTwo.split(",")[0] == '阴性'){
                                            $("#wzCK32").css('color','green')
                                            $("#wzCK32").text('检测结果：阴性;检测时间：'+dsplist.applyHesuanAutoTwo.split(",")[1]+'（数据来源：市大数据中心）')
                                        }else {
                                            $("#wzCK32").css('color','red')
                                            $("#wzCK32").text('检测结果：阳性;检测时间：'+dsplist.applyHesuanAutoTwo.split(",")[1]+'（数据来源：市大数据中心）')
                                        }
                                    }
                                }
                                if(dsplist.applyHesuan == null || dsplist.applyHesuan == ""){
                                    $(".hideshesuan1").hide();
                                }else{
                                    $("#hsbg").text(dsplist.applyHesuan)
                                }
                                if(dsplist.applyHesuantwo == null || dsplist.applyHesuantwo == ""){
                                    $(".hideshesuan2").hide()
                                }else{
                                    $("#hsbg2").text(dsplist.applyHesuantwo)
                                }
                                // 撤销弹框地址回显
                                $('#mddsRecancel').text(dsplist.applyNowlocation +" "+ dsplist.applyNowlocationdetail )
                            }else if (dsplist.applyType == 4){
                                type = "移动备案";
                                $(".shjd").hide();
                                $(".muqianszd").hide();
                                $(".hideshesuan").hide();
                                $(".hideshesuan1").hide();
                                $(".hideshesuan2").hide();
                                $(".yidongqian").show();
                                $(".muqiansuozd").show();
                                $(".yidongjzd").show();
                                $(".yidomngxxdz").show();
                                $('#mdds').text(dsplist.applyNowlocation +" "+ dsplist.applyNowlocationdetail +" "+dsplist.applyMenpai)
                            }else if (dsplist.applyType == 5) {
                                type = "19点后返校申请（住校学生）";
                                $(".hides").show();
                                $(".hidess").hide();
                                $(".hideSevenPM").show();
                                $(".checi").hide();
                                $(".hideshesuan").show();
                                $(".hideshesuan1").show();
                                $(".hideshesuan2").show();
                                $(".hideshesuan3").show();
                                $("#lihumdd").hide()
                                $(".qjtParent").hide();
                                $(".shjd").show();
                                $("#xiaonei").hide();
                                $("#xiaowai").show();
                                $(".muqianszd").show();
                                $(".yidongqian").hide();
                                $(".muqiansuozd").hide();
                                $(".yidongjzd").hide();
                                $(".yidomngxxdz").hide();
                                $('#mdds').text(dsplist.applyNowlocation +" "+ dsplist.applyNowlocationdetail )

                                $("#applyActionTrack").text(dsplist.applyActionTrack)
                                $("#questionnaireDepartureStation").text(dsplist.appIfSchoolVehicle)
                                if(dsplist.appIfSchoolVehicle  == "是"){
                                    $("#applyPlanwayOther").text(dsplist.applyPlanwayOther)
                                    $(".hideSevenPMs").show();
                                }
                                //核酸
                                if(dsplist.applyHesuanAuto  == ""){
                                    $(".hideshesuan").hide();
                                    $(".hideshesuan3").hide();
                                    $(".hesuanbaogao1").text("核酸报告1：");
                                    $(".hesuanbaogao2").text("核酸报告2：")
                                }else{
                                    if(dsplist.applyHesuanAutoTwo  == "" || dsplist.applyHesuanAutoTwo  == null){
                                        $(".hideshesuan3").hide();
                                        $(".hesuanbaogao").text("核酸报告1：")
                                        // $(".hesuanbaogao3").text("核酸报告2：")
                                        $(".hesuanbaogao1").text("核酸报告2：")
                                        $(".hesuanbaogao2").text("核酸报告3：")
                                        if(dsplist.applyHesuanAuto.split(",")[0] == '阴性'){
                                            $(".hideshesuan").show();
                                            $("#wzCK3").css('color','green')
                                            $("#wzCK3").text('检测结果：阴性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                        }else {
                                            $(".hideshesuan").show();
                                            $("#wzCK3").css('color','red')
                                            $("#wzCK3").text('检测结果：阳性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                        }
                                    }else {
                                        $(".hesuanbaogao").text("核酸报告1：")
                                        $(".hesuanbaogao3").text("核酸报告2：")
                                        $(".hesuanbaogao1").text("核酸报告3：")
                                        $(".hesuanbaogao2").text("核酸报告4：")
                                        if(dsplist.applyHesuanAuto.split(",")[0] == '阴性'){
                                            $(".hideshesuan").show();
                                            $("#wzCK3").css('color','green')
                                            $("#wzCK3").text('检测结果：阴性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                        }else {
                                            $(".hideshesuan").show();
                                            $("#wzCK3").css('color','red')
                                            $("#wzCK3").text('检测结果：阳性;检测时间：'+dsplist.applyHesuanAuto.split(",")[1]+'（数据来源：市大数据中心）')
                                        }
                                        if(dsplist.applyHesuanAutoTwo.split(",")[0] == '阴性'){
                                            $("#wzCK32").css('color','green')
                                            $("#wzCK32").text('检测结果：阴性;检测时间：'+dsplist.applyHesuanAutoTwo.split(",")[1]+'（数据来源：市大数据中心）')
                                        }else {
                                            $("#wzCK32").css('color','red')
                                            $("#wzCK32").text('检测结果：阳性;检测时间：'+dsplist.applyHesuanAutoTwo.split(",")[1]+'（数据来源：市大数据中心）')
                                        }
                                    }
                                }
                                if(dsplist.applyHesuan == null || dsplist.applyHesuan == ""){
                                    $(".hideshesuan1").hide();
                                }else{
                                    $("#hsbg").text(dsplist.applyHesuan)
                                }
                                if(dsplist.applyHesuantwo == null || dsplist.applyHesuantwo == ""){
                                    $(".hideshesuan2").hide()
                                }else{
                                    $("#hsbg2").text(dsplist.applyHesuantwo)
                                }
                                // 撤销弹框地址回显
                                $('#mddsRecancel').text(dsplist.applyNowlocation +" "+ dsplist.applyNowlocationdetail )
                            }

                            if (dsplist.applyStudentnum != null) {
                                $('#xuehaoParent').show();
                            }
                            $('#applyId').val(dsplist.applyId)
                            bohuiID = dsplist.applyId

                            $('#applyState').val(dsplist.applyState)
                            $('#applyType').val(dsplist.applyType)

                            $('#applyReLocation').val(dsplist.applyId)
                            $('#applyReType').val(dsplist.applyType)
                            $('#applyReState').val(dsplist.applyState)
                            $('#fhsq').text(type)
                            $('#xm').text(dsplist.applyUser)
                            $("#shenqingshijian").text(changeDateFormat1(dsplist.applyCreatetime))
                            $("#jiankangzhuangk").text(dsplist.applyHealthy)
                            var studentNum = ""
                            if (dsplist.applyStudentnum == null) {
                                studentNum = ""
                            } else {
                                studentNum = dsplist.applyStudentnum
                            }
                            $('#xuehao').text(studentNum)
                            $('#xueyuan').text(dsplist.applyXueyuan)
                            $('#yidongmdds').text(dsplist.applyNowlocation +" "+ dsplist.applyNowlocationdetail )
                            // $('#lihumdds').text(dsplist.applyAddress +","+dsplist.applyDetailaddress)
                            if(dsplist.applyReason == null){
                                $(".ly").hide();
                            }else{
                                $('#liyou').text(dsplist.applyReason);
                                $(".ly").show();
                            }
                            if(dsplist.applyCancelreason == null || dsplist.applyCancelreason == ""){
                                $(".BoHui").hide();
                            }else{
                                $(".BoHui").show();
                            }
                            $('#riqi').text(formatDate(dsplist.applyLeavetime))
                            $('#yidongmuqian').text(dsplist.applyAddress)
                            $("#juzhudi").text(dsplist.applyQuestionnairexiaowaicity)
                            $("#xxdz").text(dsplist.applyDetailaddress)
                            $('#jtgj').text(dsplist.applyPlanway)
                            if (dsplist.applyPlanway != "自驾") {
                                $(".jiaotong").show();
                            } else {
                                $(".jiaotong").hide();
                            }


                            $("#phone").text(dsplist.applyPhone)
                            $("#lihu").text(dsplist.applyAddress + " " + dsplist.applyDetailaddress)
                            $("#lixiao").text(dsplist.applyAddress + " " + dsplist.applyDetailaddress)

                            if(dsplist.applyTravelcodeAuto  == "" || dsplist.applyTravelcodeAuto  == null){
                                $("#xcm1").hide();
                            }else{
                                if(dsplist.applyTravelcodeAuto == "没有去过中、高风险地区"){
                                    $("#wzCK1").css('color','green')
                                    $("#wzCK1").text(dsplist.applyTravelcodeAuto)
                                }else{
                                    $("#wzCK1").css('color','red')
                                    $("#wzCK1").text(dsplist.applyTravelcodeAuto)
                                }
                            }
                            if (dsplist.applyTravelcode == "" || dsplist.applyTravelcode  == null){
                                $("#xcm2").hide();
                            }else{
                                $("#xcm").text(dsplist.applyTravelcode);
                                $("#imgCK1").show();
                            }
                            //健康码
                            if(dsplist.applyHealthycodeAuto  == ""){
                                $("#tcm").text(dsplist.applyCitycode)
                                $("#wzCK2").hide();
                                $("#imgCK2").show();
                            }else{
                                if(dsplist.applyHealthycodeAuto == "绿码"){
                                    $("#wzCK2").css('color','green')
                                    $("#wzCK2").text('随申码为绿码（数据来源：市大数据中心）')
                                }else if(dsplist.applyHealthycodeAuto == "黄码"){
                                    $("#wzCK2").css('color','#f9bf2e')
                                    $("#wzCK2").text('随申码为黄码（数据来源：市大数据中心）')
                                }else if(dsplist.applyHealthycodeAuto == "红码"){
                                    $("#wzCK2").css('color','red')
                                    $("#wzCK2").text('随申码为红码（数据来源：市大数据中心）')
                                }
                            }
                            $("#qjt").text(dsplist.applyHealthycode)
                            if(dsplist.applyLeaveCns == "" || dsplist.applyLeaveCns == null){
                                $(".lixiaocns").hide();
                            }else {
                                $("#lxcns").text(dsplist.applyLeaveCns)
                            }
                            // //离沪火车或航班票截图
                            if(dsplist.applyTrainTicketsImage == "" || dsplist.applyTrainTicketsImage == null){
                                $(".lihuhuoche").hide();
                            }else {
                                $("#lihcp").text(dsplist.applyTrainTicketsImage)
                            }

                            $("#tys").text(dsplist.applyParentTys)
                            $("#Fanxiaojuzhudi").text(dsplist.applyAddress + " " + dsplist.applyDetailaddress +" "+ dsplist.applyMenpai)
                            var ifDangerlocation = ""
                            if (dsplist.applyIfdangerlocation == '是') {
                                ifDangerlocation = "是";
                                $(".dangerLocation").show();
                            } else if (dsplist.applyIfdangerlocation == '否') {
                                ifDangerlocation = "否";
                                $(".dangerLocation").hide();
                            }
                            $("#douliu").text(ifDangerlocation)
                            $("#dangerLocation").text(dsplist.applyDangerlocationcity)
                            var ifTime = ""
                            if (dsplist.applyIftouch == '是') {
                                ifTime = "是";
                                $(".dangerTime").show();
                            } else if (dsplist.applyIftouch == '否') {
                                ifTime = "否";
                                $(".dangerTime").hide();
                            }
                            $("#ifTime").text(ifTime)
                            $("#dangerTime").text(dsplist.applyTouchtime)
                            var Msg = "<li id='yiqinglaoshi' style='display: none;'><label>"+dsplist.applyTeacherExamine+"</label> 在 "+changeDateFormat1(dsplist.applyTeacherExaminetime)+" 通过了你的申请，并给你留了言："+dsplist.applyTeacherExamineMsg+"</li>" +
                                "<li id='shuyuanlaoshi' style='display: none'><label>"+dsplist.applyStudentdealExamine+"</label> 在 "+changeDateFormat1(dsplist.applyStudentdealExaminetime)+" 通过了你的申请，并给你留了言："+dsplist.applyStudentdealExamineMsg+"</li>" +
                                "<li id='xiaozushenhe' style='display: none'><label>"+dsplist.applyWorkgroupExamine+"</label> 在 "+changeDateFormat1(dsplist.applyWorkgroupExaminetime)+" 通过了你的申请，并给你留了言："+dsplist.applyWorkgroupExamineMsg+"</li>"

                            $("#LiuYanUl").append(Msg)
                            if(dsplist.applyTeacherExamineMsg == "" ||dsplist.applyTeacherExamineMsg == null){
                                $("#LiuYan").hide();
                                $("#yiqinglaoshi").hide();
                            }else{
                                $("#LiuYan").show();
                                $("#yiqinglaoshi").show();
                            }

                            if(dsplist.applyStudentdealExamineMsg == "" || dsplist.applyStudentdealExamineMsg == null){
                                $("#shuyuanlaoshi").hide();
                            }else{
                                $("#LiuYan").show();
                                $("#shuyuanlaoshi").show();
                            }

                            if(dsplist.applyWorkgroupExamineMsg == "" || dsplist.applyWorkgroupExamineMsg == null){
                                $("#xiaozushenhe").hide();
                            }else {
                                $("#LiuYan").show();
                                $("#xiaozushenhe").show();
                            }

                            if (dsplist.applyStudenttype == '博士研究生' || dsplist.applyStudenttype == '硕士研究生' ) {
                                //审核进度
                                if(dsplist.applyType == 5){
                                    $("#ulStepSevenPM").show()
                                    $("#ulStepBen").hide()
                                    $("#ulStepYan").hide()
                                    $("#ulStepJie").hide()
                                    $("#ulStepFang").hide()
                                    $("#ulStepTeacher").hide()
                                }else {
                                    $("#ulStepBen").hide()
                                    $("#ulStepYan").show()
                                    $("#ulStepJie").hide()
                                    $("#ulStepFang").hide()
                                    $("#ulStepTeacher").hide()
                                }

                                var state = dsplist.applyState
                                if (state == 0) {
                                    bsStep(1)
                                    $(".bohui").hide();
                                } else if (state == 1) {
                                    bsStep(2)
                                    $(".bohui").hide();
                                }else if (state == 2) {
                                    bsStep(3)
                                    $(".bohui").hide();
                                } else if (state == 3) {
                                    $("#jindu").text("审核通过")
                                    $(".bohui").hide();
                                    $("#ulStepYan").hide();
                                } else if (state == 4) {//驳回
                                    $(".step-round").hide();
                                    $(".bohui").show();
                                    $("#jindu").text("被驳回")
                                    $("#bohuiren").text(dsplist.applyCanceller)
                                    $("#bohuiliyou").text(dsplist.applyCancelreason)
                                } else if (state == 5) {//撤销
                                    $(".step-round").hide()
                                    $(".bohui").hide();
                                    $("#jindu").text("用户已撤销")
                                } else if (state == 6) {//失效
                                    $(".step-round").hide()
                                    $("#jindu").text("申请已失效")
                                }
                                // $("#shuyuanlaoshi").hide();
                            } else if ( dsplist.applyStudenttype == '借住生' ){

                                if(dsplist.applyType == 5){
                                    $("#ulStepSevenPM").show()
                                    $("#ulStepBen").hide()
                                    $("#ulStepYan").hide()
                                    $("#ulStepJie").hide()
                                    $("#ulStepFang").hide()
                                    $("#ulStepTeacher").hide()
                                }else {
                                    $("#ulStepBen").hide()
                                    $("#ulStepYan").hide()
                                    $("#ulStepJie").show()
                                    $("#ulStepFang").hide()
                                    $("#ulStepTeacher").hide()
                                }

                                //审核进度
                                var state = dsplist.applyState
                                if (state == 0) {
                                    bsStep(1)
                                    $(".bohui").hide();
                                } else if (state == 3) {
                                    $(".step-round").hide();
                                    $("#jindu").text("审核通过")
                                    $(".bohui").hide();
                                } else if (state == 4) {//驳回
                                    $(".step-round").hide();
                                    $(".bohui").show();
                                    $("#jindu").text("被驳回")
                                    $("#bohuiren").text(dsplist.applyCanceller)
                                    $("#bohuiliyou").text(dsplist.applyCancelreason)
                                } else if (state == 5) {//撤销
                                    $(".step-round").hide()
                                    $(".bohui").hide();
                                    $("#jindu").text("审核通过撤销")
                                } else if (state == 6) {//中途撤销
                                    $(".step-round").hide()
                                    $("#jindu").text("中途撤销")
                                }
                            }else if(dsplist.applyStudenttype == '访问生'){
                                //审核进度
                                if(dsplist.applyType == 5){
                                    $("#ulStepSevenPM").show()
                                    $("#ulStepBen").hide()
                                    $("#ulStepYan").hide()
                                    $("#ulStepJie").hide()
                                    $("#ulStepFang").hide()
                                    $("#ulStepTeacher").hide()
                                }else {
                                    $("#ulStepBen").hide()
                                    $("#ulStepYan").hide()
                                    $("#ulStepFang").show()
                                    $("#ulStepJie").hide()
                                    $("#ulStepTeacher").hide()
                                }
                                var state = dsplist.applyState
                                if (state == 0) {
                                    bsStep(1)
                                    $(".bohui").hide();
                                } else if (state == 2) {
                                    bsStep(2)
                                    $(".bohui").hide();
                                } else if (state == 3) {
                                    bsStep(3)
                                    $(".bohui").hide();
                                    $("#ulStepFang").hide();
                                    $("#jindu").text("审核通过")
                                } else if (state == 4) {//驳回
                                    $(".step-round").hide();
                                    $(".bohui").show();
                                    $("#jindu").text("被驳回")
                                    $("#bohuiren").text(dsplist.applyCanceller)
                                    $("#bohuiliyou").text(dsplist.applyCancelreason)
                                } else if (state == 5) {//撤销
                                    $(".step-round").hide()
                                    $(".bohui").hide();
                                    $("#jindu").text("用户已撤销")
                                } else if (state == 6) {//失效
                                    $(".step-round").hide()
                                    $("#jindu").text("申请已失效")
                                }
                                $("#shuyuanlaoshi").hide();
                            }else {
                                if(dsplist.applyType == 5){
                                    $("#ulStepSevenPM").show()
                                    $("#ulStepBen").hide()
                                    $("#ulStepYan").hide()
                                    $("#ulStepJie").hide()
                                    $("#ulStepFang").hide()
                                    $("#ulStepTeacher").hide()
                                }else {
                                    $("#ulStepBen").show()
                                    $("#ulStepYan").hide()
                                    $("#ulStepJie").hide()
                                    $("#ulStepFang").hide()
                                    $("#ulStepTeacher").show()
                                }
                                //审核进度
                                var state = dsplist.applyState
                                if (state == 0) {
                                    bsStep(1)
                                    $(".bohui").hide();
                                } else if (state == 1) {
                                    bsStep(2)
                                    $(".bohui").hide();
                                } else if (state == 2) {
                                    bsStep(3)
                                    $(".bohui").hide();
                                } else if (state == 3) {
                                    $(".step-round").hide();
                                    $("#jindu").text("审核通过")
                                    $(".bohui").hide();
                                } else if (state == 4) {//驳回
                                    $(".step-round").hide();
                                    $(".bohui").show();
                                    $("#jindu").text("被驳回")
                                    $("#bohuiren").text(dsplist.applyCanceller)
                                    $("#bohuiliyou").text(dsplist.applyCancelreason)
                                } else if (state == 5) {//撤销
                                    $(".step-round").hide()
                                    $(".bohui").hide();
                                    $("#jindu").text("审核通过撤销")
                                } else if (state == 6) {//中途撤销
                                    $(".step-round").hide()
                                    $("#jindu").text("中途撤销")
                                }
                            }
                            //当前进度结束-------------------------------------------------
                            //历史记录开始-------------------------------------------------
                            var ulList = "";
                            var types = "";
                            var states = "";
                            var applyLeavelocation = "";
                            for (var j = 0; j < teavelList.length; j++) {
                                //console.log(travelList[i])
                                if (teavelList[j].applyType == 5) {
                                    types = "19点后返校申请";
                                    applyLeavelocation = teavelList[j].applyNowlocation + " " + teavelList[j].applyNowlocationdetail
                                }
                                if (teavelList[j].applyState == 0) {
                                    states = "已申请";
                                } else if (teavelList[j].applyState == 1) {
                                    states = "审核中";
                                    $("#btnShenBao").show();
                                } else if (teavelList[j].applyState == 2) {
                                    states = "审核中";
                                } else if (teavelList[j].applyState == 3) {
                                    states = "审核通过";
                                } else if (teavelList[j].applyState == 4) {
                                    var nameTeacher = teavelList[j].applyExamineIndentity
                                    states = nameTeacher
                                    // states = "被驳回";
                                } else if (teavelList[j].applyState == 5) {
                                    states = "审核通过撤销";
                                } else if (teavelList[j].applyState == 6) {
                                    states = "中途撤销";
                                }

                                // ulList +='<li class="lis"><div style="height: 4%"><span >${types}</span> <span style="float:right;">${states}</span></div> <hr> <div><p>目的地：${applyLeavelocation}</p><p>行程日期：${formatDate(teavelList[j].applyLeavetime)}</p></div><hr> <div><a href="/skipToTravelDetails?Id=${teavelList[j].applyId}" style="float: right;color: #0388FA; text-decoration: none;margin-top: -12px;" >详情</a></div> </li>'
                                $("#ulList").append("<li class='lis'><div style='height: 4%'><span>" + types + "</span> <span style='float:right;'>" + states + "</span></div><hr> <div> <p>目的地：" + applyLeavelocation + "</p><p>行程时间：" + formatDate(teavelList[j].applyLeavetime) + "</p><p>申请时间：" + changeDateFormat1(teavelList[j].applyCreatetime) + "</p> </div><hr> <div><a href='/skipToTravelDetails?Id=" + teavelList[j].applyId + "' style='float: right;color: #0388FA; text-decoration: none;margin-top: -12px;' >详情</a></div> </li>")
                            }

                            //历史记录结束-------------
                        }
                    } else {
                        $(".panel-body").text("当前用户暂无申请记录");
                        $("#btnShenBao").hide();
                        var teavelLists = null
                        teavelLists = res.data
                        //历史记录开始-------------------------------------------------
                        var ulList = "";
                        var types = "";
                        var states = "";
                        var applyLeavelocations = ""
                        for (var k = 0; k < teavelLists.length; k++) {
                            //console.log(travelList[i])
                             if (teavelLists[k].applyType == 5) {
                                types = "19点后返校申请";
                                applyLeavelocations = teavelLists[k].applyNowlocation + " " + teavelLists[k].applyNowlocationdetail
                            }
                            if (teavelLists[k].applyState == 0) {
                                states = "已申请";
                            } else if (teavelLists[k].applyState == 1) {
                                states = "审核中";
                            } else if (teavelLists[k].applyState == 2) {
                                states = "审核中";
                            } else if (teavelLists[k].applyState == 3) {
                                states = "审核通过";

                            } else if (teavelLists[k].applyState == 4) {
                                var nameTeacher = teavelList[k].applyExamineIndentity
                                states = nameTeacher
                                // states = "被驳回";
                            } else if (teavelLists[k].applyState == 5) {
                                states = "审核通过撤销";
                            } else if (teavelLists[k].applyState == 6) {
                                states = "中途撤销";
                            }
                            $("#ulList").append("<li class='lis'><div style='height: 4%'><span>" + types + "</span> <span style='float:right;'>" + states + "</span></div><hr> <div> <p>目的地：" + applyLeavelocations + "</p> <p>行程时间：" + formatDate(teavelLists[k].applyLeavetime) + "</p><p>申请时间：" + changeDateFormat1(teavelLists[k].applyCreatetime) + "</p></div><hr> <div> <a href='/skipToTravelDetails?Id=" + teavelLists[k].applyId + "'  style='float: right;color: #0388FA; text-decoration: none;margin-top: -12px;' >详情</a></div> </li>")
                        }
                        //历史记录结束-------------
                    }

                    //console.log(teavelList)
                   // console.log(dsplist)
                }
            } else if(res.code == -1){
                $(".panel-body").text("当前用户暂无申请记录");
                $("#ulList").text("当前用户暂无历史记录");
                $("#btnShenBao").hide();
                $("#btnShenQing").show();
            }
        }
})
}
function BigimgTravel(){
    var imgUrl = $("#xcm").text();
    console.log(imgUrl)
    $("#imgUrl").attr("src",imgUrl)
    $("#Bigimg").show();
}
function BigimgCity(){
    var imgUrl = $("#tcm").text();
    console.log(imgUrl)
    $("#imgUrl").attr("src",imgUrl)
    $("#Bigimg").show();
}
function BigimgHesuan(){
    var imgUrl = $("#hsbg").text();
    console.log(imgUrl)
    $("#imgUrl").attr("src",imgUrl)
    $("#Bigimg").show();
}
function BigimgHesuan2(){
    var imgUrl = $("#hsbg2").text();
    console.log(imgUrl)
    $("#imgUrl").attr("src",imgUrl)
    $("#Bigimg").show();
}
function Bigimgqingjt(){
    var imgUrl = $("#qjt").text();
    console.log(imgUrl)
    $("#imgUrl").attr("src",imgUrl)
    $("#Bigimg").show();
}

function Bigimgcns(){
    var imgUrl = $("#lxcns").text();
    console.log(imgUrl)
    $("#imgUrl").attr("src",imgUrl)
    $("#Bigimg").show();
}

function BigimgHCP(){
    var imgUrl = $("#lihcp").text();
    console.log(imgUrl)
    $("#imgUrl").attr("src",imgUrl)
    $("#Bigimg").show();
}

function Bigimgzhiqingshu(){
    var imgUrl = $("#tys").text();
    console.log(imgUrl)
    $("#imgUrl").attr("src",imgUrl)
    $("#Bigimg").show();
}
$("#Bigimg").click(function(){
    $(this).hide();
});

function LiuYanJilu() {
    $("#LiuYanBox").show();
    $(".chakanLiuyan").hide();
}
//时间戳转换日期
function formatDate(value) {
    var now = new Date(value);
    var year=now.getFullYear();
    var month=now.getMonth()+1;
    var date=now.getDate();
    return year+"-"+month+"-"+date;
}
function changeDateFormat2(cellval) {
    var dateVal = cellval + "";
    if (cellval != null) {
        var date = new Date(parseInt(dateVal.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        // var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return hours + ":" + minutes ;
    }
}
function changeDateFormat1(cellval) {
    var dateVal = cellval + "";
    if (cellval != null) {
        var date = new Date(parseInt(dateVal.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return date.getFullYear() + "-" + month + "-" + currentDate + " " + hours + ":" + minutes ;
    }
}
//重新申请
function ReShenQing() {
    var ids = $("#applyId").val()
    // console.log(ids)
    var shenqing = $("#fhsq").text()
    // console.log(shenqing)
    if(shenqing == "离沪申请" ){
        window.location.href="/skipToUpdateTravel?valueTavel=0&apply=1&applyId="+ids+""
    }
    if(shenqing == "离校不离沪" ){
        window.location.href="/skipToUpdateTravel?valueTavel=2&apply=1&applyId="+ids+""
    }
    if(shenqing == "返校申请" ){
        window.location.href="/skipToUpdateTravel?valueTavel=3&apply=1&applyId="+ids+""
    }
    if(shenqing == "19点后返校申请（住校学生）" ){
        window.location.href="/skipToUpdateTravel?valueTavel=5&apply=1&applyId="+ids+""
    }
}


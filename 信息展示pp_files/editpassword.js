var server = window.location.pathname.split("\/");
var host = window.location.protocol+"//"+window.location.hostname+":"+window.location.port;

//登录风险地区
$.ajax({
    type: "POST",
    url: "/SelectNoticee",
    data: {},
//    async: false, //同步
    success:function(msg){
//    	console.log(msg)
//    	console.log(msg.insert_time.split(" ")[0])
//    	console.log(msg.insert_time.split(":")[0])
    	var Y = msg.insert_time.split(" ")[0].split("-")[0];
    	var M = msg.insert_time.split(" ")[0].split("-")[1];
    	var D = msg.insert_time.split(" ")[0].split("-")[2];
    	var H = msg.insert_time.split(":")[0].split(" ")[1];
    	var time = Y + "年" + M + "月" + D + "日" + H + "时"
    	$("#HighRiskTime span").html(time);
    	$("#HighRiskCon").html(msg.context);
    }
});



$(function () {

	//修改密码
	//otherpersonEmail='test@qq.com';
	console.log(otherpersonEmail);
	if (otherpersonEmail.indexOf("@shanghaitech")==-1) {
		$.ajax({
		    type:"POST",
		    url: "/findOtherUserByEmail",//你的请求程序页面随便啦
		    async:false,//同步：意思是当有返回值以后才会进行后面的js程序。
		    data:{
		    	otherpersonEmail:otherpersonEmail,
		    },		//请求需要发送的处理数据
		    success:function(msg){
		    	var data=eval(msg);
		    	//alert("data数据"+data.otherpersonName)
		    	//alert("data数据"+data.otherpersonId)
		    	if (data!=null&&data!="") {
		    	   $("#yhm").val(data.otherpersonName);
		    	   $("#otherpersonId").val(data.otherpersonId);
				}
		    }
		});
	}else{
		$("#xgmm").remove();
		$("#xgmm1").remove();
	}
	
	

})

$('#ChangePwdform').bootstrapValidator({
	message: 'This value is not valid', 
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        oldpwd: {
            message:'密码无效',
            validators: {
                notEmpty: {
                    message: '旧密码不能为空'
                },
                stringLength: {
                    min: 6,
                    max: 16,
                    message: '旧密码长度必须在6到16之间'
                }
            }
        },
        newpwd: {
        	message:'密码无效',
        	validators: {
        		notEmpty: {
        			message: '新密码不能为空'
        		},
        		stringLength: {
        			min: 6,
        			max: 16,
        			message: '新密码长度必须在6到16之间'
        		},
        		regexp: {
        			regexp: /^[a-zA-Z0-9_\.]+$/,
        			message: '新密码只能包含大小写英文字母、数字和下划线'
        		},
        		different: {
        			field: 'oldpwd',
        			message: '新密码不能和旧密码相同'
        		}
        	}
        },
        againpwd: {
            message:'密码无效',
            validators: {
                notEmpty: {
                    message: '确认密码不能为空'
                },
                identical: {
                    field: 'newpwd',
                    message: '两次密码不一致'
                }
            }
        },
    }
}).on('success.form.bv',function(){	
	if($('#ChangePwdform').data('bootstrapValidator').isValid()){
		$.ajax({
		    type:"POST",
		    url: "/findUserupdate",//你的请求程序页面随便啦
		    async:false,//同步：意思是当有返回值以后才会进行后面的js程序。
		    data:{
		    	otherpersonId:$("#otherpersonId").val(),
		    	otherpersonPwd:$("#newpwd").val(),
		    	oldpwd:$("#oldpwd").val()
		    },		//请求需要发送的处理数据
		    success:function(msg){
		    	//alert(msg)
		    	if(msg>=0){
		    		window.location.href ='/matching';
		    	}else{
		    		 ToastrOptions();
						toastr.error('旧密码错误！'); 
		    	}
		            
		    }
		});
	}
});
$("#change-pwd-btn").click(function() {
   //	window.location.href ='/matching';
	$('#ChangePwdform').data('bootstrapValidator').validate();
}); 

var otherpersonEmail=$("#otherpersonEmail").val();

function dengchu(){
	
	$.ajax({
	    type:"POST",
	    url:"/clearSession",//你的请求程序页面随便啦
	    async:true,//同步：意思是当有返回值以后才会进行后面的js程序。
	    data:{
	    	otherpersonId:$("#otherpersonId").val(),
	    	otherpersonPwd:$("#newpwd").val(),
	    },		//请求需要发送的处理数据
	    success:function(msg){
			var keys = document.cookie.match(/[^ =;]+(?==)/g)
		  	    	  if (keys) {
		  	    	    for (var i = keys.length; i--;) {
		  	    	      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
		  	    	      document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
		  	    	      document.cookie = keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
		  	    	    }
		  	    	  }
	    	if (otherpersonEmail.indexOf("@shanghaitech")!=-1) {
	    		$(window).attr('location',"/adMatching");
	    	}else{
	    		$(window).attr('location',"/matching");
	    	}
	    }
		});
	
}



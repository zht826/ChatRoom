/**
 * Created by lorra on 16/8/27.
 */
var DEV_IP = "http://192.168.1.142:8088/unifiedAction.json";
var TEST_IP = "http://192.168.1.21:8088/unifiedAction.json";
var PREPARE_IP = "http://58.246.29.186:10188/unifiedAction.json";
var PRO_IP = "http://app.imobpay.com:10188/unifiedAction.json";
var PRO_PUBLICKEY = " A8C12720E3A6A5F224058D1CB4D57FB4522521D2BBD025CA80105826B335079862A294F97C129E59B9ED5B497EF5B6AD17AFDE482AB9C22E0499444039E18845A70F59028F367175253973CDF180C2E97DFAB7C0E12B22E2E241ACCB5A58EBC15344F956A7806B1F02ADDB354E4FCA0185268542F7780456187F10B9D6FF5995";
var DEV_PUBLICKEY = "AC5146C8C0D25BC9E54A1031ABB2A8AA28817F5BD9049085592CCAD557E239CA8862C9EFA1CDBA101B12501F47A365EB31D42E9BD2197F5A2C3971692FDEED8CC3683AC7189AA81AC36F64CFC28074825285309EA6D2D18679545C6A2A935BAB6CB5CB92AF6066D133579D49FC692EEBB7C0261FAE265DDC91025F0DC77810F9";
var DEV_APPID = "wx3119aa81ff8bdd9f";//'wx3119aa81ff8bdd9f',//wxdd4b05a5827fc20e
var PRO_APPID = "wxdd4b05a5827fc20e";//'wx3119aa81ff8bdd9f',//wxdd4b05a5827fc20e
var regName =/^[\u4e00-\u9fa5]{2,4}$/;
var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
var mobileRegex = /^(((1[3456789][0-9]{1})|(15[0-9]{1}))+\d{8})$/;
var regAmount = /^\d+(\.\d+)?$/;

//生产
/*var PublicKeyString = PRO_PUBLICKEY;
 var reqip = PRO_IP;
 var appId = PRO_APPID;*/

//准生产
var PublicKeyString = PRO_PUBLICKEY;
var reqip = TEST_IP;
var appId = DEV_APPID;

var callback;
var appuser = "qtwkzf";//qtpay
var keysign="vdfgsfghtomjnb06onivu423gdsj6g6s"; //默认key
var clientType = "04";
var version = "1.0.0";
var temptoken="0000";
var pubaccount = localStorage.getItem("pubaccount") || "TAService";
var token = _COMMON.jsonP( localStorage.getItem(pubaccount)).token || "0000";
var userflag,selfinvitecode;
var translogno=parseInt(000001);
var tempmobileno="18616671086";
var myDate,ymd,hms;
/*取length数,位数不足前面补0*/
function fix(num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}

/*编码加密处理*/
function encodeFun(str){
    var tempencode = $.md5(encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+'));
    return tempencode;
}
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
/*接口ajax请求*/
function tryajax(str){
    $.ajax({
        url:reqip,
        type:'get',
        /*data:str,*/
        data:str,
        dataType:'text',
        success:function(data){
            callback=_COMMON.toJson(data);
            println(callback);
        },
        error:function(){
            //失败调用该函数
        }

    });
}

/*1.查询appUser对应的信息*/
function getappuser(){
    myDate = new Date();
    ymd=""+myDate.getFullYear()+""+""+fix(myDate.getMonth()+1, 2)+""+""+fix(myDate.getDate(),2)+"";
    hms=""+fix(myDate.getHours(),2)+""+""+fix(myDate.getMinutes(),2)+""+""+fix(myDate.getSeconds(),2)+"";
    var temppublic='<QtPay application=\"GetClientInfo.Req\" appUser=\"qtpay\" version=\"1.2.0\" osType=\"android4.4.4\" mobileSerialNum=\"86627202066432000000000000000000000000000\" userIP=\"192.168.3.178\" clientType=\"02\" token=\"0000\" customerId=\"0000\" phone=\"'+tempmobileno+'\" longitude=\"121.535403\" latitude=\"31.214026\"><appType>UserRegister</appType><orderId></orderId><mobileNo>'+tempmobileno+'</mobileNo><transDate>'+ymd+'</transDate><transTime>'+hms+'</transTime><appUsers>'+appuser+'</appUsers><transLogNo>' +fix(translogno+1,6)  +'</transLogNo><sign>';
    var GetClientInfo=temppublic;
    GetClientInfo +=keysign + '</sign></QtPay>';

    var allGetClientInfo='requestXml='+temppublic;
    allGetClientInfo += encodeFun(GetClientInfo)+'</sign></QtPay>';
    tryajax(allGetClientInfo);
}
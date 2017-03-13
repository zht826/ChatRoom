/**
 * Created by lorra on 16/8/27.
 */
var DEV_IP = "http://192.168.1.142:8088/unifiedAction";
var TEST_IP = "http://192.168.1.21:8088/unifiedAction";
var PREPARE_IP = "http://58.246.29.186:10188/unifiedAction";
var PRO_IP = "http://app.imobpay.com:10188/unifiedAction";
var PRO_PUBLICKEY = " A8C12720E3A6A5F224058D1CB4D57FB4522521D2BBD025CA80105826B335079862A294F97C129E59B9ED5B497EF5B6AD17AFDE482AB9C22E0499444039E18845A70F59028F367175253973CDF180C2E97DFAB7C0E12B22E2E241ACCB5A58EBC15344F956A7806B1F02ADDB354E4FCA0185268542F7780456187F10B9D6FF5995";
var DEV_PUBLICKEY = "AC5146C8C0D25BC9E54A1031ABB2A8AA28817F5BD9049085592CCAD557E239CA8862C9EFA1CDBA101B12501F47A365EB31D42E9BD2197F5A2C3971692FDEED8CC3683AC7189AA81AC36F64CFC28074825285309EA6D2D18679545C6A2A935BAB6CB5CB92AF6066D133579D49FC692EEBB7C0261FAE265DDC91025F0DC77810F9";
// var DEV_APPID = "wx3119aa81ff8bdd9f";//'wx3119aa81ff8bdd9f',//wxdd4b05a5827fc20e
var DEV_APPID = "wx9b1a175903ec656a";//瑞推客
var PRO_APPID = "wxdd4b05a5827fc20e";//'wx3119aa81ff8bdd9f',//wxdd4b05a5827fc20e
var regName = /^[\u4e00-\u9fa5]{2,4}$/;
var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
var mobileRegex = /^(((1[3456789][0-9]{1})|(15[0-9]{1}))+\d{8})$/;
var regAmount = /^\d+(\.\d+)?$/;

//生产
// var PublicKeyString = PRO_PUBLICKEY;
// var reqip = PRO_IP;
// var appId = PRO_APPID;

//准生产
//var PublicKeyString = PRO_PUBLICKEY;
//var reqip = PREPARE_IP;
//var appId = DEV_APPID;

//测试
var PublicKeyString = DEV_PUBLICKEY;
var reqip = TEST_IP;
var appId = DEV_APPID;


var callback;
var appuser = "bmzhangguibao";
var keySign = "n85o3nd2romjnb06onivuq1m85k1qnfl";
var clientType = "04";
var version = "3.7.1";
var temptoken = "0000";
var pubaccount = localStorage.getItem("pubaccount") || "TAService";
var token = _COMMON.jsonP(localStorage.getItem(pubaccount)).token || "0000";
var canClick = true;//可以点击
var translogno = 0;
var tempmobileno = "18616671086";
/*取length数,位数不足前面补0*/
function fix(num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}

function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/*验证是否登录异常*/
function checkLogin(rspCode){
    var errorMsg = "0001,0002,9180,9309";
    var result = true;
    if(rspCode && errorMsg.indexOf(rspCode) > -1){
        result = false
    }
    return result;
}

/*接口ajax请求*/
function tryajax(str,reqtype) {
    var ajaxIp;
    if(!arguments[1]){
        reqtype = "GET";
    }
    //根据传入的str类型，判断是xml请求还是json请求，从而选择不同的接口地址
    if(typeof str == "object"){
        ajaxIp = reqip + '.json';
    }else{
        ajaxIp = reqip + '.do';
    }
    _COMMON.ajaxReq({
        url: ajaxIp,              //请求地址
        type: reqtype,
        data: str,        //请求参数
        success: function (res) {
            // 此处放成功后执行的代码
            console.log(res);
            println(_COMMON.toJson(res));
        },
        fail: function (status) {
            console.log(status);
        }
    })
}

var _COMMON = (function(){
    var getRequest = function (){
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    };
    /**
     * 获取当前时间并格式化：20150112102556
     * @returns {string}
     */
    var getLocaltime = function() {
        var myDate = new Date();
        return myDate.getFullYear()+''+fix(myDate.getMonth()+1, 2)+''+fix(myDate.getDate(),2)+''+fix(myDate.getHours(),2)+''+fix(myDate.getMinutes(),2)+''+fix(myDate.getSeconds(),2);
    };
    /*获取年月日*/
    var getTimeDetail = function() {
        var obj = {};
        var myDate = new Date();
        obj.ymd = ""+myDate.getFullYear()+""+""+fix(myDate.getMonth()+1, 2)+""+""+fix(myDate.getDate(),2)+"";
        obj.hms = ""+fix(myDate.getHours(),2)+""+""+fix(myDate.getMinutes(),2)+""+""+fix(myDate.getSeconds(),2)+"";
        return obj;
    };
    var ajaxGet = function(options){
        options = options || {};
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        //格式化参数
        function formatParams(data) {
            var arr = [];
            for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
            }
            return arr.join("&");
        }

        var params = formatParams(options.data);
        if(typeof options.data =='string'){//请求内容为xml时，不用格式化参数
            params = options.data;
        }
        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        };

        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }
    }

    /*rsa加密前报文处理*/
    var preRsa = function(phoneno,pwd){
        var tempstr = "00000000";
        var temppwd = pwd;
        var tempmobile = phoneno;

        if(((temppwd.length).toString().length)%2==1){
            tempstr = tempstr + "0" + (temppwd.length).toString();
        }else {
            tempstr = tempstr + (temppwd.length).toString();
        }
        tempstr += temppwd;
        tempstr += getLocaltime();
        tempstr += tempmobile;
        return tempstr;
    };


    /**
     * 获取客户端类型
     */
    var getClient = function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        var browser={//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
        if(browser.iPhone){
            return "iphone";
        }else if(browser.android){
            return "android";
        }else {
            return "web";
        }
    };

    /**
     * 位数不满len位，前面补零
     * @param num 需要格式的数据
     * @param len 输出数据的长度
     * @returns {string}
     */
    var fix = function(num, len) {
        return ('' + num).length < len ? ((new Array(len + 1)).join('0') + num).slice(-len) : '' + num;
    };

    /**
     * json转换
     * @param obj
     * @returns {*}
     */
    var jsonParse = function(obj){
        if(typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length){
            return obj;
        }else {
            try {
                if(obj){
                    return JSON.parse(obj);
                }else {
                    return {};
                }
            } catch (e) {
                return {};
            }
        }
    };
    //解析xml字符串变量为IXMLDOMDocument2
    function parseXML(data) {
        var xml, tmp;
        if (window.DOMParser) { // Standard
            tmp = new DOMParser();
            xml = tmp.parseFromString(data, "text/xml");
        } else { // IE
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = "false";
            xml.loadXML(data);
        }
        tmp = xml.documentElement;
        if (!tmp || !tmp.nodeName || tmp.nodeName === "parsererror") {
            return null;
        }
        return xml;
    }

    //将 IXMLDOMDocument2 转换为JSON，参数为IXMLDOMDocument2对象　　
    function xml2json(obj) {
        if (this == null) return null;
        var retObj = new Object;
        buildObjectNode(retObj,
            /*jQuery*/
            obj);
        return retObj;
        function buildObjectNode(cycleOBJ,
                                 /*Element*/
                                 elNode) {
            /*NamedNodeMap*/
            var nodeAttr = elNode.attributes;
            if (nodeAttr != null) {
                if (nodeAttr.length && cycleOBJ == null) cycleOBJ = new Object;
                for (var i = 0; i < nodeAttr.length; i++) {
                    cycleOBJ[nodeAttr[i].name] = nodeAttr[i].value;
                }
            }
            var nodeText = "text";
            if (elNode.text == null) nodeText = "textContent";
            /*NodeList*/
            var nodeChilds = elNode.childNodes;
            if (nodeChilds != null) {
                if (nodeChilds.length && cycleOBJ == null) cycleOBJ = new Object;
                for (var i = 0; i < nodeChilds.length; i++) {
                    if (nodeChilds[i].tagName != null) {
                        if (nodeChilds[i].childNodes[0] != null && nodeChilds[i].childNodes.length <= 1 && (nodeChilds[i].childNodes[0].nodeType == 3 || nodeChilds[i].childNodes[0].nodeType == 4)) {
                            if (cycleOBJ[nodeChilds[i].tagName] == null) {
                                cycleOBJ[nodeChilds[i].tagName] = nodeChilds[i][nodeText];
                            } else {
                                if (typeof(cycleOBJ[nodeChilds[i].tagName]) == "object" && cycleOBJ[nodeChilds[i].tagName].length) {
                                    cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length] = nodeChilds[i][nodeText];
                                } else {
                                    cycleOBJ[nodeChilds[i].tagName] = [cycleOBJ[nodeChilds[i].tagName]];
                                    cycleOBJ[nodeChilds[i].tagName][1] = nodeChilds[i][nodeText];
                                }
                            }
                        } else {
                            if (nodeChilds[i].childNodes.length) {
                                if (cycleOBJ[nodeChilds[i].tagName] == null) {
                                    cycleOBJ[nodeChilds[i].tagName] = new Object;
                                    buildObjectNode(cycleOBJ[nodeChilds[i].tagName], nodeChilds[i]);
                                } else {
                                    if (cycleOBJ[nodeChilds[i].tagName].length) {
                                        cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length] = new Object;
                                        buildObjectNode(cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length - 1], nodeChilds[i]);
                                    } else {
                                        cycleOBJ[nodeChilds[i].tagName] = [cycleOBJ[nodeChilds[i].tagName]];
                                        cycleOBJ[nodeChilds[i].tagName][1] = new Object;
                                        buildObjectNode(cycleOBJ[nodeChilds[i].tagName][1], nodeChilds[i]);
                                    }
                                }
                            } else {
                                cycleOBJ[nodeChilds[i].tagName] = nodeChilds[i][nodeText];
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * 将返回内容转成json
     * @param str 需要转换的参数
     * @returns {*}
     */
    var toJson = function(str){
        if(!str){
            str='';
        }
        var result;
        if (str.indexOf("\<\?xml")>-1) {
            result = xml2json(parseXML(str));
            return result;
        } else {
            result = jsonParse(str);
            return result;
        }
    };
    /**
     * 获取银行卡图片
     * @param bankIdValue 银行卡id
     * @returns {*}
     */
    var getBankImg = function(bankIdValue){
        var bankImgSrc = "bank_default.png";
        switch (bankIdValue) {
            case "102":
                bankImgSrc = "102.png";
                break;
            case "103":
                bankImgSrc = "103.png";
                break;
            case "104":
                bankImgSrc = "104.png";
                break;
            case "105":
                bankImgSrc = "105.png";
                break;
            case "301":
                bankImgSrc = "301.png";
                break;
            case "302":
                bankImgSrc = "302.png";
                break;
            case "303":
                bankImgSrc = "303.png";
                break;
            case "304":
                bankImgSrc = "304.png";
                break;
            case "305":
                bankImgSrc = "305.png";
                break;
            case "306":
                bankImgSrc = "306.png";
                break;
            case "307":
                bankImgSrc = "307.png";
                break;
            case "308":
                bankImgSrc = "308.png";
                break;
            case "309":
                bankImgSrc = "309.png";
                break;
            case "310":
                bankImgSrc = "310.png";
                break;
            case "322":
                bankImgSrc = "322.png";
                break;
            case "403":
                bankImgSrc = "403.png";
                break;
            case "501":
                bankImgSrc = "501.png";
                break;
            case "502":
                bankImgSrc = "502.png";
                break;
            case "531":
                bankImgSrc = "531.png";
                break;
            case "671":
                bankImgSrc = "671.png";
                break;
            default:
                break;
        }
        return bankImgSrc;
    };
    /**
     * 银行卡名称缩写
     * @param bankIdValue 银行卡id
     * @param bankName 银行名称
     * @returns {*}
     */
    var getBankName = function(bankIdValue,bankName){
        var getBankName = bankName;
        switch (bankIdValue) {
            case "102":
                getBankName = "工商银行";
                break;
            case "103":
                getBankName = "农业银行";
                break;
            case "104":
                getBankName = "中国银行";
                break;
            case "105":
                getBankName = "建设银行";
                break;
            case "301":
                getBankName = "交通银行";
                break;
            case "302":
                getBankName = "中信银行";
                break;
            case "303":
                getBankName = "光大银行";
                break;
            case "304":
                getBankName = "华夏银行";
                break;
            case "305":
                getBankName = "民生银行";
                break;
            case "306":
                getBankName = "广发银行";
                break;
            case "307":
                getBankName = "平安银行";
                break;
            case "308":
                getBankName = "招商银行";
                break;
            case "309":
                getBankName = "兴业银行";
                break;
            case "310":
                getBankName = "浦发银行";
                break;
            case "313":
                getBankName = "城市商业银行";
                break;
            case "322":
                getBankName = "农村商业银行";
                break;
            case "402":
                getBankName = "信用社";
                break;
            case "403":
                getBankName = "邮政储蓄";
                break;
            case "501":
                getBankName = "汇丰银行";
                break;
            case "502":
                getBankName = "东亚银行";
                break;
            case "531":
                getBankName = "花旗银行";
                break;
            case "671":
                getBankName = "渣打银行";
                break;
            default:
                break;
        }
        return getBankName;
    };

    return{
        clientType : getClient,
        fix : fix,
        getLocaltime : getLocaltime,
        getTimeDetail : getTimeDetail,
        jsonP : jsonParse,
        toJson : toJson,
        bankImg : getBankImg,
        bankNae : getBankName,
        ajaxReq : ajaxGet,
        preRsa:preRsa,
        getRequest:getRequest
    }
})();

/**
 * debug调试插件
 * isdebug为true时，启用调试,每个方法下均有是否启用各自功能的开关
 * 生产环境时需将debug置为false
 */
var isDebug = true;
var debug = {
    //在控制台打印调试信息
    print:function(msg){
        var isPrint = true;//控制print是否启用
        if(isDebug && isPrint){
            console.log(msg);
        }else{
            return
        }
    },
    //alert弹出调试信息
    alert:function(msg){
        var isAlert = true;//控制alert是否启用
        if(isDebug && isAlert){
            alert(msg);
        }else{
            return
        }
    }
};

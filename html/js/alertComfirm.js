var  alertComfirm = {
    /**
     * 隐藏dialog，直接调用即可
     */
    closeAlert: function() {
        var modal = document.getElementsByClassName('modal')[0];
        modal.className = "modal modal-out";
        setTimeout(function(){
            modal.style.zIndex = '-9999';
        },400)
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }
        var overlay = document.getElementsByClassName('modal-overlay')[0];
        if (overlay) {
            overlay.className = "modal-overlay";
        }
    },
    /**
     * 弹出dialog，根据传入参数判定显示情况，一个参数时为提示内容
     * @param text 提示内容
     * @param title 提示标题
     * @param buttontextLeft    只需一个按钮时的按钮名称，两个按钮时左侧按钮的名称
     * @param buttontextRight   需要两个按钮时右侧按钮的名称
     * @param callbackOk    两个按钮时右侧按钮的回调函数
     */
    customAlert: function(text, title, buttontextLeft, buttontextRight, callbackOk) {
        var twobtn = false;//判断是几个按钮，一个为false、两个为true
        //根据传入的参数判断使用参数还是默认值
        if (typeof title === 'function') {
            callbackOk = arguments[1];
            title = "提示";
            buttontextLeft = "确定";
            twobtn = false;
        } else if (typeof buttontextLeft === 'function') {
            callbackOk = arguments[2];
            buttontextLeft = "确定";
            twobtn = false;
        } else if (typeof buttontextRight === 'function') {
            callbackOk = arguments[3];
            buttontextLeft = "确定";
            twobtn = false;
        } else if (typeof buttontextRight === 'string') {
            twobtn = true;
        }
        if (arguments[1] === undefined) {//传入一个参数时
            title = "提示";
            buttontextLeft = "确定";
            twobtn = false;
        }else if(arguments[2] === undefined) {//传入两个参数时
            buttontextLeft = "确定";
            twobtn = false;
        }

        var _modalTemplateTempDiv = document.createElement('div');
        var titleHTML = title ? '<div class="modal-title">' + title + '</div>' : '';
        var textHTML = text ? '<div class="modal-text">' + text + '</div>' : '';
        var buttonsHTML = '<span class="modal-button modal-button-bold">' + buttontextLeft + '</span>';
        //两个按钮时改变buttonsHTML的内容
        if(twobtn){
            buttonsHTML = '<span class="modal-button modal-button-bold">' + buttontextLeft + '</span>'+'<span class="modal-button modal-button-bold">' + buttontextRight + '</span>';
        }
        var modalHTML = '<div class="modal modal-in"><div class="modal-inner">' + (titleHTML + textHTML) + '</div><div class="modal-buttons">' + buttonsHTML + '</div></div>';
        _modalTemplateTempDiv.innerHTML = modalHTML;

        //判断是否存在不透明层，存在即显示，不存在即添加
        var overlay = document.getElementsByClassName('modal-overlay')[0];
        if (typeof overlay == 'undefined') {
            var layoutHtml = document.createElement('div');
            layoutHtml.className = 'modal-overlay modal-overlay-visible';
            document.getElementsByTagName('body')[0].appendChild(layoutHtml);
        } else {
            overlay.className = overlay.className + ' modal-overlay-visible';
        }
        //如果已经存在modal框，删除
        if (document.getElementsByClassName('modal')[0]) {
            document.getElementsByClassName('modal')[0].parentNode.removeChild(document.getElementsByClassName('modal')[0]);
        }
        document.getElementsByTagName('body')[0].appendChild(_modalTemplateTempDiv.firstChild);

        document.getElementsByClassName('modal-in')[0].style.display='block';
        var modalHeight = document.getElementsByClassName('modal-in')[0].offsetHeight || 0;
        document.getElementsByClassName('modal-in')[0].style.marginTop = -modalHeight / 2 + "px";
        var self = this;
        // Add events on buttons
        var btnCount = document.getElementsByClassName('modal-button').length;
        for(var i = 0;i<btnCount;i++){
            if(i==1){
                document.getElementsByClassName('modal-button')[i].addEventListener('click',function(){
                    self.closeAlert();
                    callbackOk();
                })
            }else if(i==0){
                document.getElementsByClassName('modal-button')[i].addEventListener('click',function(){
                    self.closeAlert();
                })
            }
        }
        if(btnCount==1 && callbackOk){
            document.getElementsByClassName('modal-button')[0].addEventListener('click',function(){
                self.closeAlert();
                callbackOk();
            })
        }
    }
};

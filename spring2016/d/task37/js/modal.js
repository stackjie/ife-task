var Modal = function(elem) {
    // 保存this
    var that = this;
    
    this.elem = elem;

    // 保存className以便于修改className
    this.saveClassName = elem.className;

    // 给对话框外围黑色背景添加onclick事件点击后对话框消失
    this.elem.onclick = function(e){
       if(e.eventPhase !== 2) return false;
        that.hide();
    }

    // 检测对话框header是否存在关闭按钮，如果存在关闭按钮绑定事件
    var modalBtnClose = this.elem.getElementsByClassName('modal-btn-close');
    modalBtnClose = modalBtnClose?modalBtnClose[0]:false;
    if(modalBtnClose){
        modalBtnClose.onclick = function(){
            that.hide();
        };
    }

    return this;
}
Modal.prototype = {
    constructor: Modal,

    // 显示对话框方法
    show: function() {
        this.elem.className = this.saveClassName + ' show'; 
    },

    // 隐藏对话框方法
    hide: function() {
        this.elem.className = this.saveClassName + ' hide';
    },

    // 开启对话框拖动功能
    startDrag: function() {
        // 参数对象
        var params = {
            left: 0,

            top: 0,

            // 保存上次的X坐标
            currentX: 0,

            // 保存上次的Y坐标
            currentY: 0,

            // 存放鼠标是否按下的flag
            flag: false
        };
        var dialog = this.elem.getElementsByClassName('modal-dialog')[0];
        var header = this.elem.getElementsByClassName('modal-header')[0];
        
        // 添加鼠标按下事件
        header.addEventListener('mousedown',function(e){
            // 按下鼠标保存当前的坐标
            params.currentX = e.clientX;
            params.currentY = e.clientY;
            params.flag = true;
            
        },false);

        // 添加鼠标移动事件
        header.addEventListener('mousemove',function(e){
            // 按下鼠标不松开时flag为true,松开为false
            if(params.flag){
                // 用当前移动的坐标减去上次移动的坐标就是left/top要增加的坐标
                params.left = params.left + ( e.clientX - params.currentX );
                params.top =  params.top + ( e.clientY - params.currentY );

                // 设置css
                dialog.style.left = params.left + 'px';
                dialog.style.top = params.top + 'px';

                // 保存本次的坐标以便下次计算
                params.currentX = e.clientX;
                params.currentY = e.clientY;
                
            }

        },false);

        //  添加鼠标松开事件，鼠标松开将flag设为false将不再触发拖动
        header.addEventListener('mouseup',function(){
            params.flag = false;
        },false);
        
    }
}

    

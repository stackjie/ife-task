/**
 * [AirShip description]
 * @param {int} id
 */
function AirShip(id){
	this.id = id;
	this.el = $('<div class="airship-box"><div class="airship"><p>'+this.id+'号'+'</p></div></div>');
	this.power = 100;  //飞船的能源
	this.flyIntervalId;  //用于记录start飞行时的interval
	this.deg = 0;  //飞船的角度
	this.status = '';  //飞船的状态
	this.powerBar = $('<div class="power-bar"></div>');  //能量条
	this.el.find('.airship').append(this.powerBar);
	this.el.attr('id',id);
	AirShip.airShips.push(this);  //将飞船加入静态属性数组
	$('.main-wrap').append(this.el);
	
	

	this.receiver = function(comm){
		if (comm.id === this.id) {
			
			if (comm.command === 'start') {
				this.start();
			}else if(comm.command === 'stop'){
				this.stop();
			}else if(comm.command === 'destroy'){
				this.destroy();
			}
		}
	}

	this.start = function(){

		//如果飞船当前状态为start（飞行中）退出函数
		if(this.status === 'start'){
			return false;
		}

		this.status = 'start';  //将状态置为start
		var that = this;  //保存this
		//旋转动画
		this.flyIntervalId = setInterval(function(){
			if(that.deg !== 360){
				that.deg += 18;
			}else{
				that.deg = 18;
			}

			that.el.css('transform','rotate('+that.deg+'deg)');

			//消耗能源
			that.power = that.power - 5;
			that.powerBar.width(that.power+'%');

			if(that.power === 0){
				that.stop();
				that.charge();
			}
		},500);
		
	}
	this.stop = function(){

		//如果飞船当前状态为stop（暂停中）退出函数
		if(this.status === 'stop'){
			return false;
		}

		this.status = 'stop';  //将状态置为stop
		//判断flyIntervalId等于null就不执行stop函数
		if (this.flyIntervalId) {
			clearInterval(this.flyIntervalId);
			this.flyIntervalId = null;
		}
		
	}
	this.destroy = function(){
		//删除dom节点
		this.el.remove();
		//删除AirShip.airShips数组中的当前对象元素
		var index = AirShip.airShips.indexOf(this);
		AirShip.airShips.splice(index,1);
	}
	this.charge = function(){
		this.status = 'charge';  //将状态置为stop
		var that = this;  //记录this
		var intervalId = setInterval(function(){
			that.power = that.power + 5;
			that.powerBar.width(that.power+'%');

			if(that.power === 100){
				that.start();
				clearInterval(intervalId);
			}
		},200);
	}


	return this;
}
/**
 * AirShip静态方法、静态属性
 */
AirShip.airShips = [];


/**
 * [Control description]控制器 单例模式
 * @return {object}返回包装好的对象
 */
var Control = (function (){
	
	var  ids = ['4','3','2','1'];
	return {
		send:function(comm){

			//模拟30%丢包率
			if(Math.random() > 0.3){
				if(comm.command === 'create'){
					if(AirShip.airShips.length !== 4){

						//设置id
						var id = ids[ids.length-1];
						ids.pop();
								
						new AirShip(id);
						return id;  //创建成功返回id值
					}
					
				}else{
					//广播所有飞船
					for (var i = 0; i < AirShip.airShips.length; i++) {
						AirShip.airShips[i].receiver(comm);
					}

					//如果销毁飞船解除销毁飞船的id占位
					if(comm.command === 'destroy'){
						ids.push(comm.id);
					}

					return true; //成功返回true
				}
			}else{
				//丢包
				return false;
			}

		}
	}
}());

/**
 * [Commander description]指挥官 单例模式
 * @return {object}返回包装好的对象
 */
var Commander = (function (){
	var result;
	return {

		commandCreate:function(){
			result = Control.send({
				command:'create'
			});
			return result;
		},

		commandStart:function(id){
			result = Control.send({
				id:id,
				command:'start'
			});
			return result;
		},

		commandStop:function(id){
			result = Control.send({
				id:id,
				command:'stop'
			});
			return result;
		},

		commandDestroy:function(id){
			result = Control.send({
				id:id,
				command:'destroy'
			});
			return result;
		}
	}
}());



/**
 * [init description]初始化函数
 * @return {[type]}
 */
function init(){
	$('#btn_create').click(function(){
		var result = Commander.commandCreate();  //如果创建成功将返回飞船的id值

		if (result) {
			var btnGroup = $('<div class="group"></div>');

			//添加操作飞船的表单
			btnGroup.html(
				'<p>'+result+'号飞船：</p><input type="button" value="开始飞行" id="air_start_'+result+'" />'
				+'<input type="button" value="停止飞行" id="air_stop_'+result+'" />'
				+'<input type="button" value="销毁" id="air_destroy_'+result+'" />'
			);
			$('.btns'). prepend(btnGroup);
		}
		return false;
	});

	//事件委托
	$('#btns').click(function(ev){
		
		//兼容写法
		var ev = ev || window.event;
    	var target = ev.target || ev.srcElement;

    	//获取命令和飞船id
    	var str = target.id.substring(4);
		var id = str.substring(str.indexOf('_')+1);
		var command = str.substring(0,str.indexOf('_'));
    	
    	var result;
    	if(command === 'start'){
    		result = Commander.commandStart(id);
    		
    	}else if(command === 'stop'){
    		result = Commander.commandStop(id);
    		
    	}else if(command === 'destroy'){
    		result = Commander.commandDestroy(id);
    		if(result){
    			$(target).parent().remove();
    		}
    	}



    		
	});
}
init();


function textFocus(){

	//获取提示文本dom节点
    var info = this.nextSibling;

	//清除样式
	this.parentNode.className = 'col-sm-10';
   
	if(this.id === 'input_name'){
		//设置提示文本内容
		info.innerHTML = '必填，4~16个字符';
	}else if(this.id === 'input_password'){
		info.innerHTML = '必填，8~20个字符，数字英文字母及下划线';
	}else if(this.id === 'input_af_password'){
		info.innerHTML = '确认输入的密码';
	}else if(this.id === 'input_email'){
		info.innerHTML = '必填，邮箱地址';
	}else if(this.id === 'input_phone'){
		info.innerHTML = '必填，手机号码';
	}

}

function textBlur(){
	var textCont = this.value;
	var formGroup = this.parentNode;
	var info = this.nextSibling;
	var infoText = '';
	var reg,res;
	if(!textCont){
		info.innerHTML = ''
		return;
	}
	if(this.id === 'input_name'){
		reg = /^[\u4e00-\u9fa5\w]{4,16}$/;
		res = reg.test(textCont);
		res?infoText = '':infoText = '输入的名称有误';
	}else if(this.id === 'input_password'){
		reg = /^\w{8,20}$/
		res = reg.test(textCont);
		res?infoText = '':infoText = '输入的密码有误';
	}else if(this.id === 'input_af_password'){
		var inputPwd = document.getElementById('input_password');
		reg = /^\w{8,20}$/
		res = reg.test(textCont);
		if(this.value === inputPwd.value && this.value !== '' && res === true){
			res = true;
		}
		res?infoText = '':infoText = '输入的确认密码有误';
	}else if(this.id === 'input_email'){
		reg = /^((\w+\.)*\w*)(@\w+)(\.\w+)*$/
		res = reg.test(textCont);
		res?infoText = '':infoText = '输入的邮箱有误';
	}else if(this.id === 'input_phone'){
		reg = /^1(3|4|5|6|7|8)\d{9}$/
		res = reg.test(textCont);
		res?infoText = '':infoText = '输入的手机号有误';
	}

	
	if (res) {
		formGroup.className = 'col-sm-10 has-success';
		info.innerHTML = '';
	} else {
		formGroup.className = 'col-sm-10 has-error';
		info.innerHTML = infoText;
	}
	
	

}

function init(){
	//绑定事件
	var inputText = document.getElementsByName('input-text');
	for (var i = 0; i < inputText.length; i++) {
		inputText[i].addEventListener('focus',textFocus,false);
		inputText[i].addEventListener('blur',textBlur,false);
	}
	document.getElementById('btn_form_commit').onclick = function () {
		var flagForm = false;
		var className,res;
		for (var i = 0; i < inputText.length; i++) {
			className = inputText[i].parentNode.className;
			res = className.indexOf('has-success');
			if(res === -1){
				alert('请检查输入的表单！');
				return;
			}
		}
		alert('所有表单输入正确');
	}

}

init();
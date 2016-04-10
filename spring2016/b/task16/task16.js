/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var aqi_city = document.getElementById("aqi-city-input").value.trim();
	var aqi_value = document.getElementById("aqi-value-input").value.trim();
	
	
	//表单验证
	if(!isNaN(aqi_city)) {
		alert("城市不能为数字!"); 
		return 0;
	}
	
	if(isNaN(aqi_value)){
		alert("空气质量只能填写整数!");
		return 0;
	} 
	
	aqiData[aqi_city] = aqi_value;
	renderAqiList(aqi_city);

}

/**
 * 渲染aqi-table表格
 */
function renderAqiList(key) {
	
	var aqi_tab = document.getElementById('aqi-table');
	
	if (aqi_tab.children.length === 0) {
		aqi_tab.innerHTML = "<tr> <td>城市</td> <td>空气质量</td> <td>删除</td> </tr>";
	}
	
	
	
	
	var tr = document.createElement('tr');
	
	
	//初始化删除按钮
	var del_btn = document.createElement('input');
	del_btn.type = "button";
	del_btn.value = "删除";
	del_btn.onclick = delBtnHandle;
	var td_btn = document.createElement("td");
	td_btn.appendChild(del_btn);


	//初始化city节点
	var td_city = document.createElement('td');
	td_city.appendChild(document.createTextNode(key));

	//初始化value节点
	var td_value = document.createElement('td');
	td_value.appendChild(document.createTextNode(aqiData[key]));

	tr.appendChild(td_city);
	tr.appendChild(td_value);
	tr.appendChild(td_btn);

	aqi_tab.appendChild(tr);
	
	

}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
	addAqiData();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
	//找到tr节点
	var table = this.parentNode.parentNode.parentNode;
	var tr = this.parentNode.parentNode;
	table.removeChild(tr);   //删除节点
	
	//如果table没有数据删除th
	if (table.children.length === 1) {
		table.removeChild(table.firstChild);
	}
}

function init() {

	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	document.getElementById("add-btn").onclick = addBtnHandle;


}
init();
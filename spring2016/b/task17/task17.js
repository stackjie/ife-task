/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }

  return returnData;
}

function getObjectLenght(obj){
	var i=0;
	for(var key in obj){
		i++;
		
	}
	return i;
}

function setDataColor(value){

  if(value>=200 && value<300){
   return "#438eda";
  }else if(value>=300 && value<400){
   return "#dbdd38";
  }else if(value>=400){
    return "#ff4a32";
  }else{
    return "#7eec76";
  }
}


var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  "nowSelectCity":"北京",
  "nowGraTime":"日"
}

/**
 * 渲染图表
 */
function renderChart(chart_type) {
	var aqi_c = document.getElementById("aqi-chart-wrap");
  aqi_c.innerHTML = "";
  var chart_class = "";

  if (chart_type=='日') {
    chart_class = "aqi-c-day";
    
  }else if(chart_type=='周'){
		 chart_class = "aqi-c-week";
  }else if(chart_type=='月'){
    chart_class = "aqi-c-month";
   
  }
  
   for(var key in chartData){
      var data = document.createElement("div");
      data.className = chart_class;
      data.style.height = chartData[key]+"px";
      data.style.backgroundColor = setDataColor(chartData[key]);
      data.title = key + " " + Math.round(chartData[key]);
      aqi_c.appendChild(data); 
    }
	
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var now_date = this.value;
   if(now_date === pageState["nowGraTime"]) return;
   pageState["nowGraTime"] = now_date;

  // 设置对应数据
   initAqiChartData(pageState["nowSelectCity"],pageState["nowGraTime"]);
  // 调用图表渲染函数
  renderChart(now_date);
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var now_city = this.value;
  if(now_city === pageState["nowSelectCity"]) return;
  var now_date =  pageState["nowGraTime"];

  // 设置对应数据
  pageState["nowSelectCity"] = now_city;
  initAqiChartData(now_city,now_date);

  // 调用图表渲染函数
  renderChart(pageState["nowGraTime"]);
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var btns = document.getElementsByName('gra-time');
  for(var i in btns){
    btns[i].onclick = graTimeChange;
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var select = document.getElementById("city-select");
  for(var key in aqiSourceData){
    var option = document.createElement("option");
    option.innerHTML = key;
    select.appendChild(option);
    select.onchange = citySelectChange;
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData(city,date) {
  // 将原始的源数据处理成图表需要的数据格式
 	var aqi_temp = JSON.stringify(aqiSourceData[city]);
  	var aqi = JSON.parse(aqi_temp);
		chartData = new Object();
	var i=0;
  	if(date == "日"){
    chartData =  aqi;
		
	}else if(date == "周"){
		i=0; //重置i
		var 
		week_temp=0,
		week_now = 1,
		week_end = 0, //记录是否到最后一个
		week_total = getObjectLenght(aqi);
		
		
		for(key in aqi){
			i++;
			week_end++;
			week_temp += aqi[key];
			
			if(i===7 || week_end===week_total){
				chartData[week_now+"周"] = week_temp/7;
				week_now++;
				i=0; //重置i
				week_temp = 0; //重置temp_week
			}
			
		}
		console.log(chartData);
		
	}else if(date == "月"){
		
	var 
    m = "01",    //记录月
    now_m ="",  //当前月
    avg = 0;
    i=0; //重置i

    //初始化数值
    chartData={
      "01月":0,
      "02月":0,
      "03月":0
    };

		for(var key in aqi){
    
     now_m = key.substring(5,7);  //指定当前月
     i++; //记录一个月一共几天
     if(m === now_m){
      chartData[now_m+'月'] += aqi[key];
      
     }else{

      //当月份发生变化把上月的平均值计算出来
      
        avg = chartData[m+'月']/i;
      	chartData[m+'月'] = avg;
      	m = now_m;  //把记录月修改成当前月
      	i=1;  //重置i
      	chartData[now_m+'月'] += aqi[key];
     }
		}

    //求出最后一次平均数
    chartData['03月'] = chartData['03月']/i;


	}
  
}


/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData("北京","日");
  renderChart(pageState["nowGraTime"]);
}

init();
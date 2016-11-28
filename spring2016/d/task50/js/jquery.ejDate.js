/*!
 * ejDate 1.0.1 alpha
 * https://github.com/stackjie/ejDate.js
 * @license MIT licensed
 *
 * A project by StackJIE
 */

(function ($) {
    'use strict';

    $.fn.ejDate = function (cfg) {

        // 保存this
        var that = this;

        // 私有的属性
        var 
            // 保存jquery DOM对象的集合
            elems = {},

            // 当前时间对象
            nowDate = new Date(),

            // 当前的年
            nowYear = nowDate.getFullYear(),

            // 当前的月
            nowMonth = nowDate.getMonth() + 1,

            // 被选中的日期
            checkedDate,

            // 默认参数对象
            defaults = {
                yearULV: nowDate.getFullYear(),  // 年上限值
                yearDLV: 1970,  // 年下限值                           
            };

        // 将配置对象初始化覆盖默认参数对象的初始值
        if (typeof cfg !== 'undefined') {
            defaults.yearULV = cfg.yearULV || defaults.yearULV;
            defaults.yearDLV = cfg.yearDLV || defaults.yearDLV;
            defaults.disabledDateReg = cfg.disabledDateReg || defaults.disabledDateReg;  // 筛选禁用日期的正则表达式
            defaults.checkedDateFunc = cfg.checkedDateFunc || defaults.checkedDateFunc;  // 选日期后调用的回调方法
        }
       
        // 私有的方法
        var
            init = function () {
                
                // 生成dom节点
                elems.mainElem = $('<div class="ejdate-main">').html(
                    '<table><caption>\
                        <span class="btn-cut before-date"></span>\
                        <select class="select-year"></select>\
                        <select class="select-month"></select>\
                        <span class="btn-cut after-date"></span></caption>\
                        <thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>七</th></tr></thead>\
                        <tbody></tbody></table>'
                );

                // 将text表单用div元素包裹，以便使组件绝对定位
                that.wrap('<div class="ejdate-wrap">');

                that.after(elems.mainElem);

                // 获取将要操作的dom元素
                elems.targetInput = that;
                elems.selectYear = elems.mainElem.find('.select-year'),
                elems.selectMonth = elems.mainElem.find('.select-month'),
                elems.btnBefore = elems.mainElem.find('.before-date'),
                elems.btnAfterDate = elems.mainElem.find('.after-date'),
                elems.tbody = elems.mainElem.find('table tbody');

                // 将目标text表单设置为只读状态
                elems.targetInput.attr('readonly','readonly');

                // 渲染Select表单
                initRenderSelect();

                renderDate();

                // 初始化表单绑定事件
                elems.btnBefore.click(function(){
                    // 调用setNowDate函数并传入新的Date对象（当前月份-1）
                    setNowDate(new Date(nowYear,nowMonth - 1 - 1));
                    updateSelected();
                });

                 elems.btnAfterDate.click(function(){
                    // 调用setNowDate函数并传入新的Date对象（当前月份-1）
                    setNowDate(new Date(nowYear,nowMonth - 1 + 1));
                    updateSelected();
                });

                 // 绑定select的change事件
                elems.selectYear.change(function () {
                    setNowDate(new Date(this.value,nowMonth - 1));
                });

                elems.selectMonth.change(function () {
                    setNowDate(new Date(nowYear,this.value - 1));
                });

                // 日期选中事件委托
                elems.tbody.on('click','.day-normal',function(ev){

                    that.setDate(nowYear,nowMonth,$(this).html());

                    $(this).addClass('active');

                    // 将日期写入text表单
                    var dateStr = nowYear + '-' + nowMonth + '-' + $(this).html();
                    elems.targetInput.val(dateStr);

                    // 执行当用户选择日期后的回调处理函数
                    if (typeof defaults.checkedDateFunc === 'function') {
                        defaults.checkedDateFunc(checkedDate);
                    }

                    // 选择好日期后主体元素默认隐藏
                    elems.mainElem.hide();
                });

                // 点击目标表单显示，点击组件主体以外隐藏
                elems.targetInput.click(function(ev){
                    elems.mainElem.show();
                    ev.stopPropagation();
                });

                $(document).click(function(){
                    elems.mainElem.hide();
                });

                elems.mainElem.click(function(ev){
                    ev.stopPropagation();
                });

                // 主体元素默认隐藏
                elems.mainElem.hide();
            },

            // 初始化渲染Select表单
            initRenderSelect = function () {
                
                var option,i;
                // 循环输出年份option
                for(i = defaults.yearULV; i >= defaults.yearDLV; i--){

                    option = $('<option>' + i + '年</option>').val(i);

                    // 如果为当前年设置为选中状态
                    if(i === nowYear){
                        option[0].selected = true;
                    }

                    elems.selectYear.append(option);
                }

                // 循环输出月份option
                for(i = 1; i <= 12; i++){

                    option = $('<option>' + i + '月</option>').val(i);

                    // 如果为当前月设置为选中状态
                    if(i === nowMonth){
                        option[0].selected = true;
                    }

                    elems.selectMonth.append(option);
                }
            },

            // 渲染日期数据
            renderDate = function () {
                
                // 重置tbody
                elems.tbody.html('');

                var 
                    daysData = createDaysData(nowDate),
                    tr,td,i,j,dateText;

                // 初始化第一行tr
                tr = $('<tr></tr>');
                for (i = 0; i < daysData.length; i++) {

                    dateText = daysData[i].substring(daysData[i].indexOf('-') + 1);
                    td = $('<td></td>').html(dateText);
                    tr.append(td);

                    var isDimmed = daysData[i].indexOf('dimmed') !== -1;

                    // 添加class做不同日期的样式区分
                    if (isDimmed || isDisabledDate(dateText)) {
                        td.addClass('day-dimmed');
                    }else {
                        td.addClass('day-normal');
                    }

                    // 判断当前渲染的天数是不是被选中的天数
                    if (isCheckedDate(dateText) && !isDimmed) {
                        td.addClass('active');
                    }

                    // 如果当前循环到的日期能被7整除(一个星期)并且又不是最后一个日期就换行
                    if ( (i + 1) % 7 === 0) {
                        elems.tbody.append(tr);

                        // 只要不是最后一个日期就重置tr
                        if (i !== 41) {
                            tr = $('<tr></tr>');
                        }
                    }
                    
                }
 
            },

            // 设置当前时间对象并渲染
            setNowDate = function (parNowDate) {
                 
                 var tempYear = parNowDate.getFullYear();

                // 如果新传入的nowDate对象年份大于指定的上限值或小于指定的下限值该函数不执行
                if (tempYear > defaults.yearULV || tempYear < defaults.yearDLV) {
                    return false;
                }

                nowDate = parNowDate;
                nowYear = tempYear;
                nowMonth = nowDate.getMonth() + 1;

                // 调用渲染函数
                renderDate();
            },

            // 生成月份天数数据数组
            createDaysData = function (dateObj) {

                var
                    // 当月的天数
                    nowDays = getDays(nowYear,nowMonth),
                    
                    // 上个月的天数
                    lastDays = getDays(nowYear,nowMonth - 1),

                    // 保存这个月第一天是星期几
                    whatDay = new Date(nowYear,nowMonth - 1,1).getDay(),

                    // 保存上月末尾的天数总和
                    lastDaysEnd = 6 - (7 - whatDay),

                    // 生成的天数数据数组  
                    daysArray = [],

                    // 保存上个月末尾天数的起始天数
                    startLastDaysEnd = lastDays - lastDaysEnd,

                    i;


                // 产生上月末尾的天数
                // 日期数据格式  ['dimmed-28',dimmed-29,...,'normal-1','normal-2',...,'dimmed-1','dimmed-2']
                // 末尾会添加对应的标识以便渲染时应用不同的class样式区分
                // dimmed: 表示上月以及下月不可用的日期  normal: 当月的日期
                for (i = 0; i < lastDaysEnd; i++) {
                    daysArray[i] ='dimmed-' + (startLastDaysEnd + i + 1);
                }

                // 产生本月的天数
                for (i = 1; i <= nowDays; i++) {
                    daysArray.push('normal-' + i);
                }

                // 产生余下的下月天数
                for (i = 1; daysArray.length < 42; i++) {
                    daysArray.push('dimmed-' + i);
                }

                return daysArray;
                    
            },

            // 获取某个月共有几天
            getDays = function (year,month) {
                
                var days;
                // 当月份为二月时，根据闰年还是非闰年判断天数
                if (month === 2) {
                    days = year % 4 === 0 ? 29 : 28;

                } else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
                    // 月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
                    days = 31;
                }
                else {
                    // 其他月份，天数为：30.
                    days = 30;

                }

                return days;
            },

            // 更新Selec表单选中项
            updateSelected = function () {

                elems.selectYear.find('option').each(function(){
                    if($(this).text() == nowYear + '年'){
                        $(this)[0].selected = true;
                    }
                });

                elems.selectMonth.find('option').each(function(){
                    if($(this).text() == nowMonth + '月'){
                        $(this)[0].selected = true;
                    }
                });
            },

            // 判断日期是否被禁用
            isDisabledDate = function (day) {
                if (defaults.disabledDateReg) {
                    var dateStr = nowYear + 'y' + nowMonth + 'm' + day + 'd',flag;
                    flag = defaults.disabledDateReg.test(dateStr);
                    return flag;
                }

            },

            // 判断是否是被选中的日期
            isCheckedDate = function (day) {
            if (checkedDate) {
                var 
                    flagYear = checkedDate.getFullYear() === nowYear,
                    flagMonth = checkedDate.getMonth() + 1 === nowMonth,
                    flagDay = checkedDate.getDate() == day,
                    flag = flagYear && flagMonth && flagDay;
                
                return flag;
            }
        };

        // 对外提供的api
        $.extend(this, {
            
            /**
             * 获取选中的日期
             * @return {object}
             */
            getDate: function () {
                return checkedDate;
            },

            /**
             * 设置选中的日期
             * @param {int} parYear  年
             * @param {int} parMonth 月
             * @param {int} parDay   日
             */
            setDate: function (parYear,parMonth,parDay) {
                // 清空已被选中日期的选中样式
                elems.tbody.find('.active').removeClass('active');

                checkedDate = new Date(parYear,parMonth - 1,parDay);
            }
        });

        // 执行初始化函数
        init();

        return this;
    }

})(jQuery);
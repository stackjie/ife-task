(function (window, $, undefined) {
    'use strict';

    function DateSelect(tarElem,cfg) {

        // 目标表单元素
        this.tarElem = tarElem;

        this.elem;

        // 如果传入配置对象初始化配置
        if(cfg !== undefined){
            yearDLV = cfg.yearDLV || yearDLV;
            yearULV = cfg.yearULV || yearULV;
            disabledDateReg = cfg.disabledDateReg;
            checkedDateFunc = cfg.checkedDateFunc;
        }

        this.init();
    }

    // 私有的属性
    var
        // 实例化当前日期对象 
        nowDate = new Date(),

        // 获取当前的年份
        year = nowDate.getFullYear(),

        // 获取当前的月份
        month = nowDate.getMonth() + 1,

        // 定义这个月第一天是星期几
        whatDay,

        // 定义当月的天数
        days,

        // 年份上限值
        yearULV = year,

        // 年份下限值
        yearDLV = 1970,

        // 定义table元素
        table,

        // 定义table的tbody元素
        tbody,

        //年select表单
        selectYear,

        //月select表单
        selectMonth,

        //更新select
        updateSelect = function () {
            
            selectMonth.find('option').each(function(){
                if($(this).text() == month + '月'){
                    $(this)[0].selected = true;
                }
            });

            selectYear.find('option').each(function(){
                if($(this).text() == year + '年'){
                    $(this)[0].selected = true;
                }
            });
        },

        // 不可选日期以及筛选正则
        disabledDateReg,

        // 判断日期是否禁用的方法
        isDisabledDate = function (day) {

            // 如果没有筛选正则不执行
            if(disabledDateReg === undefined){
                return;
            }

            var 
                yearStr = year + '年',
                monthStr = month + '月',
                flagYear,flagMonth,flag;
            
            flagYear = disabledDateReg.test(yearStr);
            flagMonth = disabledDateReg.test(monthStr);
            if (flagYear && flagMonth) {
                flag = disabledDateReg.test(day);
            }else {
                flag = false;
            }

            //如果为true表示被禁用
            return flag;

        },
        
        // 保存被选中的日期
        checkedDate,

        isCheckedDate = function (day) {
            
            if (checkedDate) {
                
                var 
                    flagYear = checkedDate.getFullYear() === year,
                    flagMonth = checkedDate.getMonth() + 1 === month,
                    flagDay = checkedDate.getDate() == day,
                    flag = flagYear && flagMonth && flagDay;
                
                return flag;
            }
        },
        
        // 保存当用户选择日期后的回调处理函数
        checkedDateFunc;

    DateSelect.prototype = {
        constructor: DateSelect,

        init: function () {

            var dateWrap = $('<div class="date-wrap"></div>');

            // 初始化渲染dom节点
            this.elem = $('<div class="date-select"></div>').html(
                '<h2>选择日期</h2>\
                <table>\
                    <caption>\
                        <span class="date-before"></span>\
                        <select class="select-year"></select>\
                        <select class="select-month"></select>\
                        <span class="date-after"></span>\
                    </caption>\
                    <thead>\
                        <tr>\
                            <th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th>\
                        </tr>\
                    </thead>\
                    <tbody></tbody>\
                </table>'
            );
            
            this.tarElem.after(dateWrap);
            dateWrap.append(this.tarElem).append(this.elem);

            // 将目标text表单设置为只读状态
            this.tarElem.attr('readonly','readonly');

            // 获取table元素
            table = this.elem.find('table');

            // 获取tbody元素
            tbody = this.elem.find('table tbody');

            // 初始化表单
            var 
                //保存this
                that = this,

                i,option;

            selectYear = table.find('.select-year');

            selectMonth = table.find('.select-month');
            
            // 循环输出年份option
            for(i = yearULV; i >= yearDLV; i--){

                option = $('<option>' + i + '年</option>').val(i);

                // 如果为当前年设置为选中状态
                if(i === year){
                    option[0].selected = true;
                }

                selectYear.append(option);
            }

            // 循环输出月份option
            for(i = 1; i <= 12; i++){

                option = $('<option>' + i + '月</option>').val(i);

                // 如果为当前月设置为选中状态
                if(i === month){
                    option[0].selected = true;
                }

                selectMonth.append(option);
            }

            // 绑定日期往前往后按钮事件

            table.find('.date-before').click(function(){
                // 调用setNowDate函数并传入新的Date对象（当前月份-1）
                that.setNowDate(new Date(year,month - 1 - 1));
                updateSelect();
            });

            table.find('.date-after').click(function(){
                // 调用setNowDate函数并传入新的Date对象（当前月份-1）
                that.setNowDate(new Date(year,month - 1 + 1));
                updateSelect();
            });

            // 绑定select的change事件
            selectYear.change(function () {
                that.setNowDate(new Date(this.value,month - 1));
            });

            selectMonth.change(function () {
                that.setNowDate(new Date(year,this.value - 1));
            });

            //日期选中事件委托
            tbody.click(function(ev){

                var target =  ev.target;

                if (target.nodeName === 'TD' && target.className !== 'date-d' && target.className !== '') {
                    that.setCheckedDate(year,month,target.innerHTML,target);
                    that.elem.hide();

                    // 将日期写入text表单
                    var dateStr = year + '-' + month + '-' + target.innerHTML;
                    that.tarElem.val(dateStr);

                    // 执行当用户选择日期后的回调处理函数
                    if (typeof checkedDateFunc === 'function') {
                        checkedDateFunc();
                    }
                }

            });

            // 目标表单事件
            this.tarElem.click(function(ev){
                that.show();
                ev.stopPropagation();
            });

            $(document).click(function(){
                that.hide();
            });

           this.elem.click(function(ev){
               ev.stopPropagation();
            });

            // 调用渲染函数
            this.render();

        },

        setNowDate: function (parNowDate) {

            var tempYear = parNowDate.getFullYear();

            // 如果新传入的nowDate对象年份大于指定的上限值或小于指定的下限值该函数不执行
            if (tempYear > yearULV || tempYear < yearDLV) {
                return false;
            }

            nowDate = parNowDate;
            year = tempYear;
            month = nowDate.getMonth() + 1;

            // 调用渲染函数
            this.render();
        },

        setCheckedDate: function (parYear,parMonth,parDay,target) {

            // 清空已被选中日期的选中样式
            tbody.find('.active').removeClass('active');

            if (target) {
                target = $(target);
                target.addClass('active');
            }

            checkedDate = new Date(parYear,parMonth - 1,parDay);
        },

        getDate: function () {
            if (checkedDate !== undefined) {
                return checkedDate;
            } else {
                return false;
            }
        },

        render: function () {

            // 重置tbody
            tbody.html('');

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
           
            // 获取这个月的第一天是星期几
            nowDate.setDate(0);  //将当前时间对象设置为1号以方便获得这个月1号是星期几
            whatDay = nowDate.getDay() + 1;

            var tr,td,i,nowWeek,saveDay = 1,isDisabled,isChecked;

            //  渲染日期表格
            for (i = 1; i <= 5; i++) {
                // 渲染行
                tr = $('<tr></tr>');

                for (nowWeek = 1; nowWeek <= 7; nowWeek++) {
                    // 渲染单元格
                    td = $('<td></td>');
                    tr.append(td);
                    
                    // 判断这个月一号是星期几就从星期几开始输出日期，并且输出的日期不能大过这个月的天数
                    if((i === 1 && nowWeek < whatDay) || (saveDay > days)){
                        continue;  //不是输出日期起始星期或者大于这个月的天数就continue
                    }

                    // 输出日期 
                    td.html(saveDay);

                    // 添加Class
                    isDisabled = isDisabledDate(saveDay);  //判断当前日期是否被指定为禁用
                    isChecked = isCheckedDate(saveDay);  //判断当前日期是否被选中
                    if (isDisabled) {
                        td.addClass('date-d');
                    } else{
                        td.addClass('date-a');
                    }

                    if (isChecked) {
                        td.addClass('active');
                    }

                    saveDay++;
                    
                }
                table.append(tr);
            }
        },

        show: function () {
            this.elem.css('display','block');
        },

        hide: function () {
            this.elem.css('display','none');
        }


    }

    if (typeof window.DateSelect === 'undefined') {
        window.DateSelect = DateSelect;
    }
})(window, jQuery)
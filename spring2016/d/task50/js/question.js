/**
 * @file 问题组件模块
 * @author stackjie(wyj1997abc@gmail.com)
 */

define(function(require, exports, module) {
    'use strict';

    // 加载依赖模块
    var $ = require('jquery');
    var util = require('util');

    /**
     * 问题组件父类
     * 
     * @class
     */
    function Question($container, listData, type, data) {
        this.type = type;
        this.data = data;
        this.$container = $container; 
        this.listData = listData;

        this.initData();
        this.initBaseHTML();
        this.bindToolsEvents();
    }

    Question.prototype.initData = function () {
        // 如果data属性为空新建组件的数据而不是引用
        if (!this.data) {
            // 生成title字符串
            var title;
            switch (this.type) {
                case 'radio':
                    title = '单选题';
                    break;
                case 'checkbox':
                    titel = '多选题';
                    break;
                case 'text':
                    title = '文本题';
                    break;
            }

            var that = this;
            this.data = {
                type: that.type,
                title: title,
                options: that.type === 'text' ? 'null' : ['选项1','选项2']
            };

            // 添加进问题数据数组
            this.listData.push(this.data);

        }

    }

    Question.prototype.initBaseHTML = function () {
        // 获取数据在列表数组中的索引
        var index = this.listData.indexOf(this.data);

        var html = ''
        + '<li>'
        +   '<h4>Q' + (index + 1) + ' ' + this.data.title + '</h4>'
        +   '<div class="question-options"></div>'
        +   '<div class="question-tool">'
        +       '<span class="tool up">上移</span>'
        +       '<span class="tool down">下移</span>'
        +       '<span class="tool clone">复用</span>'
        +       '<span class="tool del">删除</span>'       
        +   '</div>'
        + '</li>';

        this.$wrap = $(html);
        this._$options = this.$wrap.find('.question-options');
        this._$tool = this.$wrap.find('.question-tool');

        this.$container.append(this.$wrap);

    };

    Question.prototype.bindToolsEvents = function () {
        var that = this;
        this._$tool.on('click', '.tool', function () {
            if ($(this).hasClass('up')) {
                that.tools('up');

            } else if ($(this).hasClass('down')) {
                that.tools('down');

            } else if ($(this).hasClass('clone')) {
                that.tools('clone');

            } else if ($(this).hasClass('del')) {
                that.tools('del');

            }

        })
           
    }

  

    Question.prototype.tools = function (toolName) {
        // 获取数据在列表数组中的索引
        var index = this.listData.indexOf(this.data);
        if (toolName === 'up') {
            if (index > 0) {
                var temp = this.listData[index - 1];

                this.listData[index - 1] = this.listData[index];
               
                this.listData[index] = temp;

                // 更改dom结构
                this.$wrap.insertBefore(this.$wrap.prev());
            }

        } else if (toolName === 'down') {
            if (index !== this.listData.length - 1) {
                var temp = this.listData[index + 1];
                console.log(index);
                this.listData[index + 1] = this.listData[index];

                this.listData[index] = temp;

                // 更改dom结构
                this.$wrap.insertAfter(this.$wrap.next());

            }

        } else if (toolName === 'clone') {
            // 深拷贝对象
            var cloneDataObj = {};
            $.extend(true, cloneDataObj, this.listData[index]);

            if (index !== this.listData.length - 1) {
                this.listData.splice(index + 1, 0, cloneDataObj);
                
            } else {
                this.listData[index + 1] = cloneDataObj;
                
            }

            var cloneComp = Question.create(this.$container, this.listData, this.type, cloneDataObj);
            cloneComp.$wrap.insertAfter(this.$wrap);

        } else if (toolName === 'del') {
            this.listData.splice(index, 1);

            // 更改dom结构
            this.$wrap.detach();
        }
        console.log(this.listData);
    }

    /**
     * 工厂方法
     * 
     * @param {string} type 需要生成的问题组件类型
     * @param {object=} data 现有的数据
     */
    Question.create = function ($container, listData, type, data) {
        var questionComp;
        switch (type) {
            case 'radio':
                questionComp = new QuestionRadio($container, listData, data);
                break;
            case 'checkbox':
                questionComp = new QuestionCheckBox($container, listData, data);
                break;
            case 'text':
                questionComp = new QuestionText($container, listData, data);
                break;
        }

        return questionComp;
    };
    
    // [
    //    {
    //        id: '1',
    //        data: [
    //            {
    //                 type: 'radio',
    //                 title: '单选题',
    //                 options: ['选项1','选项2']
    //            }
    //            ,
    //             {
    //                 type: 'radio',
    //                 title: '单选题',
    //                 options: ['选项1','选项2']
    //            }
    //        ]
    //    }
    // ]


     /**
     * 问题组件单选类
     * 
     * @class
     * @extends Question
     */
    function QuestionRadio($container, listData, data) {
        Question.call(this, $container, listData, 'radio', data);
        
        this.renderOptions();
        this.bindEvents();
    }

    util.extend(QuestionRadio, Question);

    QuestionRadio.prototype.addOption = function () {
        // 获取数据在列表数组中的索引
        var index = this.listData.indexOf(this.data);

        this.data.options.push( '选项' + ( this.data.options.length + 1) );

        // 更新数据
        this.listData[index] = this.data;

        this.renderOptions();
    };

    QuestionRadio.prototype.delOption = function (optionIndex) {
        // 获取数据在列表数组中的索引
        var index = this.listData.indexOf(this.data);

        this.data.options.splice(optionIndex, 1);

        // 更新数据
        this.listData[index] = this.data;

        this.renderOptions();
    };

    QuestionRadio.prototype.renderOptions = function () {
        // 清空元素
        this._$options.html('');
        
        var options = this.data.options;
        var html = '';
        for (var i = 0; i < options.length; i++) {
            html += ''
            + '<p class="question-option">'
            +   '<input type="' + this.data.type + '">' + options[i]
            +   '<span class="btn-del-option"></span>'
            + '</p>'
        }

        this._$options.html(html);
    }

    QuestionRadio.prototype.bindEvents = function () {
        var that = this;

        this._$options.on('click', '.btn-del-option', function() {
            var optionIndex =  that._$options.find('.btn-del-option').index($(this));
            that.delOption(optionIndex);

            that.renderOptions();

        });

        $('<div class="question-options-add">').click(function () {
            that.addOption();
        }).insertAfter(that._$options);
    }

    /**
     * 问题组件多选类
     * 
     * @class
     * @extends QuestionRadio
     */
    function QuestionCheckBox($container, listData, data) {
        Question.call(this, $container, listData, data);
        this.type = 'checkbox';
     
    }

    util.extend(QuestionCheckBox, QuestionRadio);

    /**
     * 问题组件单选类
     * 
     * @class
     * @extends Question
     */
    // function QuestionText(data) {

    // }

    // util.extend(QuestionText, Question);

    exports.create = Question.create;

});
/**
 * @file 问题组件模块
 * @author stackjie(wyj1997abc@gmail.com)
 */

define(function(require, exports, module) {
    'use strict';

    // 加载依赖模块
    var $ = require('jquery');

    // 继承方法封装
    function extend(child, parent) {
        var F = function(){};

        F.prototype = parent.prototype;

        child.prototype = new F();

        child.prototype.constructor = child;
　　}

    /**
     * 问题组件父类
     * 
     * @class
     */
    function Question() {

    }

    Question.prototype.init = function () {
        var html = ''
        + '<li>'
        +   '<div class="question-tool">'
        +       '<span class="up">上移</span>'
        +       '<span class="down">下移</span>'
        +       '<span class="copy">复用</span>'
        +       '<span class="del">删除</span>'       
        +   '</div>'
        + '</li>';

        $('question_list').append(html);
        
    }

    Question.prototype.tool = function (toolName) {
        switch (toolName) {
            case 'up':

                break;
            case 'down':
                break;
            case 'clone':
                break;
            case 'del':
                break;
        }
    }

    /**
     * 工厂方法
     * 
     * @param {string} type 需要生成的问题组件类型
     * @param {object=} data 现有的数据
     */
    Question.factory = function (type, data) {

    };

     /**
     * 问题组件单选类
     * 
     * @class
     * @extends Question
     */
    function QuestionRadio(data) {
        // 如果没传入数据对象将会生成一个新的数据对象
        this.data = data
        ? data 
        : {
            type: 'radio',
            options: ['选项1','选项2']
        };
 
    }

    extend(QuestionRadio, Question);

    QuestionRadio.prototype.addOption = function () {
        data.options.push('选项' + data.options.length + 1);

    };

    QuestionRadio.prototype.delOption = function (optionName) {
        var delIndex = data.options.indexOf(optionName);
        data.options.splice(delIndex, 1);
    };

    /**
     * 问题组件多选类
     * 
     * @class
     * @extends QuestionRadio
     */
    function QuestionCheckBox(data) {

    }

    extend(QuestionCheckBox, QuestionRadio);

    /**
     * 问题组件单选类
     * 
     * @class
     * @extends Question
     */
    function QuestionText(data) {

    }

    extend(QuestionText, Question);

});
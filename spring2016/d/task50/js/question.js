/**
 * 问题组件
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

        child.super = parent.prototype.constructor;

　　}


    /**
     * 问题父组件类
     */
    var Question = function (type, $target) {
        this.type = type;
        this._$target = $target;
        this.initBaseElem();
    };

    //  工厂方法
    Question.factory = function (type, $target) {
         if (type === 'radio') {
            return new QuestionRadio($target);
        } else if (type === 'checkbox') {
            return new QuestionCheck($target);
        } else if (type === 'text') {
            return new QuestionText($target);
        }
    }

    Question.prototype.initBaseElem = function () {
        this._$wrap = $('<div class="question-cont">');
        this._$tool = $('<div class="question-tool">').html('<span class="tool up">上移</span><span class="tool down">下移</span>'
        + '<span class="tool copy">复用</span><span class="tool del">删除</span>');

        this._$wrap.append(this._$tool);
        this._$target.prepend(this._$wrap);

        // 绑定工具栏的事件委托
        var that = this;
        this._$tool.on('click', '.tool', function () {
            if ($(this).hasClass('up')) {
                that.tool('up');
            } else if ($(this).hasClass('down')) {
                that.tool('down');
            } else if ($(this).hasClass('copy')) {
                that.tool('copy');
            } else if ($(this).hasClass('del')) {
                that.tool('del');
            }
        });
    }

    // Question.prototype.clone = function () {
    //     var obj = Question.factory(this.type, this._$target);
    //     $.extend(true, obj, this);
    // }

    Question.prototype.tool = function (name) {
        if (name === 'up') {
            this._$wrap.insertBefore(this._$wrap.prev);
        } else if (name === 'down') {
            this._$wrap.insertAfter(this._$wrap.next());
        } else if (name === 'copy') {
            this._$wrap.after(this._$wrap.clone(true));
        } else if (name === 'del') {
            this._$wrap.detach();
        }
    }

    /**
     * 单选问题组件类
     */
    var QuestionRadio = function ($target) {
        QuestionRadio.super.call(this, 'radio', $target);
        this.init();
    }

    extend(QuestionRadio, Question);

    Question.prototype.init = function () {
        // 初始化组件的dom元素
        this._$addItemElem = $('<div class="question-add-item">');
        this._$wrap.append('<p class="question-item"><label><input type="' + this.type + '">选项1</label><span class="btn-del-item"></span></p>'
        + '<p class="question-item"><label><input type="' + this.type + '">选项2</label><span class="btn-del-item"></span></p>');
        this._$wrap.append(this._$addItemElem);

        // 绑定事件
        var that = this
        this._$wrap.find('.question-add-item').click(function () {
            that.addItem();
        });

        this._$wrap.on('click', '.btn-del-item', function () {
            that.delItem($(this).parent());
        })
    }

    QuestionRadio.prototype.addItem = function () {
        var $item = $('<p class="question-item">');
        this._$addItemElem.before($item);

        var index = this._$target.find('.question-item').index($item) + 1;

        var $input = $('<label><input type="' + this.type + '">选项' + index + '</label><span class="btn-del-item"></span>');
        $item.append($input);

    }

    QuestionRadio.prototype.delItem = function ($parent) {
        console.log($parent);
        $parent.detach();
    }

    /**
     * 多选问题组件类
     */
    var QuestionCheckBox = function (type,$target) {
        QuestionCheckBox.super.call(this, 'radio', $target);
    }

    extend(QuestionCheckBox, QuestionRadio);

    /**
     * 文本问题组件类
     */
    var QuestionText = function (type,$target) {
        QuestionText.super.call(this, 'radio', $target);
    }

    extend(QuestionText, Question);

    
    exports.factory = Question.factory;
});
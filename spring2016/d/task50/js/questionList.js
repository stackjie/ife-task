/**
 * @file 问题列表组件模块
 * @author stackjie(wyj1997abc@gmail.com)
 */
define(function(require, exports, module) {
    'use strict'

    var $ = require('jquery');
    var question = require('question');
    var util = require('util');
    
    /**
     * 问题列表组件类
     * 
     * @class
     */
    function QuestionList() {
        this._questionListId = util.getQuestionListId(); 
        this._allData = util.getQuestionListAllData();
        this._listData = util.getQuestionListData(this._allData, this._questionListId);
        this._$listElem = $('#question_list');
        this._questions = [];
        this.init();
    }

    QuestionList.prototype.init = function () {
        
        var i,j;
        for (i = 0; i < this._listData.length; i++) {
           question.create(this._$listElem, this._listData, this._listData[i].type, this._listData[i]);
        }

        this.bindEvents();
    };

    QuestionList.prototype.bindEvents = function () {
        var that = this;
        $('#add_radio').click(function () {
            question.create(that._$listElem, that._listData, 'radio');
        });

        $('#add_checkbox').click(function () {
            question.create(that._$listElem, that._listData, 'checkbox');
        });


    }

    return QuestionList;
});




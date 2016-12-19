define(function(require, exports, module){
    'use strict'
    var $ = require('jquery');
    var util = require('util');
    var QuestionList = require('questionList');

    // 加载日期选择器
    require('ejDate');
    $('#text_date_closed').ejDate();

     
    var Question = require('question');

    var $wrap = $('.question-wrap');

    var list = new QuestionList();
});
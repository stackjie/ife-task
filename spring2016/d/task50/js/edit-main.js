define(function(require, exports, module){
    'use strict'
    var $ = require('jquery');
    var util = require('util');

    var Question = require('question');

    require('ejDate');
    $('#text_date_closed').ejDate();

    var $wrap = $('.question-wrap');

    var questionId = util.getQuestionId();
    if (questionId) {
        
    }

    $('#add_radio').click(function () {
        Question.factory('radio');
    })
});
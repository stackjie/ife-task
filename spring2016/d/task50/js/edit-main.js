define(function(require, exports, module){
    'use strict'
    var $ = require('jquery');

    var Question = require('question');

    require('ejDate');
    $('#text_date_closed').ejDate();

    var $wrap = $('.question-wrap');

    $('#add_radio').click(function () {
        Question.factory('radio', $wrap);
    })
});
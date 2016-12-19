define(function(require, exports, module){
    'use strict'

    function extend(child, parent) {
        var F = function(){};

        F.prototype = parent.prototype;

        child.prototype = new F();

        child.prototype.constructor = child;
　　}

    function storage(key,val) {
        try {
            var jsonVal;
            if (typeof val !== 'undefined') {
                jsonVal = JSON.stringify(val);
                return localStorage.setItem(key, jsonVal);
            } else {
                jsonVal = JSON.parse(localStorage.getItem(key));
                return jsonVal;
            }
            
        } catch(e) {
            alert('localStorage error!');
            console.log('localStorage error!' + e);
        }
        
    }

    function getQuestionListAllData() {
        var questionListAllData = storage('question_list');

        if (!questionListAllData) {
            questionListAllData = [];
            storage('question_list', '[]');
        }

        return questionListAllData;
    }

    function getQuestionListData(questionListAllData, questionListId) {
        var i,questionListData;
        for (i = 0; i < questionListAllData.length; i++) {
            if (questionListAllData[i].id ===  questionListId) {
                questionListData = questionListAllData[i];
            }
        }
        
        if (questionListAllData == [] || questionListData == null) {
            questionListData = {
                id: ('q' + Math.random()).replace('.','_') ,
                data: []
            }

            questionListAllData.push(questionListData);
            console.log(questionListAllData);
            storage('question_list', questionListAllData);
        }

        return questionListData;
    }

    function getQuestionListId() {
        var hash = window.location.hash;
        if ( hash.indexOf('questionListId_') !== -1 ) {
            return hash.substring(hash.indexOf('_') + 1); 
        }
    }

    exports.extend = extend;
    exports.storage = storage; 
    exports.getQuestionListAllData = getQuestionListAllData;
    exports.getQuestionListData = getQuestionListData;
    exports.getQuestionListId = getQuestionListId;
});
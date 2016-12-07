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
            if (typeof val !== 'undefined') {
                return localStorage.setItem(key, val);
            } else {
                return localStorage.getItem(key);
            }
            
        } catch(e) {
            alert('localStorage error!');
            console.log('localStorage error!' + e);
        }
        
    }

    function getQuestionId() {
        var hash = window.location.href.hash;
        if ( hash.indexOf('questionId_') !== -1 ) {
            return hash.substring(hash.indexOf('_') + 1); 
        }
    }

    exports.extend = extend;
    exports.storage = storage; 
});
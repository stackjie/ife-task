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

});
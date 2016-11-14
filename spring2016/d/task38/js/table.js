var Table = function (cfg) {
    this.cfg = cfg;

    this.theadData = cfg.thead;

    this.tbodyData = cfg.tbody;

    this.elemTbody;
}

Table.prototype = {
    constructor: Table,

    initTableNode: function () {

        // 生成表格dom对象
        var
            table = document.createElement('table'),
            thead = document.createElement('thead'),
            tbody = document.createElement('tbody'),
            tr, th, i, j, key;

        // 生成thead部分dom元素
        tr = document.createElement('tr');
        for (key in this.theadData) {
            // 生成th元素
            th = document.createElement('th');
            // 判断列是否启用排序
            if (this.theadData[key]) {
                // 生成排序按钮元素
                th.innerHTML = key + '<button class="asc">↑</button><button class="desc">↓</button>';

                // 用事件委托给排序按钮处理事件
                var that = this;
                th.onclick = function (ev) {
                    // 兼容写法
                    var ev = ev || window.event;
                    var target = ev.target || ev.srcElement;

                    // 获取列名
                    var colName = target.parentNode.firstChild.nodeValue;

                    //获取theadData列值
                    var colVal = that.getTheadDataColVal(colName);

                    // 如果有自定义排序函数,将该函数传入排序函数内
                    if (typeof colVal === 'function') var sortFunc = colVal;
                        
                    if (target.className === 'asc') that.sortTable(colName, 'asc', sortFunc);

                    if (target.className === 'desc') that.sortTable(colName, 'desc', sortFunc);

                }
            } else {
                th.innerHTML = key;
            }
            tr.appendChild(th);
        }
        thead.appendChild(tr);

        //生成tbody部分dom元素
        for (i = 0; i < this.tbodyData.length; i++) {
            tr = document.createElement('tr');
            for (j = 0; j < this.tbodyData[i].length; j++) {
                tr.innerHTML = tr.innerHTML + '<td>' + this.tbodyData[i][j] + '</td>';
                tbody.appendChild(tr);
            }
        }

        // 将tbody元素作为对象的属性保存
        this.elemTbody = tbody;

        table.className = 'table';
        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    },

    sortTable: function (colName, sortType, sortFunc) {
        // 将列名转换成数组的索引
        var key, colIndex = 0;
        for (key in this.theadData) {
            if (key === colName) break;
            colIndex++;
        }
        // 默认排序函数
        var defaultAsc = function (a, b) {
            if (a[colIndex] < b[colIndex]) return -1;
            if (a[colIndex] > b[colIndex]) return 1;
            return 0;
        }

        var defaultDesc = function (a, b) {
            if (a[colIndex] < b[colIndex]) return 1;
            if (a[colIndex] > b[colIndex]) return -1;
            return 0;
        }

        
        // 如果有自定义排序函数将默认排序函数覆盖
       if(sortFunc){
           var sortFuncObj = sortFunc(colIndex);
           defaultAsc = sortFuncObj.asc || defaultAsc;
           defaultDesc = sortFuncObj.desc || defaultDesc;
       }

        // 升序
        if (sortType === 'asc') {
            this.tbodyData.sort(defaultAsc);
        }

        // 降序
        if (sortType === 'desc') {
            this.tbodyData.sort(defaultDesc);
        }

        this.redraw();
    },

    getTheadDataColVal: function (colName) {
        for (var key in this.theadData) {
            if (key === colName) return this.theadData[key];
        }
    },

    redraw: function () {
        // 清空tbody
        this.elemTbody.innerHTML = '';

        // 重绘dom元素
        var i, j;
        for (i = 0; i < this.tbodyData.length; i++) {
            tr = document.createElement('tr');
            for (j = 0; j < this.tbodyData[i].length; j++) {
                tr.innerHTML = tr.innerHTML + '<td>' + this.tbodyData[i][j] + '</td>';
                this.elemTbody.appendChild(tr);
            }
        }
    }
}
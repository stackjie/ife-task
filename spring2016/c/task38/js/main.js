var data = {
    thead:{
        "姓名": function(colIndex) {
            return {
                asc: function(a,b){
                    if(a[colIndex] === '小亮') return -1;
                    if(a[colIndex] !== '小亮') return 1;
                    return 0;
                },
               
            };
        },
        "语文": true,
        "数学": true,
        "英语": true,
        "总分": true
    },
    tbody:[
        ["小明",80,90,70,240], 
        ["小红",90,60,90,240], 
        ["小亮",60,100,70,230] 
    ]
};
var table = new Table(data);
var tabNode = table.initTableNode();
document.getElementById('box').appendChild(tabNode);
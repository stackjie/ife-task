var data = [
    ['北京',['北京大学','清华大学']],
    ['上海',['上海大学','交通大学']]
];
var citySelect = document.getElementById('city');
var schoolSelect = document.getElementById('school');

document.getElementById('is_school_radio_group').onclick = function(ev){
    var radios = document.getElementsByName('is-school');
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement;

    var ischecked = target.checked;
    if (ischecked) {
        var schoolWrap = document.getElementById('school_wrap');
        var workWrap = document.getElementById('work_wrap');
        if (target.id === 'at_school') {
            schoolWrap.className = 'form-group';
            workWrap.className = 'form-group hidden';
        } else if (target.id === 'not_school') {
            workWrap.className = 'form-group';
            schoolWrap.className = 'form-group hidden';
        }
    }
    
}

function initSelect() {
    for(var i = 0;i < data.length;i++){
        citySelect.innerHTML =citySelect.innerHTML + '<option>'+data[i][0]+'</option>';
    }
    citySelect.onchange = changeSelect;
    changeSelect.call(citySelect);
   
}

function changeSelect(){
    var schoolData;
    for(var i = 0;i < data.length;i++){
        if(this.value === data[i][0]){
            schoolData = data[i][1];
            break;
        }
    }
    schoolSelect.innerHTML = '';
    for(i = 0;i < schoolData.length;i++){
        schoolSelect.innerHTML =schoolSelect.innerHTML + '<option>'+schoolData[i]+'</option>';
    }
}
initSelect();



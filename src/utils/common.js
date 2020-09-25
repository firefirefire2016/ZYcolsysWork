export function strToTime(str) {
    console.log(str);

    str = str.toString();

    if(str.includes('-')){
        return str;
    }

    var year = str.substring(0, 4);

    var month = str.substring(4, 6);

    var day = str.substring(6, 8);

    return year + '-' + month + '-' + day;
}



export function timeToStr(time) {
    console.log(time);
    return parseInt(time.replace(/-/g, ""));

}

export function getTodayStr(){
    var today = new Date();

    var year = today.getFullYear();

    var month = today.getMonth() + 1;

    var day = today.getDate();

    if(month < 10){
        month = '0' + month;
    }

    if(day < 10){
        day = '0' + day;
    }


    return year  + month +  day;
}

export function getTodayDateStr(){

    var today = new Date();

    var year = today.getFullYear();

    var month = today.getMonth() + 1;

    var day = today.getDate();

    if(month < 10){
        month = '0' + month;
    }

    if(day < 10){
        day = '0' + day;
    }

    console.log(year + '-' + month + '-' + day);

    return year + '-' + month + '-' + day;

}

/**
   * 使用test方法实现模糊查询
   * @param  {Array}  list     原数组
   * @param  {String} keyWord  查询的关键词
   * @return {Array}           查询的结果
   */
function fuzzyQuery(list, keyWord) {
    var reg = new RegExp(keyWord);
    var arr = [];
    for (var i = 0; i < list.length; i++) {
        if (reg.test(list[i])) {
            arr.push(list[i]);
        }
    }
    return arr;
}

export function rentMergeQuery(list, tenant, month_rent, isOwe, needInvoice) {

    // console.log('list:' + JSON.stringify(list) );
     console.log('keyWord:' + tenant);
    // console.log('month_rent:' + month_rent);
    // console.log('isOwe:' + isOwe);
    // console.log('needInvoice:' + needInvoice);

    var newlist = [];
    if (tenant || tenant === 0) {
        newlist = fuzzyQuery(list, tenant);
    }
    else {
        newlist = list;
    }

    console.log('newlist:' + JSON.stringify(newlist) );


    if (!month_rent) {
        month_rent = 0;
    }

    
    month_rent = parseFloat(month_rent);


    console.log('newlist = ' + JSON.stringify(newlist));

    var arr = [];

    if (typeof (isOwe) == "undefined" && typeof (needInvoice) == "undefined") {
        console.log('情况1');
        for (var i = 0; i < newlist.length; i++) {
            newlist[i].month_rent = parseFloat(newlist[i].month_rent);
            if (newlist[i].month_rent > month_rent) {
                arr.push(newlist[i]);
            }
        }
    }
    else if(typeof (isOwe) == "undefined"){
        console.log('情况2');
        for (var i = 0; i < newlist.length; i++) {
            if (newlist[i].month_rent > month_rent && newlist[i].needInvoice === needInvoice) {
                arr.push(newlist[i]);
            }
        }
    }
    else if(typeof (needInvoice) == "undefined"){
        console.log('情况3');
        for (var i = 0; i < newlist.length; i++) {
            if (newlist[i].month_rent > month_rent && newlist[i].isOwe === isOwe) {
                arr.push(newlist[i]);
            }
        }
    }
    else {
        console.log('情况4');
        for (var i = 0; i < newlist.length; i++) {
            if (newlist[i].month_rent > month_rent && newlist[i].isOwe === isOwe && newlist[i].needInvoice === needInvoice) {
                arr.push(newlist[i]);
            }
        }
    }

    console.log('arr = ' + JSON.stringify(arr));


    return arr;

}
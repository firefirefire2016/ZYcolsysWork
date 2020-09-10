export function strToTime (str) {
    var year = str.substring(0, 4);

    var month = str.substring(4, 6);

    var day = str.substring(6, 8);

    return year + '-' + month + '-' + day;
}

export function timeToStr(time){
   console.log(time);
   return  parseInt(time.replace(/-/g, ""));

}
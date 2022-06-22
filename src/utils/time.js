import Vue from 'vue'
import { getLanguage } from "./saveLanguage"
Vue.prototype.timeChange = function (form, time, type, hours = "24小时制") {
    if (!time || !type) return ""
    var language = getLanguage()
    if (type == 1) {
        type = "xxxx年xx月xx日";
        if (language == "en") {
            type = "xxxx(year)xx(month)xx(day)";
        }
    }
    hours = parseInt(hours);
    var arrOne = time.split(" ");
    var arrTwoTime = arrOne[0].split("-");
    var arrTwoHours = arrOne[1].split(":");
    var timeNow = ""
    if (form.date) {
        var year = "年";
        var month = "月";
        var day = "日";
        if (language == "en") {
            year = "(year)";
            month = "(month)";
            day = "(day)";
        }
        // console.log(type)
        timeNow = type.replace("xxxx", arrTwoTime[0])
            .replace("xx" + month, arrTwoTime[1] + month)
            .replace("/xx/", "/" + arrTwoTime[1] + "/")
            .replace("-xx-", "-" + arrTwoTime[1] + "-")
            .replace("xx" + day, arrTwoTime[2] + day)
            .replace("xx", arrTwoTime[2])
            .replace("(" + year + month + day + ")", "")
            .replace("(" + day + month + year + ")", "")
    }
    var hoursTime = ""
    if (form.time) {
        hoursTime = arrOne[1]
        if (hours == 12) {
            if (Number(arrTwoHours[0]) < 12) {
                var str = "上午 ";
                if (language == "en") {
                    str = "morning "
                }
                hoursTime = str + arrTwoHours.join(":")
            } else {
                arrTwoHours[0] = Number(arrTwoHours[0]) - 12;
                var str = "下午 ";
                if (language == "en") {
                    str = "afternoon "
                }
                hoursTime = str + arrTwoHours.join(":")
            }
        }
    }
    var week = "";
    var show_day = new Array('星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日')
    if (form.week) {
        week = show_day[new Date(time).getDay() - 1]
    }
    timeNow = timeNow + " " + hoursTime;//+  week +" "
    return timeNow
}


export function formatTime(time){
//将时间戳格式转换成年月日时分秒
let date = new Date(time);
let Y = date.getFullYear() + '-';
let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
let strDate = Y + M + D + h + m + s;
return strDate
}


//this.timeChange("2021-05-19 18:20:30", arr[0].value, "12小时制")
// var arr = [
//     {
//         value: "xxxx-xx-xx(年月日)",
//         label: "xxxx-xx-xx(年月日)",
//     },
//     {
//         value: "xx-xx-xxxx(日月年)",
//         label: "xx-xx-xxxx(日月年)",
//     },
//     {
//         value: "xxxx年xx月xx日",
//         label: "xxxx年xx月xx日",
//     },
//     {
//         value: "xx月xx日xxxx年",
//         label: "xx月xx日xxxx年",
//     },
//     {
//         value: "xx日xx月xxxx年",
//         label: "xx日xx月xxxx年",
//     },
//     {
//         value: "xxxx/xx/xx(年月日)",
//         label: "xxxx/xx/xx(年月日)",
//     },
//     {
//         value: "xx/xx/xxxx(日月年)",
//         label: "xx/xx/xxxx(日月年)",
//     },
// ]
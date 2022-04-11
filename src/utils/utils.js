Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
// 使用方法  new Date(this.datetime).format("yyyy-MM-dd hh:mm:ss"),
/**
 * 
 * @param {传入画框的实例用来控制箭头的方向} kuangFunArea 
 * @param {当前屏幕的宽度} width 
 * @param {当前屏幕的高度} height 
 * @param {后端传来的区域} data 
 * @param {是后端转前端用的数据还是前端数据转后端数据 show后端数据转前端用的} type 
 * @returns 转换展示的类型
 */
export function changeAreas(kuangFunArea, width, height, data, type) {
    if (type == "show") {
        var list = data.split("|");
        var listDataNow = [];
        for (var i = 0; i < list.length; i++) {
            var nowSmallList = list[i].split("-");
            var serviceData = [];
            if (nowSmallList[0] == 2 || nowSmallList[0] == 3) {
                for (var j = 1; j <= 2; j++) {
                    serviceData.push(
                        nowSmallList[j].split(",").map((item) => parseInt(item))
                    );
                }
            } else {
                for (var j = 1; j < nowSmallList.length; j++) {
                    serviceData.push(
                        nowSmallList[j].split(",").map((item) => parseInt(item))
                    );
                }
            }
            var modeType = "polygon";
            if (nowSmallList[0] == 0) modeType = "react";
            if (nowSmallList[0] == 2) {
                modeType = "line";
                kuangFunArea.chagneArrowDirection("+");
            }
            if (nowSmallList[0] == 3) {
                modeType = "line";
                kuangFunArea.chagneArrowDirection("-");
            }
            listDataNow[i] = {
                id: new Date().getTime() + i + "",
                modeType: modeType,
                serviceData: getFenbial(width, height, JSON.parse(JSON.stringify(serviceData)), "show"),
            };
        }
        return JSON.parse(JSON.stringify(listDataNow));
    } else {
        var str = "";
        data.forEach((element) => {
            if (element.serviceData && element.serviceData.length > 0) {
                if (element.modeType == "react") str += 0;
                if (element.modeType == "polygon") str += 1;
                if (element.modeType == "line")
                    str += kuangFunArea.lineLong >= 0 ? 2 : 3;
                if (!element.modeType) str += 0;
                str += "-";
                var serviceData = getFenbial(width, height, JSON.parse(JSON.stringify(element.serviceData)));
                str += serviceData.map((item) => item.join(",")).join("-") + "|";
                if (element.modeType == "line") {
                    var redict = kuangFunArea.linePoit;
                    redict = getFenbial(width, height, JSON.parse(JSON.stringify(redict)));
                    str = str.slice(0, str.length - 1);
                    str += "-" + redict.map((item) => item.join(",")).join("-");
                }
            }
        });
        return str.replace(/\|$/, "");
    }
}

export function getFenbial(width, height, data, type) {
    var changeXPx = 1920,
        changeYPx = 1080;
    if (type === "show") {
        //展示
        return data.map((item) => {
            return [
                parseFloat(((item[0] / changeXPx) * width).toFixed(2)),
                parseFloat(((item[1] / changeYPx) * height).toFixed(2)),
            ];
        });
    } else {
        //储存的时候
        var newData = data.map((item) => {
            return [
                parseFloat(((item[0] / width) * changeXPx).toFixed(2)),
                parseFloat(((item[1] / height) * changeYPx).toFixed(2)),
            ];
        });
        return newData;
    }
}
/**
 * 
 * @param {数据item.listData} data 
 * @param {宽度} width 
 * @param {高度} height 
 * @param {*} imgWidth 
 * @param {*} imgHeight 
 * @returns 返回根据当前显示的从1920 * 1080映射过来
 */
export function changeImge(data, width, height, imgWidth = 1920, imgHeight = 1080) {
    data = JSON.parse(JSON.stringify(data))
    for (let i = 0; i < data.length; i++) {
        var dataService = JSON.parse(data[i].serviceData);
        for (let j = 0; j < dataService.length; j++) {
            dataService[j][0] = (width / imgWidth) * dataService[j][0];
            dataService[j][1] = (height / imgHeight) * dataService[j][1];
        }
        data[i].serviceData = dataService;
    }
    return data;
}
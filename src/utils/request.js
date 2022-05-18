import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getToken } from './token.js' //process.env.VUE_APP_WSURL 
// var httpUrl = process.env.NODE_ENV == "dev" ? process.env.VUE_APP_URL : (window.location.origin + ":8183")
// var wsUrl = process.env.NODE_ENV == "dev" ? process.env.VUE_APP_WSURL : ("ws://" + window.location.host + ":8184")
var httpUrl = process.env.NODE_ENV == "dev" ? process.env.VUE_APP_URL : (window.location.origin)
var wsUrl = process.env.NODE_ENV == "dev" ? process.env.VUE_APP_WSURL : ("ws://" + window.location.host + "/ws")
var sshUrl = (process.env.NODE_ENV == "dev" ? "http://192.168.10.205" : window.location.origin) + ":8080"

var service = axios.create({
    baseURL: httpUrl
})
// 请求拦截将头部放入token
service.interceptors.request.use(
    config => {
        config.headers['Token'] = getToken();
        return config;
    },
    error => {
        console.log(error)
        return Promise.reject(error);
    }
)
var loginFlag = true
//响应拦截可以不用写
service.interceptors.response.use(
    response => {
        var res = response.data;
        if (res.code != 0) {//测试图片的时候用的以前的接口所以这地方暂时注释了以下
            if (res.code == -5) {
                if (loginFlag) {
                    Message({
                        message: "请重新登录",
                        type: 'error',
                        duration: 1500
                    })
                    loginFlag = false;
                    setTimeout(() => {
                        loginFlag = true;
                    }, 3000)
                }
            } else if (res.code == -1 || res.code == -2) {
                Message({
                    message: "账号或密码错误",
                    type: 'error',
                    duration: 1500
                })
            } else if (res.code == -3) {
                Message({
                    message: "保存失败",
                    type: 'error',
                    duration: 1500
                })
            } else if (res.code == -4) {
                Message({
                    message: "内容过大/暂无报警信息，请重新选择条件下载",
                    type: 'error',
                    duration: 1500
                })
            } else if (res.code == -6) {
                Message({
                    message: "通道数量已超限",
                    type: 'error',
                    duration: 1500
                })
            } else if (res.code == 4001) {
                Message({
                    message: "照片质量有问题",
                    type: 'error',
                    duration: 1500
                })
            } else {
                Message({
                    message: (res.msg ? res.msg : "未知错误！"),
                    type: 'error',
                    duration: 1500
                })
            }
            if (process.env.NODE_ENV != "dev") {
                if (res.code == -5) {
                    router.push("/");
                }
            }
        }

        return res;
    },
    error => {
        if (error && error.config.url != "/api/web/downloadAlarmHisReady") {
            Message({
                message: '请检查网络！',
                type: 'error',
                duration: 1500,
            })
            if (process.env.NODE_ENV != "dev") {
                store.dispatch("LogOut").then((res) => {
                    router.push("/");
                });
                // store.dispatch("clearTimer");
            }
        }
        return Promise.reject(error);
    }
)
var wspath = ""
var arrCode = [1005, 1000]//白名单只要是这里面的code   ws就不会进行重连
service.ws = function (path, callback, data) {
    wspath = wsUrl + path;
    var ws = new WebSocket(wspath);
    ws.onopen = function () {
        data && Object.keys(data).length > 0 && ws.send(JSON.stringify(data))
    };
    ws.onmessage = function (e) {
        callback(JSON.parse(e.data))
    };
    ws.onclose = function (e) {
        if (!arrCode.includes(e.code)) {//1005是正常关闭不用重新链接其他都要进行重新链接
            ws = reconnect(wspath, callback, data, ws)
        }
    }
    return ws
}
function reconnect(url, callback, data, ws) {
    setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        ws = new WebSocket(url);
        ws.onopen = function () {
            data && Object.keys(data).length > 0 && ws.send(JSON.stringify(data))
        };
        ws.onmessage = function (e) {
            callback(JSON.parse(e.data))
        };
        ws.onclose = function (e) {
            if (!arrCode.includes(e.code)) {
                reconnect(url, callback, data, ws)
            }
        };
        return ws
    }, 2000);
}
service.file = function (url, data) {
    return new Promise((resolve, reject) => {
        var formData = new FormData()
        for (let key in data) {
            formData.append(key, data[key])
        }
        axios({
            url: httpUrl + url,
            method: "post",
            header: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
            data: formData
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
service.downloadFile = function (url) {
    if ("download" in document.createElement("a")) {
        const elink = document.createElement("a");
        elink.style.display = "none";
        elink.download = "alarm.tar.gz";
        elink.href = httpUrl + url;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
    } else {
        // IE10+下载
        navigator.msSaveBlob(blob, name);
    }

}
service.sshUrl = sshUrl
export default service;
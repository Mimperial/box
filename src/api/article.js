import axios from "@/utils/request"
import { greenroom } from "@/utils/langeChangeArithmetic"
// import md5 from "md5"
// import { getToken } from '@/utils/token.js'
// var bause = "http://192.168.10.251:8183"
// var bause = "http://192.168.10.193:8183"
// var bause = "http://192.168.10.230:8183"
// var bause = "http://192.168.10.167:8183"
// var bause="http://192.168.10.232:8183"
// var bause = ""
var objFc = (cmd, data) => {//发送格式都是这样发送的
    return JSON.stringify({
        "MessageId": "",
        "Cmd": cmd,
        "Time": new Date().toLocaleString(),
        "ParamsJson": JSON.stringify(data)
    })
}


//-------------------------------------------------------------------------登录账户模块-------------------------------------------------------------------------

export function loginApi(data) {  //登录通过vuex管理-------------------
    return axios.post('/api/web/login', data)
}
export function getRolesApi(data) {//获取权限
    return axios.post('/api/web/userRole', data)
}
export function editPasswordApi(data) {//修改密码
    return axios.post('/api/web/editPassword', data)
}

//-------------------------------------------------------------------------系统-------------------------------------------------------------------------


export function setDevInfoApi(data) {//系统-系统设置-基本信息-设置
    return axios.post('/api/web/setDevInfo', data)
}
export function getDevInfoApi(data) {//系统-系统设置-基本信息-获取
    return axios.post('/api/web/getDevInfo', data)
}


export function setDatetimeApi(data) {//系统-系统设置-时间配置-设置
    return axios.post('/api/web/setDatetime', data)
}
export function getDatetimeApi(data) {//系统-系统设置-时间配置-获取
    return axios.post('/api/web/getDatetime', data)
}

export function setStationConfigApi(data) {//系统-系统设置-站点信息-设置
    return axios.post('/api/web/setStationConfig', data)
}
export function getStationConfigApi(data) {//系统-系统设置-站点信息-获取
    return axios.post('/api/web/getStationConfig', data)
}

export function setSentreServerApi(data) {//系统-系统设置-中心服务-设置(对接完成)
    return axios.post('/api/web/setCentreServer', data)
}
export function getSentreServerApi(data) {//系统-系统设置-中心服务-获取（对接完成）
    return axios.post('/api/web/getCentreServer', data)
}


export function rebootApi(data) {//系统-系统维护-重启
    return axios.post('/api/web/reboot', data)
}
export function recoveryApi(data) {//系统-系统维护-恢复
    return axios.post('/api/web/recovery', data)
}
export function uploadApi(data) {//系统-系统维护-文件上传
    return axios.file('/api/web/upload', data)
}

export function upgradeApi(data) {//系统-系统维护-升级
    return axios.post('/api/web/upgradeServer', data)
}

//-------------------------------------------------------------------------网络-------------------------------------------------------------------------

export function setNetCardInfoApi(data) {//网卡信息-设置
    return axios.post('/api/web/setNetCardInfo', data)
}
export function getNetCardInfoApi(data) {//网卡信息-获取
    return axios.post('/api/web/getNetCardInfo', data)
}
export function testIpApi(data) {//IP 测试
    return axios.post('/api/web/testIp', data)
}

export function setFtpInfoApi(data) {// FTP 配置-设置
    return axios.post('/api/web/setFtpInfo', data)
}
export function getFtpInfoApi(data) {// FTP 配置-获取
    return axios.post('/api/web/getFtpInfo', data)
}

export function testFtpApi(data) {//FTP 测试
    return axios.post('/api/web/testFtp', data)
}
export function setIntegrateCfgApi(data) {//协议接入-设置
    return axios.post('/api/web/setIntegrateCfg', data)
}
export function getIntegrateCfgApi(data) {// 协议接入-获取
    return axios.post('/api/web/getIntegrateCfg', data)
}

export function setHttpPushApi(data) {//第三方平台-设置
    return axios.post('/api/web/setHttpPush', data)
}
export function getHttpPushApi(data) {// 第三方平台-获取
    return axios.post('/api/web/getHttpPush', data)
}

//------------------------------------储存------------------------------------------------

export function setDiskInfoApi(data) {//磁盘配置-设置
    return axios.post('/api/web/setDiskInfo', data)
}
export function getDiskInfoApi(data) {// 磁盘配置-获取
    return axios.post('/api/web/getDiskInfo', data)
}

//------------------------------------相机------------------------------------------------
export function addCameraApi(data) {//添加相机
    let { ip, port, name, url, remark, deviceType, userName, pwd, videoW = 1920, videoH = 1080 } = data;
    // let status="1231",ImageUrl="12213",IsDelete=0,EditFlag=0,PlayUrl="1233",InsType=2;
    return axios.post('/api/web/cameraAdd', { deviceIp: ip, devicePort: port, name, url, remark, deviceType, userName, pwd, videoW, videoH })// ,status,ImageUrl,IsDelete,EditFlag,PlayUrl,InsType
}
export function editCameraApi(data) {// 修改相机
    let { ip, port, id, name, url, remark, deviceType, videoW = 1920, videoH = 1080, channelId, userName, pwd, RuleId } = data;
    return axios.post('/api/web/cameraUpdate', { deviceIp: ip, devicePort: port, id, name, url, remark, deviceType, videoW, videoH, channelId, userName, pwd, RuleId })//{id,name,url,remark,videoW,videoH}
}
export function delCameraApi(data) {// 删除相机
    let { id, channelId } = data;
    return axios.post('/api/web/cameraDelete', { id, channelId })
}
export function getCameraApi(data) {// 获取相机
    let { id = "", name = "", url = "" } = data;
    return axios.post('/api/web/cameraAll', { id, name, url })
}

// export function qryOnvifCamApi(data) {// onvif 搜索
//     return axios.post(bause + '/api/web/qryOnvifCam', objFc("qryOnvifCam", data))
// }
// export function addOnvifCamApi(data) {// 添加 onvif 相机
//     return axios.post(bause + '/api/web/addOnvifCam', objFc("addOnvifCam", data))
// }
//------------------------------------图像------------------------------------------------


export function getOsdInfoApi(data) {//OSD 参数-获取
    let { id } = data;
    return axios.post('/api/web/getOsdConfig', { id })
}
export function setOsdInfoApi(data) {// OSD 参数-设置
    let { id, osdConfig } = data;
    return axios.post('/api/web/setOsdConfig', { id, osdConfig })
}

//------------------------------------算法管理------------------------------------------------

export function getAlgorithmApi(data) {//算法-获取(这里新接口对接完成)
    let { id } = data;
    return axios.post('/api/web/getAlgInfo', { id })
}
export function setAlgorithmApi(data) {//算法-设置(这里新接口对接完成)
    let { id, AlgInfos } = data;
    return axios.post('/api/web/setAlgInfo', { id: id, algInfos: AlgInfos})
}

export function getAlgorithmListApi(data) {  //获取算法列表(这里新接口对接完成)-------------------
    let { id = "", name = "", path = "" } = data;
    // 
    return new Promise((resolve, reject) => {
        axios.post('/api/web/getAlgorithm', { id, name, path }).then(res => {
            if (res.code == 0) {
                res.data = greenroom(res.data)
            }
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function addAlgorithmApi(data) {  //添加算法列表(这里新接口对接完成)-------------------
    let { name, path, alarmNumber, inputConfig, Canuse, Utools, MusicAddr, MusicStatus } = data
    return axios.post('/api/web/addAlgorithm', { name, path, alarmNumber, Canuse, Utools, MusicAddr, MusicStatus, inputConfig: JSON.stringify(inputConfig) })
}
export function setAlgorithmListApi(data) {  //修改算法列表(这里新接口对接完成)-------------------
    let { id, name, path, alarmNumber, Canuse, Utools, inputConfig, MusicAddr, MusicStatus } = data
    return axios.post('/api/web/setAlgorithm', { id, name, path, alarmNumber, Canuse, Utools, MusicAddr, MusicStatus, inputConfig: JSON.stringify(inputConfig) })
}
export function deleteAlgorithmApi(data) {  //删除算法列表(这里新接口对接完成)-------------------
    let { id } = data;
    return axios.post('/api/web/deleteAlgorithm', { id })
}
// ------------------------------------------------------------权限配置------------------------------------------------------------

//-------------------------------------------------------------------------用户（这里新接口对接完成）-------------------------------------------------------------------------
export function userAllApi(data) {  //获取所有的用户-------------------
    let { id = "", userName = "" } = data;
    return axios.post('/api/web/userAll', { id, userName })
}
export function userAddApi(data) {  //添加用户-------------------
    let { userName = "", pwd = "", createTime = new Date().format("yyyy-MM-dd hh:mm:ss"), rolerList = "" } = data;
    return axios.post('/api/web/userAdd', { userName, pwd, createTime, rolerList })
}
export function userUpdateApi(data) {  //修改用户的信息-------------------
    let { id = "", pwd = "", createTime = new Date().format("yyyy-MM-dd hh:mm:ss"), rolerList = "" } = data;
    return axios.post('/api/web/userUpdate', { id, pwd, createTime, rolerList })
}
export function userDeleteApi(data) {  //删除用户-------------------
    let { id } = data;
    return axios.post('/api/web/userDelete', { id })
}



//-------------------------------------------------------------------------日志-------------------------------------------------------------------------
export function modelOptionsApi(data) {//模块下拉
    return axios.post('/api/web/modelOptions', objFc("modelOptions", data))
}
export function historyLogApi(data) {//历史日志
    return axios.post('/api/web/qryLog', data)
}
export function sshUrl() {//返回sshurl的链接
    return axios.sshUrl
}


// ------------------------------------------------------------报警数据------------------------------------------------------------


export function getAlarmHisApi(data) {//获取报警数据
    let { cameraId, startTime, endTime, alarmType, curPage, pageNum } = data
    return axios.post('/api/web/getAlarmHis', { cameraId, startTime, endTime, alarmType, curPage: String(curPage), pageNum: String(pageNum) })
}
export function downloadAlarmHisApi(data) {//下载
    let { cameraId, startTime, endTime, alarmType, download, userId = "" } = data
    return axios.post('/api/web/downloadAlarmHis', { cameraId, startTime, endTime, alarmType, download, userId })
}
export function deleteAlarmHisApi(userId) {//删除
    return axios.post('/api/web/deleteAlarmHis', { userId })
}
export function downloadAlarmHisReadyApi(data) {//轮询
    let { userId = "sdfsd" } = data
    return axios.post('/api/web/downloadAlarmHisReady', { userId })
}
export function downloadFileApi(url) {//下载nginx中的文件
    return axios.downloadFile(url)
}



// ------------------------------------------------------------大屏接口------------------------------------------------------------
export function getAlarmInfoCountApi(data) {//获取今日报警数据和本月top排名
    let { TimeType = "day" } = data
    return new Promise((resolve, reject) => {
        axios.post('/api/web/getAlarmInfoCount', { TimeType }).then(res => {
            if (res.code == 0) {
                res.data = greenroom(res.data)
            }
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
    // return axios.post('/api/web/getAlarmInfoCount', { TimeType })
}
export function getAlarmCountApi(data) {//获取七日内统计数据
    let { TimeType = "week" } = data
    return axios.post('/api/web/getAlarmCount', { TimeType })
}


// ------------------------------------------------------------引擎配置------------------------------------------------------------


export function getEngineGetApi() {//获取引擎信息
    return axios.post('/api/web/getAlgorithmConfig', {})
}
export function getEngineUpdateApi(data) {//修改引擎信息
    let { id, engineData } = data
    return axios.post('/api/web/setAlgorithmConfig', { id, value: engineData })
}




//-------------------------------------------------------------------------websocket发送ws-------------------------------------------------------------------------
export function wsPreview(callback, data) {//预览websocket
    return axios.ws("/ws", callback, data)//返回的就是一个ws对象可以进行操作
}
export function wsCpu(callback, data) {//cpu  websocket  系统中的系统设置中
    return axios.ws("/ws", callback, data)//返回的就是一个ws对象可以进行操作记得页面销毁的时候要注销ws
}
export function wsLog(callback, data) {//发送日志
    return axios.ws("/ws", callback, data)//返回的就是一个ws对象可以进行操作记得页面销毁的时候要注销ws
}



export function wschonglian(callback) {
    return axios.ws("", callback)
}

// ------------------------------------------------------------规则设置------------------------------------------------------------
/**
 * 获取规则
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getRule(data){
    let { RuleId } = data
    return axios.post('/api/web/getRules', { RuleId })
}

/**
 * 新增规则
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export function addRules(data){
    return axios.post('/api/web/addRule', data)
}

/**
 * 修改规则
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export function editRules(data) {
    return axios.post('/api/web/editRule', data)
}

/**
 * 删除规则
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export function deleteRules(data){
    return axios.post('/api/web/deleteRule', data)
}
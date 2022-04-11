//js拼接flv格式
export function flvJoin(val){
    var ip = process.env.VUE_APP_URL.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g)[0]
    return `ws://${process.env.NODE_ENV == "dev" ? (ip + ":80") : (window.location.host)}/live/${val.channelId?val.channelId:val.id}.flv`
    // return `http://${process.env.NODE_ENV == "dev" ? (ip + ":81") : (window.location.host + ":81")}/live/${val.channelId?val.channelId:val.id}.flv`
}
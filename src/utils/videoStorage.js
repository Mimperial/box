var str = "videoStorage"//本文件是用来缓存预览中的视频
export function setVideoStorage(data){
    sessionStorage.setItem(str,data)
}
export function getVideoStorage(){
    return sessionStorage.getItem(str)
}
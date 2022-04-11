var tokenName = "nxBox"
var userName = "nxUser"
var downloadId = "downloadId"

window.addEventListener('message', function (messageEvent) {
    var data = messageEvent.data;
    if (data && typeof data === "object" && data.type === 'token' && data.data) {
        setToken(data.data)
        window.parent.postMessage("success", "*")
    }
});
export function setToken(data) {
    sessionStorage.setItem(tokenName, data)
}
export function getToken() {
    return sessionStorage.getItem(tokenName)
}
export function removeToken() {
    sessionStorage.removeItem(tokenName)
}

export function setUserToken(data) {
    sessionStorage.setItem(userName, data)
}
export function getUserToken() {
    return sessionStorage.getItem(userName)
}
export function removeUserToken() {
    sessionStorage.removeItem(userName)
}


export function setDownloadIdToken(data) {
    sessionStorage.setItem(downloadId, data)
}
export function getDownloadIdToken() {
    return sessionStorage.getItem(downloadId) || ""
}
export function removeDownloadIdToken() {
    sessionStorage.removeItem(downloadId)
}
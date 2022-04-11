var language = "language"
export function setLanguage(data){
    sessionStorage.setItem(language,data)
}
export function getLanguage(){
    return sessionStorage.getItem(language)
}
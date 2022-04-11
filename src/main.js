import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//0是矩形1是多边形2是线箭头正方向3是箭头反方向（这个规则在时间里面就能看到event这个）
import { getLanguage } from "@/utils/saveLanguage";
// import 'babel-polyfill'
/**
 * 这里有好多地方他没有办法统一语言包所以只能这样
 * 登录的地方记得有一个session本地存储切换语言的时候要进行切换
 * 要在views\config\event\lib中timeweek.js也加入语言的判断
 * 添加语言包的时候要把elemenui中的语言包加入
 * 要改utils中time.js文件
 * 要加入lang文件夹中加入语言包
 * 在i18n中加入语言包
 * 要在utils中langeChangeArithmetic.js导入语言包
 */
import enLocale from 'element-ui/lib/locale/lang/en';//引入elementui英文包
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';//引入elementui中文包
var lang = getLanguage() || 'zh'
var locale = lang == "en"?enLocale:zhLocale;
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { locale });
import "./assets/font/iconfont.css"


import VueI18n from 'vue-i18n'//中英文切换
Vue.use(VueI18n)

import zh from "@/lang/zh-CN.js";//中文包
import en from "@/lang/en.js"//英文包

const i18n = new VueI18n({
  locale: lang,  // 语言标识
  messages: {
    'zh': zh,
    'en': en
  },
  silentTranslationWarn: true
})

import "./utils/utils"//添加工具用来转换时间
import "./utils/routerProto"//路由守卫控制权限

import "./utils/directives.js"//定义指令

import "./utils/time"//时间转换用得里面有应用得方法
Vue.config.productionTip = false
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')


//路由拦截权限管理
import router from '@/router'
import store from '@/store'
let handleRoutes = ''
router.beforeEach(async (to, from, next) => {
    console.log('to',to);
    // 1.判断是否登陆界面
    if (to.path == '/login' || to.path == '/bigScreen') {
        if (to.path == '/login') {
            store.dispatch("LogOut").then((res) => {
                next();
            });
        } else {
            next();
        }
    } else {
        if (!store.getters.token) {
            next({ path: "/login" })
        }
        //进入其他页面进行判断
        // 1.判断角色是否有（如果获取角色失败）
        var hasRoles = store && store.getters.roles && store.getters.roles.length > 0;
        if (hasRoles) {
            console.log(router);
            if(to.path == "/home/alarmData/intelligenceShow"){
                next(handleRoutes)
            }
            next();
        } else {
            //发送请求获取对应的角色信息
            try {
                var roles = await store.dispatch('GetInfo');
                let rolesName = roles.roles;//得到角色
                var accessRoutes = await store.dispatch('GenerateRoutes', rolesName);//角色过滤
                let Alarmroutes = ''
                if(accessRoutes[0].children.length>=3){
                    Alarmroutes = accessRoutes[0].children[1].children[0].children
                    if(Alarmroutes&&Alarmroutes.length>0){
                        handleRoutes=  Alarmroutes[0]
                    }
                }
                // router.addRoute(accessRoutes[0])
                router.addRoutes(accessRoutes)
                if (to.path == "/home") {//判断如果是home就跳转第一个页面
                    next({ path: accessRoutes[0].path + '/' + accessRoutes[0].children[0].path });
                } else {
                    next({ ...to })
                }
            } catch (error) {
                console.log(error)
                next({ path: '/login' });
            }
        }
    }
})
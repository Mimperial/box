import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from "@/layout"
Vue.use(VueRouter)
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export const constantRouters = [//常规路由配置，不管什么权限进入显示的路由
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login.vue')
  },
  {
    path: '/bigScreen',
    name: 'bigScreen',
    component: () => import('../views/bigScreen/bigScreen.vue')
  },
]
export const asyncRouters = [//异步路由，也就是根据权限变化的路由      这个里利用了浅拷贝改变动态路由，要是用这里的就会出现路由不全的问题
  // 这里添加完你要记得在rolesConfig中的roleAll.js中也添加不然权限管理会出现问题，因为后台不能返回给我们全部的权限所以多写了个文件夹
  {
    path: '/home',
    component: layout,
    redirect: '/home/config',
    children: [
      //   {
      //   path: 'preview',
      //   name: 'preview',
      //   meta: {
      //     title: '预览',
      //     icon: 'el-icon-s-tools',
      //     roles: 0
      //   },
      //   component: () => import('@/views/preview/preview.vue'),
      // }, 
      {
        path: 'config',
        name: 'config',
        meta: {
          title: '配置',
          icon: 'el-icon-s-tools',
          roles: 1
        },
        component: () => import('@/views/config/config.vue'),
        redirect: '/home/config/system/systemSetting',
        children: [
          {
            path: 'system',
            name: 'system',
            meta: {
              title: '系统',
              icon: 'el-icon-s-tools',
              roles: "1-1"
            },
            component: () => import('@/views/config/system'),
            children: [
              {
                path: 'systemSetting',
                name: 'systemSetting',
                meta: {
                  title: '基本信息',
                  icon: 'el-icon-s-tools',
                  roles: "1-1-1",
                  // buttonRoles: [
                  //   { roles: "BaseInfo", name: "基本信息" },
                  //   { roles: "TimeConfig", name: "时间配置" },
                  //   { roles: "SiteInfo", name: "站点信息" },
                  //   { roles: "CentralServices", name: "中心服务" }
                  // ]
                },
                component: () => import('@/views/config/system/systemSetting.vue'),
              },
              {
                path: 'systemMaintenance',
                name: 'systemMaintenance',
                meta: {
                  title: '系统设置',
                  icon: 'el-icon-s-cooperation',
                  roles: "1-1-2",
                  buttonRoles: [
                    { roles: "Protect", name: "系统维护" },
                    { roles: "TimeConfig", name: "时间配置" },
                    { roles: "UseManagement", name: "修改密码" },
                    { roles: "EquipmentSerial", name: "设备编号" },
                    { roles: "SiteInfo", name: "设备编号" }
                  ]
                },
                component: () => import('@/views/config/system/systemMaintenance.vue'),
              },
              {
                path: 'advancedConfig',
                name: 'advancedConfig',
                meta: {
                  title: '高级设置',
                  icon: "el-icon-document-copy",
                  roles: "1-1-3",
                  buttonRoles: [
                    { roles: "Ftp", name: "FTP" },
                    { roles: "PlatformConfig", name: "协议接入" },
                    { roles: "AuthorizationConfig", name: "第三方平台" },
                    { roles: "CentralServices", name: "中心服务" },
                  ]
                },
                component: () => import('@/views/config/system/advancedConfig.vue'),
              },
              {
                path: 'basicConfig',
                name: 'basicConfig',
                meta: {
                  title: '网络设置',
                  icon: "el-icon-tickets",
                  roles: "1-2-1",
                  buttonRoles: [
                    { roles: "Tcp0", name: "网卡1" },
                    { roles: "Tcp1", name: "网卡2" },
                  ]
                },
                component: () => import('@/views/config/system/basicConfig.vue'),
              },
            ]
          },
          // {
          //   path: 'storage',
          //   name: 'storage',
          //   meta: {
          //     title: '存储',
          //     icon: "el-icon-folder",
          //     roles: "1-3"
          //   },
          //   component: () => import('@/views/config/storage/storage'),
          // },
          {
            path: 'camera',
            name: 'camera',
            meta: {
              title: '通道管理',
              icon: "el-icon-camera-solid",
              roles: "1-4"
            },
            component: () => import('@/views/config/camera/camera'),
          },
          // {
          //   path: 'image',
          //   name: 'image',
          //   meta: {
          //     title: '图像',
          //     icon: "el-icon-picture",
          //     roles: "1-5"
          //   },
          //   component: () => import('@/views/config/image/image'),
          // },
          {
            path: 'event',
            name: 'event',
            meta: {
              title: '智能事件',
              icon: "el-icon-paperclip",
              roles: "1-6"
            },
            component: () => import('@/views/config/event/event'),
          },
          {
            path: 'rolesConfig',
            name: 'rolesConfig',
            meta: {
              title: '权限配置',
              icon: "el-icon-user",
              roles: "1-7",
              buttonRoles: [
                { roles: "UesrManger", name: "用户管理" },
                { roles: "AlgorithmConfig", name: "协议接入" },
                { roles: "Engine", name: "引擎配置" },
                { roles: "SSH", name: "ssh管理" },
                { roles: "Log", name: "日志" },
              ]
            },
            component: () => import('@/views/config/rolesConfig/rolesConfig'),
          },
        ]
      }, {
        path: 'alarmData',
        name: 'alarmData',
        meta: {
          title: '报警数据',
          icon: "el-icon-bell",
          roles: 2
        },
        component: () => import('@/views/alarmData/alarmData'),
        redirect: '/home/alarmData/intelligenceShow',
        children: [
          {
            path: 'intelligenceShow',
            name: 'intelligenceShow',
            meta: {
              title: '智能展示',
              icon: "el-icon-view",
              roles: "2-1",
              buttonRoles: [
                { roles: "isVideo", name: "有视频" },
                { roles: "NoVideo", name: "无视频" }
              ]
            },
            component: () => import('@/views/alarmData/intelligenceShow/intelligenceShow'),
          }
        ]
      }, {
        path: 'bigScreen',
        name: 'homebigScreen',
        meta: {
          title: 'BI大屏',
          icon: 'el-icon-s-tools',
          roles: 3
        },
        component: () => import('@/views/bigScreen/bigScreen.vue'),
      }]
  }
]

const router = new VueRouter({
  routes: constantRouters
})

export default router

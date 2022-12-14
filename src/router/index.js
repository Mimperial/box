import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from "@/layout"
import alarmDataLayout from '@/views/alarmData/alarmData'
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
                    { roles: "SiteInfo", name: "站点信息" }
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
            path: 'smart',
            name: 'smart',
            meta: {
              title: '智能设置',
              icon: "el-icon-s-tools",
              roles: "1-6"
            },
            component: () => import('@/views/config/smart'),
            children: [
              {
                path: 'event',
                name: 'event',
                meta: {
                  title: '智能事件',
                  icon: 'el-icon-paperclip',
                  roles: "1-6-1",
                },
                component: () => import('@/views/config/smart/event.vue'),
              }, {
                path: 'people',
                name: 'people',
                meta: {
                  title: '人员库管理',
                  icon: 'el-icon-paperclip',
                  roles: "1-6-2",
                },
                component: () => import('@/views/config/smart/people.vue'),
              },
            ]
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
                { roles: "Ruleset", name: "规则设置" }
              ]
            },
            component: () => import('@/views/config/rolesConfig/rolesConfig'),
          },
          {
            path: 'pocDemonstration',
            name: 'pocDemonstration',
            meta: {
              title: 'POC演示',
              icon: 'el-icon-s-tools',
              roles: "1-8"
            },
            component: () => import('@/views/config/system/systemSetting.vue'),
          },
        ]
      }, {
        path: 'alarmData',
        name: 'alarmData',
        meta: {
          title: '报警数据',
          icon: "el-icon-bell",
          roles: 2,

        },
        component: alarmDataLayout,
        redirect: '/home/alarmData/intelligenceShow',
        children: [
          {
            path: 'intelligenceShow',
            name: 'intelligenceShow',
            meta: {
              title: '智能展示',
              icon: "el-icon-view",
              roles: "2-1",

            },
            component: () => import('@/views/alarmData/intelligenceShow'),
            // redirect: '/home/alarmData/intelligenceShow/behaviouralAnalysis',
            children: [
              {
                path: 'behaviouralAnalysis',
                name: 'behaviouralAnalysis',
                component: () => import('@/views/alarmData/intelligenceShow/behaviouralAnalysis'),
                meta: {
                  title: '行为分析',
                  icon: 'el-icon-view',
                  roles: "2-1-4",
                  buttonRoles: [
                    { roles: "isVideo", name: "有视频" },
                    { roles: "NoVideo", name: "无视频" }
                  ],
                },
              },
              {
                path: 'faceCaptured',
                name: 'faceCaptured',
                component: () => import('@/views/alarmData/intelligenceShow/faceCaptured'),
                meta: {
                  title: '人脸抓拍',
                  icon: 'el-icon-view',
                  roles: "2-1-2",
                }
              },
              {
                path: 'bodyCaptured',
                name: 'bodyCaptured',
                component: () => import('@/views/alarmData/intelligenceShow/bodyCaptured'),
                meta: {
                  title: '人体抓拍',
                  icon: 'el-icon-view',
                  roles: "2-1-2",
                }
              },
              {
                path: 'faceRecognition',
                name: 'faceRecognition',
                component: () => import('@/views/alarmData/intelligenceShow/faceRecognition'),
                meta: {
                  title: '人脸识别',
                  icon: 'el-icon-view',
                  roles: "2-1-3",
                }
              },

            ]
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
      },
    ]
  }
]

const router = new VueRouter({
  routes: constantRouters
})

export default router

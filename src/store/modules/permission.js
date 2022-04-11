import { asyncRouters, constantRouters } from '@/router/index.js'

function filterAsyncRoutes(routes, v) {
  var childrenRoutes = routes.children;
  var newArrRoutes = []
  for (let i = 0; i < childrenRoutes.length; i++) {
    let element = childrenRoutes[i];
    if (v.includes(element.meta.roles) || (element.meta.buttonRoles && v.some(item => element.meta.buttonRoles.some(item1 => item1.roles == item)))) {
      var obj = deepCopy({}, element)
      delete obj.children;
      if (element.children) {
        obj.children = filterAsyncRoutes(deepCopy({}, element), v)
      }
      newArrRoutes.push(obj);
    } else {
      var obj = deepCopy({}, element)
      delete obj.children;
      if (element.children) {
        obj.children = filterAsyncRoutes(deepCopy({}, element), v)
      }
      if (obj.children && obj.children.length > 0) {
        newArrRoutes.push(obj);
      }
    }
  }
  return newArrRoutes
}

const state = {
  routes: []
}
const getters = {
  permission_routes: state => state.routes,  //权限路由
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRouters.concat(routes)
  }
}
const actions = {
  GenerateRoutes({ commit }, roles) {//角色数组['']
    return new Promise(resolve => {
      if (roles.includes('admin')) {
        commit('SET_ROUTES', asyncRouters);
        resolve(asyncRouters);
      } else {
        var newAsyncRouters = deepCopy([], asyncRouters);
        newAsyncRouters[0].children = filterAsyncRoutes(deepCopy({}, asyncRouters[0]), roles)
        commit('SET_ROUTES', newAsyncRouters);
        resolve(newAsyncRouters);
      }
    })
  }
}
function deepCopy(dest, arr) {
  var o = dest;
  for (var key in arr) {
    if (typeof arr[key] === 'object') {
      o[key] = arr[key].constructor === Array ? [] : {}
      deepCopy(o[key], arr[key])
    } else {
      o[key] = arr[key]
    }
  }
  return o
}
export default {
  state,
  getters,
  mutations,
  actions
}

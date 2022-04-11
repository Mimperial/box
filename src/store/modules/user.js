import { getRolesApi, loginApi } from '@/api/article.js'
import { setToken, getToken, removeToken, setUserToken, removeUserToken, removeDownloadIdToken } from '@/utils/token.js'
export default {
  state: {
    token: getToken(),
    roles: [],
  },
  getters: {
    token: state => state.token,
    roles: state => state.roles,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
  },
  actions: {
    Login({ commit }, user) {
      return new Promise((resolve, reject) => {
        loginApi(user).then(res => {//请求接口
          if (res.code == 0) {
            commit('SET_TOKEN', res.token);
            setUserToken(res.data.userId)
            setToken(res.token);
          }
          resolve(res);
        }).catch(err => {
          reject(err);
        })
      })
    },
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getRolesApi({ token: state.token }).then(res => {//请求接口
          if (res.code == 0 && res.role) {
            commit('SET_ROLES', res.role);
            if (res.role != "admin") {
              res.role = JSON.parse(res.role)
            }
            resolve({ roles: res.role });
          }
        }).catch(err => {
          reject(err);
        })
      })
    },
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', []);
        commit('SET_TOKEN', "");
        // removeDownloadIdToken();
        removeUserToken();
        removeToken();
        resolve();
        // loginApi(user).then(res => {//请求接口
        //   if (res.code == 0) {
        //     commit('SET_TOKEN', res.data.userId);
        //     setToken(res.data.userId);
        //   }
        //   resolve(res);
        // }).catch(err => {
        //   reject(err);
        // })
      })
    }
  },
}
import { downloadAlarmHisReadyApi, downloadFileApi, deleteAlarmHisApi } from '@/api/article.js'
import { getDownloadIdToken, removeDownloadIdToken } from '@/utils/token';
export default {
    state: {
        downloadFlag: getDownloadIdToken() ? true : false,//判断是否处在压缩状态
        timer: null
    },
    getters: {
        downloadFlag: state => state.downloadFlag,
    },
    mutations: {
        SET_DOWNLOADFLAG(state, downloadFlag) {
            state.downloadFlag = downloadFlag;
        },
        SET_TIMER(state, timer) {
            state.timer = timer;
        },
    },
    actions: {
        clearTimer({ commit, state }) {
            if (state.timer) {
                clearInterval(state.timer)
                commit("SET_TIMER", null)
            }
        },
        seachFile({ commit, state }) {
            var count = 0;
            const maxCount = 5;
            var userId = getDownloadIdToken();
            commit("SET_DOWNLOADFLAG", true);
            commit("SET_TIMER", setInterval(() => {
                downloadAlarmHisReadyApi({ userId }).then((res) => {
                    if (res.data) {
                        clearInterval(state.timer)
                        commit("SET_TIMER", null)
                        removeDownloadIdToken();
                        commit("SET_DOWNLOADFLAG", false); //重置压缩状态
                        downloadFileApi(res.data);
                        // deleteAlarmHisApi({ userId }).then(res => {
                        //     console.log("删除成功")
                        // });
                    }
                }).catch((err) => {
                    if (count > maxCount) {
                        clearInterval(state.timer)
                        commit("SET_TIMER", null)
                        removeDownloadIdToken();
                        commit("SET_DOWNLOADFLAG", false); //重置压缩状态
                        console.log("多次尝试失败,状态重置请重新点击下载")
                        count = 0;
                    } else {
                        count++;
                    }
                    console.log(err, count + "-" + maxCount + "判断文件是否存在接口，请求失败")
                });
            }, 3000));
        },
    },
}
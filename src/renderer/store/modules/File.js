/*
 * @Author: your name
 * @Date: 2021-10-08 20:23:35
 * @LastEditTime: 2021-10-08 21:18:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/store/modules/Fille.js
 */

const state = {
    filPath: []
}

const mutations = {
    UPDATE_FILLPATH(state, query) {
        state.filPath = query
    }
}

const actions = {
    clearFillPath({ commit }, query) {
        commit('UPDATE_FILLPATH', query)
    }
}

export default {
    state,
    mutations,
    actions,
    namespaced: true, //命名空间添加为true
}
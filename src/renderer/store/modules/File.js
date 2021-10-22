/*
 * @Author: your name
 * @Date: 2021-10-08 20:23:35
 * @LastEditTime: 2021-10-22 21:00:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/store/modules/Fille.js
 */

const state = {
    filPath: [],
    editNameModal: false,
}

const mutations = {
    UPDATE_FILLPATH(state, query) {
        state.filPath = query
    },
    UPDATE_EDITNAME_MODAL(state, query) {
        state.editNameModal = query
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
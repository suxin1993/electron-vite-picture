/*
 * @Author: your name
 * @Date: 2021-10-08 11:43:58
 * @LastEditTime: 2021-10-08 21:18:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/store/modules/Counter.js
 */
const state = {
    main: 0
}

const mutations = {
    DECREMENT_MAIN_COUNTER(state) {
        state.main--
    },
    INCREMENT_MAIN_COUNTER(state) {
        state.main++
    }
}
const actions = {
    someAsyncTask({ commit }) {
        // do something async
        commit('INCREMENT_MAIN_COUNTER')
    }
}

export default {
    state,
    mutations,
    actions,
    namespaced: true, //命名空间添加为true
}
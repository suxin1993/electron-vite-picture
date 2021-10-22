/*
 * @Author: your name
 * @Date: 2021-10-22 16:46:45
 * @LastEditTime: 2021-10-22 17:19:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/utils/filter.js
 */
import Vue from 'vue'

Vue.filter("picture-size", (val) => {
    if (val < 1024) {
        return `${val}b`
    } else if (val < 1024 * 1024) {
        return `${(val/1024).toFixed(2)}kb`
    } else {
        return `${(val/(1024*1024)).toFixed(2)}M`
    }

})
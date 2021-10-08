<!--
 * @Author: your name
 * @Date: 2021-10-08 11:43:58
 * @LastEditTime: 2021-10-08 19:09:15
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/components/layout-header.vue
-->
<template>
    <div class="layout-header ">
        <span class="iconfont iconic_flow_openroom"></span>
        <span class="title">Image</span>
        <div class="tools">
            <a class="iconfont iconic_fllow_cancel" @click="winHandle('min')"></a>
            <a class="iconfont iconic_fllow" @click="winHandle('max')"></a>
            <a class="iconfont iconic_esc" @click="winHandle('close')"> </a>
        </div>
    </div>
</template>
<script>
const {
    ipcRenderer
} = require('electron');
export default {
    name: "layout-header",
    methods: {
        winHandle (type) {
            ipcRenderer.send(type);
        }
    },
    mounted () {

    }
}
</script>
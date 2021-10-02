<template>
    <div class="layout-header ">
        <span class="iconfont iconic_flow_openroom"></span>
        <span class="title">Image</span>
        <div class="tools">
            <a  class="iconfont iconic_fllow_cancel" @click="winHandle('min')"></a>
            <a class="iconfont iconic_fllow" @click="winHandle('max')"></a>
            <a class="iconfont iconic_esc" @click="winHandle('close')"> </a>
        </div>
    </div>
</template>
<script>
    const {
        ipcRenderer: ipc
    } = require('electron');
    export default {
        name: "layout-header",
        methods: {
            winHandle(type) {
                ipc.send(type);
            }
        },
        mounted() {

        }
    }
</script>
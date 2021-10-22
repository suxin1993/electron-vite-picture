<!--
 * @Author: your name
 * @Date: 2021-10-22 20:11:51
 * @LastEditTime: 2021-10-22 21:31:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/components/globalcomponents/activeModal/edit-name.vue
-->
<template>
    <pf-common-modal v-model="editNameModal" width="400px" :mask-closable="true" :closable="true" class-name="edit-name-modal"
        @on-visible-change="onVisibleChange">
        <div class="edit-name-modal-main">
            <p class="font-sixteen flex-colume-center edit-name-modal-title">修改名字</p>
            <input type="text" v-model="name" placeholder="修改的名字">

        </div>
        <div class="submit-box flex-right">
            <span class="cancel-btn pointer-cursor" @click="toClose">取消</span>
            <span class="submit-btn pointer-cursor " @click="submit">提交</span>
        </div>
    </pf-common-modal>
</template>


<script>
export default {
    name: "edit-name-modal",
    data () {
        return {
            name: null,
        }
    },
    computed: {
        editNameModal: {
            get () {
                return this.$store.state.File.editNameModal
            },
            set () {
                return this.$store.state.File.abnormalDevice
            }
        },
    },
    methods: {
        onVisibleChange (val) {
            this.$store.commit('File/UPDATE_EDITNAME_MODAL', val)
        },
        toClose () {
            this.$store.commit('File/UPDATE_EDITNAME_MODAL', false)
        },
        submit () {

        },

    }
}
</script>

<style lang="less" scoped>
.edit-name-modal-main {
    padding: 20px;
    .edit-name-modal-title {
        margin-bottom: 10px;
    }
}
</style>
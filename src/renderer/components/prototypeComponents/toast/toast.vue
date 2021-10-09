
<template>
    <div :style="{'--toast-size':size}" :class="[level,`animate__${animated}`,position]"
        class="toast-common flex-colume-center animate__animated flex-colume-center" v-show="visible" :data-seq="msg">
        <span :class="[level]" class="toast-common-msg">{{ msg }}</span>
    </div>
</template>

<script>

export default {
    name: 'toast',
    data () {
        return {
            msg: '', // 消息文字
            duration: 2000, // 显示时长，毫秒
            closed: false, // 用来判断消息框是否关闭
            timer: null, // 计时器
            visible: false, // 是否显示
            seed: 0,//层级
            level: '',
            animated: "slideInUp",
            size: 10,//默认为6-15
            position: "bottom",//位置
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.createdElement()
        })
    },
    methods: {
        destroyElement () {
            this.$destroy()
            this.$emit("on-closed", this.msg)
            this.$el.parentNode.removeChild(this.$el)
        },
        createdElement () {
            document.body.appendChild(this.$el)
            this.visible = true
            this.$el.style.zIndex = 999 + this.seed
            this.startTimer()
        },
        startTimer () {
            this.timer = setTimeout(() => {
                if (!this.closed) {
                    this.closed = true
                    clearTimeout(this.timer)
                }
            }, this.duration)
        }
    }
}
</script>

<style scoped>
.toast-common {
    position: fixed;
    bottom: calc(var(--toast-size) * 1%);

    width: 100%;
    pointer-events: none;
}
.toast-common-msg {
    font-size: calc(var(--toast-size) * 2px);
    padding: 1vh 2vw;
    border-radius: calc(var(--toast-size) * 2px);
}
.toast-common.top {
    top: calc(var(--toast-size) * 1%);
}
</style>
<style lang="less" scoped>
.toast-common-msg {
    background-color: #27293e;
    color: #ffffff;
    &.warn {
        color: #eacf59;
    }
    &.error {
        color: #ed3f14;
    }
}
</style>
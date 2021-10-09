

<template>
    <transition :name="transitionNames[1]">
        <div v-if="visible" @click="mask" data-commonmodal='modal' :class="[`${className}-mask`,maskClassName]"
            class="base-common-modal-mask flex-center background-black-seven">
            <div data-commonmodal='modalInfo' v-if="visible" :style="mainStyles" :class="[className,mainClass]"
                class="common-modal-mask-body border-radius-four">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>
// 添加队列参数 ,添加动画参数，可以在某一个隐藏到动画中去
export default {
    name: 'pf-common-modal',
    data () {
        return {
            visible: false,
            escId: null
        }
    },
    // model: {    // 使用model， 这儿2个属性，prop属性说，我要将msg作为该组件被使用时（此处为aa组件被父组件调用）v-model能取到的值，event说，我emit ‘cc’ 的时候，参数的值就是父组件v-model收到的值。
    //     prop: 'value',
    //     event: 'input'
    // },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        closable: {
            type: Boolean,
            default: true,
        },
        maskClassName: {
            type: String,
            default: 'background-black-seven',
        },
        allCover: {
            type: Boolean,
            default: false,
        },
        mainClass: {
            type: String,
            default: 'border-radius-four',
        },
        maskClosable: {
            type: Boolean,
            default: true,
        },
        title: {
            type: String,
        },
        width: {
            type: [Number, String],
            default: 520,
        },
        okText: {
            type: String,
        },
        cancelText: {
            type: String,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        styles: {
            type: Object,
        },
        className: {
            type: String,
        },
        // for instance
        footerHide: {
            type: Boolean,
            default: false,
        },
        scrollable: {
            type: Boolean,
            default: false,
        },
        transitionNames: {
            type: Array,
            default () {
                return ['ease', 'fade'];
            },
        },
        transfer: {
            type: Boolean,
            default: true,
        },

    },
    watch: {
        value (val) {
            this.visible = val;
        },
        visible (val) {
            if (val === false) {
                this.timer = setTimeout(() => {
                    myApp.utils.stackForEsc.removeWithNoInvoke(this.escId)
                }, 300)
            } else {
                if (this.closable) {
                    this.escId = myApp.utils.stackForEsc.push({ fun: this.close })
                }
            }
            this.$emit('on-visible-change', val);
        },
    },
    components: {
    },
    computed: {
        mainStyles () {
            const style = {};
            const width = parseInt(this.width);
            const styleWidth = {
                width: width <= 100 ? `${width}%` : `${width}px`,
            };
            const customStyle = this.styles ? this.styles : {};
            Object.assign(style, styleWidth, customStyle);
            return style;
        },
    },
    methods: {
        close () {
            this.$emit('input', false);
            this.visible = false;
        },
        mask (el) {
            if (el.target.dataset.commonmodal === 'modal' && this.visible && this.maskClosable) {
                this.close();
            } else {
                if (el.target.dataset.commonmodal === 'modal') {
                    this.$emit('maskClick', el);
                }
            }
        },
        EscClose (e) {
            if (this.visible && this.closable) {
                if (e.keyCode === 27) {
                    this.close()
                }
            }
        },
    },
    mounted () {
        // ESC close
        document.addEventListener('keydown', this.EscClose)
        // perform-modal
        this.$nextTick(() => {
            this.allCover ? document.querySelector("body").appendChild(this.$el) : ''
        });
    },
    // 父组件销毁,子组件没有销毁
    beforeDestroy () {
        this.close()
        this.$emit('input', false)
        this.$emit('on-visible-change', false)
        console.log('父组件销毁状况' + this.$parent._isDestroyed)
        if (this.allCover && document.querySelector(`.${this.className}-mask`)) {
            // TODO:需要去看为什么beforeDestroy不执行
            document.querySelector("body").removeChild(document.querySelector(`.${this.className}-mask`))
        }
        document.removeEventListener('keydown', this.EscClose)
        if (this.escId) {
            myApp.utils.stackForEsc.removeWithNoInvoke(this.escId)
        }
    },
};
</script>

<style lang="less" >
.base-common-modal-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    // backdrop-filter: blur(30px);
    .common-modal-mask-body {
        display: inline-block;
        background: #292a2b;
        animation: scaleTo1 ease 0.4s both;
        opacity: 0;
        @keyframes scaleTo1 {
            from {
                opacity: 0;
                transform: scale(0);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    }
}
</style>


<template>
    <div class="drop-component" id="dropmove" @click.capture="click" :style="styleString" ref="elmove" @mousedown="down" @touchstart="down">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'pf-common-dropgrable',
    props: {
        styleString: {
            type: String,
            default: "left: 329px; top: 60px;zIndex:4"
        },
        movePositon: {
            type: String,
            default: ""
        },
        limitLeft: {
            type: Number,
            default: 70
        },
        limitRight: {
            type: Number,
            default: 150
        },
        limitBottom: {
            type: Number,
            default: 100
        },
        limitTop: {
            type: Number,
            default: 30
        },
        //有效点击元素id
        touchElId: {
            type: String,
            default: ""
        },
    },
    data () {
        return {
            flags: false,
            maxW: "",
            maxH: "",
            oL: "",
            oT: "",
            nodeEle: null,
            isMove: false,

            draging: false,
        };
    },
    mounted () {
        this.nodeEle = this.$refs.elmove;
        this.maxW = document.documentElement.clientWidth - this.nodeEle.offsetWidth - this.limitRight
        this.handleResize()
        // 暂时用在房间内的组件，房间宽固定，可拖动高度范围随resize自适应
        this.handleResizeP = myApp._.throttle(this.handleResize, 1000)
        window.addEventListener('resize', this.handleResizeP)
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.handleResizeP)
    },
    methods: {
        handleResize () {
            this.maxH = document.documentElement.clientHeight - this.nodeEle.offsetHeight - this.limitBottom;
        },
        down (e) {
            if (this.touchElId && e.target.id !== this.touchElId) {
                return
            }
            this.flags = true;
            this.$emit('toMouseover', !this.flags)
            var event = e || window.event;
            var touch = event.touches ? event.touches[0] : event;
            this.oL = touch.clientX - this.nodeEle.offsetLeft;
            this.oT = touch.clientY - this.nodeEle.offsetTop;
            this.isMove = false
            document.addEventListener("touchmove", this.move, false);
            document.addEventListener("mousemove", this.move, false);
            document.addEventListener("mouseup", this.end, false);
            document.addEventListener("touchend", this.end, false);
            if (this.timeout) clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.draging = true
            }, 100)
        },
        click (e) {
            if (this.draging) {
                e.preventDefault()
                e.stopPropagation()
                // e.stopImmediatePropagation() // stopPropagation就够了
            }
        },
        move (e) {
            if (this.flags) {
                var event = e || window.event;
                var touch = event.touches ? event.touches[0] : event;
                var oLeft = touch.clientX - this.oL;
                var oTop = touch.clientY - this.oT;
                //范围限定优化方法
                oLeft = Math.min(this.maxW, Math.max(this.limitLeft, oLeft));
                oTop = Math.min(this.maxH, Math.max(this.limitTop, oTop));
                this.isMove = true
                // if (oLeft < 0) {
                //   oLeft = 0;
                // } else if (oLeft >= this.maxW) {
                //   oLeft = this.maxW;
                // }
                // if (oTop < 0) {
                //   oTop = 0;
                // } else if (oTop >= this.maxH) {
                //   oTop = this.maxH;
                // }
                if (this.movePositon == "moveX") {
                    this.nodeEle.style.left = oLeft + "px";
                    this.nodeEle.style.right = "auto";
                } else if (this.movePositon == "moveY") {
                    this.nodeEle.style.top = oTop + "px";
                    this.nodeEle.style.bottom = "auto";
                } else {
                    this.nodeEle.style.left = oLeft + "px";
                    this.nodeEle.style.right = "auto";
                    this.nodeEle.style.top = oTop + "px";
                    this.nodeEle.style.bottom = "auto";
                }
            }
        },
        //鼠标释放时候的函数
        end () {
            if (this.timeout) clearTimeout(this.timeout)
            if (this.draging) {
                if (this.isMove) {
                    setTimeout(() => {
                        this.draging = false
                    }, 100)
                } else {
                    this.draging = false
                }
            }
            this.flags = false;
            if (!this.isMove) {
                this.$emit('toMouseover', !this.flags)
            } else {
                setTimeout(() => {
                    this.$emit('toMouseover', !this.flags)
                }, 50)
            }
            this.removeListener()
        },
        removeListener () {
            document.removeEventListener("touchmove", this.move, false);
            document.removeEventListener("mousemove", this.move, false);
            document.removeEventListener("mouseup", this.end, false);
            document.removeEventListener("touchend", this.end, false);
        }
    }
};
</script>
<style scoped>
.drop-component {
    position: fixed !important;
    touch-action: none;
}
</style>
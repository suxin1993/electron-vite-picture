<template>
    <div id="photos" class="photos-box">
        <div class="flex-between">
            <div class="iconfont iconic_live_cover_change  iconfont-title" @click="open()"></div>
            <div class="iconfont iconic_tips iconfont-title" @click="clear()"></div>
        </div>
        <div @click="getQiniuToken()"> 获取七牛云token</div>
        <div>
            <span @click="toChangeType(item)" v-for="(item,index) in extType " :key="index">
                {{item}}
            </span>
            <span @click="toReteType()"> 全部</span>
        </div>
        <div class="flex-wrap-left">
            <div v-for="(item,index ) in filePath" :key="index">
                <div v-if="extInclude.includes(item.ext)" @contextmenu="onSelectItem(index)" class="item-img  flex-colume-center ">
                    <img ref="img" class="pointer-cursor" :src="item.filePathF" @click="init()" :alt="item.filename" :title='item.filename'>
                    <div v-if="!item.edit" class="img-list pointer-cursor text-overflow-ellipsis" @click.prevent="toOpenWidnows(index)">
                        <span @click.stop="copy(item.filename)" class="iconfont copy-item iconic_dailytasks5"></span>{{item.filename}}
                    </div>
                    <div v-else>
                        <input type="text" @change="changePhotoName(index)" v-model='item.filename'>
                    </div>
                    <div class="flex-between">
                        <span @click="toEdit(index)" class="pointer-cursor">编辑</span>
                        <span @click="toSvgo(index)" v-if="item.ext=='.svg'">svgo</span>
                        <span v-if="item.ext=='.jpeg'||item.ext=='.jpg'||item.ext=='.png'" @click="toCompression(index)">压缩图片</span>
                        <span @click="toUpload(item.filePath,item.filename)">上传七牛</span>
                    </div>
                    <div>
                        <span>{{+item.size/1024/1024}}M</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer, shell, clipboard } = require('electron');
const { remote } = window.require('electron');
import viewerjs from "../utils/viewer.min.js"
const token = require('../utils/qiniu/qntoken')
import tokendata from "../utils/qiniu/qiniu.json"
const { readFile } = require('../utils/node-operate-folder')
import { postQiNiuReander } from "../utils/qiniu/qiniuUpload.js"
var viewer = null;
export default {
    name: 'LandingPage',
    data () {
        return {
            filePath: [],
            extType: {},
            extInclude: [],
            qiniuUptoken: ""//七牛Token
        }
    },
    computed: {
        filePaths () {
            return this.$store.state.File.filePath
        }
    },
    methods: {
        init () {
            let _this = this;
            viewer = new viewerjs(document.getElementById('photos'), {
                zoomRatio: 0.05,
                interval: 3000,
                minZoomRatio: 0.25,
                maxZoomRatio: 2,
                button: true,
                title: function (e) {
                    return decodeURIComponent(e.alt)
                },
                built: function (e) {
                    // console.error(e)
                    // 2 methods are available here: "show" and "destroy".
                },
                show: function () {
                    viewer.update()
                },
                shown: function (e) {
                    // console.error(e)
                    // 9 methods are available here: "hide", "view", "prev", "next", "play", "stop", "full", "exit" and "destroy".
                },
                viewed: function (e) {
                    // console.error(e)
                    // All methods are available here except "show".
                    // this.viewer.zoomTo(1).rotateTo(180);
                },
                move: function (e) {
                    console.error("MOVE")
                },
                moveTo: function (e) {
                    console.error("MOVETo")
                },
                hide: function (e) {
                    // console.error(e)
                    viewer.destroy()
                    viewer = undefined
                },

                ready: function () {
                    document.getElementsByClassName('viewer-canvas')[0].setAttribute('data-viewer-action', '');

                }
            });
            viewer.show()
        },
        reset () {
            if (document.getElementsByClassName('viewer-container').length > 0) {
                // document.getElementsByClassName('viewer-container')[0].parentNode.removeChild(document.getElementsByClassName(
                //   'viewer-container')[0]);
                viewer.destroy()
            }
        },
        open () {
            this.reset();
            ipcRenderer.send("open-message");
        },
        copy (copyStr) {
            clipboard.writeText(copyStr)
            this.$toast(`复制${copyStr}成功`)
        },
        toSvgo (index) {
            let worker = new Worker('src/renderer/work/svgo.js');
            worker.postMessage(JSON.stringify(this.filePath[index]));
            worker.onmessage = function (event) {
                console.log(event)
            };
        },
        toCompression (index) {
            ipcRenderer.send("to-compression", JSON.stringify(this.filePath[index]));
            return
            // work 进程会奔溃
            let worker = new Worker('src/renderer/work/compressionImageJpg.js');
            worker.postMessage(JSON.stringify(this.filePath[index]));
            worker.onmessage = function (event) {
                console.log(event)
            }
        },
        toEdit (index) {
            this.$set(this.filePath[index], "edit", !this.filePath[index].edit)
        },
        clear () {
            this.reset();
            this.filePath = []
            localStorage.setItem('fileList', JSON.stringify(this.filePath))
        },
        toChangeType (ext) {
            console.error(this.extInclude)
            this.extInclude = []
            this.extInclude.push(ext)
        },
        toReteType () {
            this.extInclude = Object.keys(this.extType)
        },
        onSelectItem (index) {
            // console.error(e)
            console.error(colorjs)
            colorjs.average(this.filePath[index].filePath).then(color => {
                console.log(color)
            })
            //获取图片的宽度与高度
            console.error(this.$refs['img'][index].naturalWidth)

            this.$toast(`宽高 : ${this.$refs['img'][index].naturalWidth}*${this.$refs['img'][index].naturalHeight}`)
        },
        changePhotoName (index) {
            this.$set(this.filePath[index], "edit", false)
            let worker = new Worker('src/renderer/work/editName.js');
            worker.postMessage(JSON.stringify(this.filePath[index]));
            worker.onmessage = function (event) {
                console.log(event)
            };
        },
        toOpenWidnows (index) {
            let file = this.filePath[index].filePath
            shell.showItemInFolder(file)
            //  let win= remote.getCurrentWindow()
            return
            remote.dialog.showOpenDialog(null, {
                title: 'info', defaultPath: file, properties: ['openFile', 'multSelections']
            }).then(result => { })
        },
        getQiniuToken () {
            this.qiniuUptoken = token.token(tokendata)
        },
        async toUpload (filePath, filename) {
            let content = await readFile(filePath)
            let blob = new Blob([content], { type: "image/jpeg" });
            const file = new File(
                [blob],
                'pic.jpeg',
                { type: 'image/jpeg' }
            );
            const key = await postQiNiuReander({
                'file': file,
                'token': this.qiniuUptoken,
                'key': filename,
                'fname': filename
            })
            console.log(key)
        }
    },
    created () {
        if (localStorage.getItem('fileList')) {
            this.filePath = JSON.parse(localStorage.getItem('fileList'))
            // 并且需要监视
            ipcRenderer.send("files-monitoring", this.filePath);
            this.filePath.forEach((item, index) => {
                this.extType[item.ext] = item.ext
            })
            this.extInclude = Object.keys(this.extType)
        }
    },
    mounted () {
        ipcRenderer.on('files-reply', (event, arg) => {
            // console.error(arg)
            this.filePath = []
            this.extType = {}
            this.extInclude = []
            for (let i in arg) {
                arg[i].filePathF = 'file:///' + arg[i].filePath.replace(/\\/g, "/")
                this.filePath.push(arg[i])
                this.extType[arg[i].ext] = arg[i].ext
            }
            this.extInclude = Object.keys(this.extType)
            this.$store.dispatch("Counter/someAsyncTask", this.filePath)
            this.reset()
            localStorage.setItem('fileList', JSON.stringify(this.filePath))
        });

        this.$nextTick(() => {
            const script = document.createElement('script')
            script.src = 'src/renderer/utils/color.js'
            document.body.appendChild(script)
            script.onload = () => {
            }
        });

    }
}
</script>
<style>
/* .viewer-list {
    width: 93px !important;
  } */

.viewer-canvas {
    top: 25px !important;
}
</style>

<style scoped lang="less">
#photos {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    background: #292a2b;
}
.photos-box {
    width: 100%;
    .iconfont-title {
        font-size: 20px;
        margin: 60px 40px 20px 40px;
        cursor: pointer;
    }
    .copy-item {
        vertical-align: -2px;
    }
    .item-img {
        width: 200px;
        margin: 10px;
        img {
            max-width: 100%;
        }
        .img-list {
            width: 200px;
            text-align: center;
            margin-top: 10px;
        }
    }
}
</style>
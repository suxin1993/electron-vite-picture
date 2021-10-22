<template>
    <div id="photos" class="photos-box">
        <div class="flex-between">
            <div class="iconfont iconic_live_cover_change  iconfont-title" @click="open()"></div>
            <div class="iconfont iconic_tips iconfont-title" @click="clear()"></div>
        </div>
        <div @click="getQiniuToken()"> 获取七牛云token</div>
        <div @click="compareSize()">按照大小排序</div>
        <div>
            <span @click="toChangeType(item)" v-for="(item,index) in extType " :key="index">
                {{item}}
            </span>
            <span @click="toReteType()"> 全部{{filePath.length}}</span>
        </div>
        <div class="flex-wrap-left">
            <div v-for="(item,index ) in filePath" :key="index">
                <div :style="`background: ${backgroundPic.index==index?backgroundPic.backgroundColor:''}`" v-if="extInclude.includes(item.ext)"
                    @contextmenu="onSelectItem(index)" class="item-img  flex-colume-center ">
                    <img ref="img" class="pointer-cursor" :src="item.filePathF" @click="init()" :alt="item.filename" :title='item.filename'>
                    <div v-if="!item.edit" class="img-list pointer-cursor text-overflow-ellipsis" @click.prevent="toOpenWidnows(index)">
                        <span @click.stop="copy(item.filename)" class="iconfont copy-item iconic_dailytasks5"></span>{{item.filename}}
                    </div>
                    <div v-else>
                        <input type="text" @change="changePhotoName(index)" v-model='item.filename'>
                    </div>
                    <div class="flex-colume-center">
                        <span class="sure-button-hover flex-colume-center" @click="toEdit(index)">编辑</span>
                        <span class="sure-button-hover flex-colume-center" @click="toSvgo(index)" v-if="item.ext=='.svg'">svgo</span>
                        <span class="sure-button-hover flex-colume-center" v-if="item.ext=='.jpeg'||item.ext=='.jpg'||item.ext=='.png'"
                            @click="toCompression(index)">压缩图片</span>
                        <span class="sure-button-hover flex-colume-center" @click="toUpload(item.filePath,item.filename,item.ext)">上传七牛</span>
                        <span class="sure-button-hover flex-colume-center" @click="moveItemToTrash(index)">删除文件</span>
                        <span class="sure-button-hover flex-colume-center" @click="toChangPhoto(index)">编辑照片</span>
                    </div>
                    <div>
                        <span>{{+item.size|picture-size}}</span>
                    </div>
                </div>
            </div>
        </div>
        <edit-name-modal></edit-name-modal>
    </div>
</template>

<script>
const { ipcRenderer, shell, clipboard } = require('electron');
const { remote } = window.require('electron');
import viewerjs from "../utils/viewer.min.js"
const token = require('../utils/qiniu/qntoken')
import tokendata from "../utils/qiniu/qiniu.json"
// 示例
//     "ak":”“,
//     "sk": "",
//     "bkt": "",
//     "cdn": ""
const { readFile } = require('../utils/node-operate-folder')
import { compare } from "../utils/util"
import { postQiNiuReander } from "../utils/qiniu/qiniuUpload.js"
// shell 可以打开文件夹，打开外部链接，以默认打开方式打开文件.删除文件 shell.writeShortcutLink 创造快捷方式 只能windows用
var viewer = null;
export default {
    name: 'LandingPage',
    data () {
        return {
            filePath: [],
            extType: {},
            extInclude: [],
            qiniuUptoken: "",//七牛Token
            backgroundPic: {
                backgroundColor: '',
                index: undefined,
            },//更换背景色
            isCompare: false,
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
        // 按照大小排序
        compareSize () {
            this.filePath = this.filePath.sort(compare("size", false))
        },
        toSvgo (index) {
            let worker = new Worker('src/renderer/work/svgo.js');
            worker.postMessage(JSON.stringify(this.filePath[index]));
            worker.onmessage = function (event) {
                console.log(event)
            };
        },
        toCompression (index) {
            this.filePath[index].height = this.$refs['img'][index].naturalHeight
            this.filePath[index].width = this.$refs['img'][index].naturalWidth
            ipcRenderer.send("to-compression", JSON.stringify(this.filePath[index]));
            let size = this.filePath[index].size
            console.error(this.filePath[index].size)
            setTimeout(() => {
                this.$toast(`压缩比例${this.filePath[index].size / size}`)
            }, 5000)
            // 获取压缩前的大小与压缩后的大小
            return
            // work 进程会奔溃
            let worker = new Worker('src/renderer/work/compressionImageJpg.js');
            worker.postMessage(JSON.stringify(this.filePath[index]));
            worker.onmessage = function (event) {
                console.log(event)
            }
        },
        moveItemToTrash (index) {
            shell.trashItem(this.filePath[index].filePath)
        },
        toEdit (index) {
            this.$set(this.filePath[index], "edit", !this.filePath[index].edit)
        },
        clear () {
            this.reset();
            this.filePath = []
            localStorage.setItem('fileList', JSON.stringify(this.filePath))
        },
        toChangPhoto () {
            this.$store.commit('File/UPDATE_EDITNAME_MODAL', true)
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
            // console.error(colorjs)
            colorjs.average(this.filePath[index].filePathF).then(color => {
                this.backgroundPic.backgroundColor = `rgba(${color[0]},${color[1]},${color[2]},1)`
                this.backgroundPic.index = index
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
        async toUpload (filePath, filename, ext) {
            // 通过render进程来读取一下图片数据，图片的大小不要太大
            let content = null
            let type = {
                '.png': 'image/png',
                '.PNG': 'image/png',
                ".gif": "image/gif",
                ".GIF": "image/gif",
                '.WEBP': 'image/webp',
                '.webp': 'image/webp',
                '.jpg': 'image/jpeg',
                '.JPG': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.JPEG': 'image/jpeg',
                '.ico': 'image/x-icon',
                '.ICO': 'image/x-icon',
                '.svg': 'text/xml',
                '.SVG': 'text/xml',
            }
            // 类型需要去查找后-http://tools.jb51.net/table/http_content_type/
            try {
                content = await readFile(filePath)
            } catch (error) {
                console.error(error)
                this.$toast(`读取文件失败`)
                return
            }
            let blob = new Blob([content], { type: type[ext] });
            const file = new File(
                [blob],
                filename,
                { type: type[ext] }
            );
            const key = await postQiNiuReander({
                'file': file,
                'token': this.qiniuUptoken,
                'key': `upload/electron/${filename}`,
                'fname': filename
            })
            if (key) {
                console.log(JSON.parse(key).key)
                this.$toast(`https://${tokendata.cdn}/${JSON.parse(key).key
                    }`)
            }
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
        // 获取七牛token
        this.getQiniuToken()
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
    height: calc(~"100vh - 50px");
    // position: fixed;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // overflow: auto;
    background: #292a2b;
    overflow-y: scroll;
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
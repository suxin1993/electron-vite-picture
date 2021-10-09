<template>
    <div id="photos" class="photos-box" style="width:100%;">
        <div class="iconfont iconic_live_cover_change  add" @click="open()"></div>
        <div class="flex-wrap-left">
            <div class="item-img  flex-colume-center " v-for="(item,index ) in filePath" :key="index">
                <img ref="img " class="pointer-cursor" :src="item.filePathF" @click="init()" :alt="item.filename" :title='item.filename'>
                <div class="img-list pointer-cursor text-overflow-ellipsis" @click="toOpenWidnows(index)">{{item.filename}}</div>
            </div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer, shell } = require('electron');
const { remote } = window.require('electron');
import viewerjs from "../utils/viewer.min.js"
var viewer = null;
export default {
    name: 'LandingPage',
    data () {
        return {
            filePath: [],
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
        toOpenWidnows (index) {
            let file = this.filePath[index].filePath
            shell.showItemInFolder(file)
            //  let win= remote.getCurrentWindow()
            return
            remote.dialog.showOpenDialog(null, {
                title: 'info', defaultPath: file, properties: ['openFile', 'multSelections']
            }).then(result => { })
        }
    },
    created () {
        if (localStorage.getItem('fileList')) {
            this.filePath = JSON.parse(localStorage.getItem('fileList'))
            // 并且需要监视
            ipcRenderer.send("files-monitoring", this.filePath);
        }
    },
    mounted () {

        ipcRenderer.on('files-reply', (event, arg) => {
            // console.error(arg)
            this.filePath = []
            for (let i in arg) {
                arg[i].filePathF = 'file:///' + arg[i].filePath.replace(/\\/g, "/")
                this.filePath.push(arg[i])
            }
            this.$store.dispatch("Counter/someAsyncTask", this.filePath)
            this.reset()
            localStorage.setItem('fileList', JSON.stringify(this.filePath))
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
.add {
    font-size: 20px;
    margin-top: 50px;
    margin-left: 50px;
    cursor: pointer;
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
    }
}
</style>
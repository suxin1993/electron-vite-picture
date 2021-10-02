<template>
  <div id="photos" class="photos-box" style="width:100%;">
    <div  class="iconfont iconic_live_cover_change  add" @click="open()"></div>
    <div class="flex-wrap-left">
    <div class="item-img  " v-for="(item,index ) in data" :key="index">
      <img ref="img" :src="item"    @click="init()">
    </div>
    </div>
  </div>
</template>

<script>
  import viewerjs from 'viewerjs'
  
  const {
    ipcRenderer: ipc
  } = require('electron');
  var viewer = null;
  export default {
    name: 'LandingPage',
    data() {
      return {
        data: [],
        isshow: false,
        logShow:true,
      }
    },
    methods: {
      init() {
        var _this = this;
        viewer = new viewerjs(document.getElementById('photos'), {
          zoomRatio: 0.05,
          interval: 3000,
          minZoomRatio: 0.25,
          maxZoomRatio: 2,
          button: true,
          title:function(e){
            return decodeURIComponent(e.alt)
          },
          built: function (e) {
            console.error(e)
            // 2 methods are available here: "show" and "destroy".
          },
          show:function(){
             viewer.update()
          },
          shown: function (e) {
             console.error(e)
            // 9 methods are available here: "hide", "view", "prev", "next", "play", "stop", "full", "exit" and "destroy".
          },
          viewed: function (e) {
             console.error(e)
            // All methods are available here except "show".
            // this.viewer.zoomTo(1).rotateTo(180);
          },
          hide: function (e) {
              console.error(e)
              viewer.destroy()
              viewer = undefined
          },
          
          ready: function () {
            document.getElementsByClassName('viewer-canvas')[0].setAttribute('data-viewer-action', '');
       
          }
        });
        viewer.show()
      },
      reset() {
        if (document.getElementsByClassName('viewer-container').length > 0) {
          // document.getElementsByClassName('viewer-container')[0].parentNode.removeChild(document.getElementsByClassName(
          //   'viewer-container')[0]);
          viewer.destroy()
        }
        // if(viewer){
        //   viewer.destroy();
        // }
        //  this.logShow=false
      },
      open(){
        var _this = this;
        _this.reset();
       _this.logShow=false
        ipc.send("open-message");
      }
    },
    mounted() {
      var _this = this
      ipc.on('files-reply', function (event, arg) {
        var tmp = [];
        for (var i in arg) {
          tmp.push('file:///' + arg[i].replace(/\\/g, "/"));
        }
        _this.data = tmp;
        _this.reset()

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
    cursor: pointer;
  }

   
  .item-img {
    max-width: 200px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
<template>
  <div id="photos" class="photos-box" style="width:100%;">
    <div  id="logo" @click="open()"></div>
    <div class=""></div>
    <div class="item-img" v-for="(item,index ) in data" :key="index">
      <img ref="img" :src="item"    @click="init()">
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
          inline: true,
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
              _this.logShow=true
          },
          
          ready: function () {
            document.getElementsByClassName('viewer-canvas')[0].setAttribute('data-viewer-action', '');
       
          }
        });
        viewer.show()
      },
      reset() {
        console.error(document.getElementsByClassName('viewer-container'))
        if (document.getElementsByClassName('viewer-container').length > 0) {
          // document.getElementsByClassName('viewer-container')[0].parentNode.removeChild(document.getElementsByClassName(
          //   'viewer-container')[0]);
          viewer.destroy();

         
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
  #logo{
    background:url('../assets/images/bg.jpg') no-repeat;
    width:600px;
    height:180px;
    margin:0 auto;
    position: relative;
    top:50%;
    margin-top:-90px;
    cursor:pointer;


  }
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

  #photos .item .tit {
    position: absolute;
    color: #fff;
    bottom: 0;
    background: #000;
    width: 100%;
    opacity: 0.8;
    font-size: 14px;
    padding: 5px;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
    z-index: 10;
  }
  .item-img {
    margin-top: 500px;
  }
</style>
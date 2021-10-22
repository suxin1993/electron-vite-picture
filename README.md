<!--
 * @Author: your name
 * @Date: 2021-10-14 11:00:11
 * @LastEditTime: 2021-10-22 19:52:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/README.md
-->

# electron 图片查看


## 图片命名

## 看如何集成vue3 electron配置vue3

## webpack 配置vue3

## jsZip和FileSaver.js

## 获取七牛云中的文件

## 打包成为zip文件

## 截图

## 颜色拾取器


## 右键 

## 图片命名






## 搜索功能

## 播放lottery动画与vap动画




## 通过sharp对图片操作

## 无法完成
#### 无法监视子文件的改变

## 已经完成
#### svgo
#### 可以分类
#### 压缩图片
#### 上传七牛云
#### 获取图片的大小
#### 获取图片的宽高
```
var img = document.getElementById("oImg"),
　　w,h;

if (oImg.naturalWidth) {
　　// HTML5 browsers
　　w = oImg.naturalWidth;
　　h = oImg.naturalHeight;
} else {
　　// IE 6/7/8
　　var nImg = new Image();
//      nImg.src = oImg.src;
　　nImg.onload = function () {
　　　　w = nImg.width;
　　　　h = nImg.height;
　　　　console.log(w + "  " + h)
　　}
　　nImg.src = oImg.src;
}
```
#### 获取图片颜色
```
 canvas
```





# electron 图片查看


## 图片命名

## 看如何集成vue3 electron配置vue3

## webpack 配置vue3

## jsZip和FileSaver.js

## 获取七牛云中的文件



## 图片压缩png

## 图片压缩jpg

## 打包成为zip文件

## 截图


## 1.右键 3.分类 2.图片命名

## 获取图片的大小

## 获取图片的宽高
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


## 获取图片颜色
```
 canvas
```

## 压缩图片，通过canvas转化格式，然后sharp压缩，然后再转换回来

## 已经完成

#### svgo
#### 可以分类

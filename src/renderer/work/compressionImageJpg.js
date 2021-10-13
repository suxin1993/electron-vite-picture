

const { writeFileAsync, readFile } = require('./src/renderer/utils/node-operate-folder.js')
const images = require("images")

// 图片太大，容易崩溃，如何避免
// 通过子进程运行
self.addEventListener('message', async (e) => {
    console.error('imageJpg')
    let filePath = JSON.parse(e.data).filePath
    console.error(JSON.parse(e.data).filePath)
    images(filePath).save(filePath, { quality: 60 }) 
    
    setTimeout(() => {
        self.close();
    }, 2000)
}, false);
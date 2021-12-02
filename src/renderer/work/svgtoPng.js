/*
 * @Author: your name
 * @Date: 2021-11-01 17:09:52
 * @LastEditTime: 2021-11-01 17:14:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/work/svgtoPng.js
 */
const sharp = require("sharp")
const { writeFileAsync, readFile } = require('./src/renderer/utils/node-operate-folder.js')

self.addEventListener('message', async (e) => {
    console.error('svgtopng')
    let filePath = JSON.parse(e.data).filePath
    sharp(filePath)
        .png()
        .toFile(`${filePath}.png`)
        .then(function(info) {
            console.log(info)
        })
        .catch(function(err) {
            console.log(err)
        })
    setTimeout(() => {
        self.close();
    }, 2000)
}, false);
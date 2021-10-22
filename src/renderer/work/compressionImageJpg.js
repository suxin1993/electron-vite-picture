/*
 * @Author: your name
 * @Date: 2021-10-14 11:00:11
 * @LastEditTime: 2021-10-22 10:51:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/work/compressionImageJpg.js
 */
// work 进程
// const { writeFileAsync, readFile } = require('./src/renderer/utils/node-operate-folder.js')
// const { writeFileAsync, readFile } = require('../utils/node-operate-folder')
const resizeOptimizeImages = require('resize-optimize-images');



if (false) {
    // 图片太大，容易崩溃，如何避免
    // 通过子进程运行
    self.addEventListener('message', async (e) => {
        console.error('imageJpg')
        let filePath = JSON.parse(e.data).filePath
        console.error(JSON.parse(e.data).filePath)
        images(filePath).save(filePath, { quality: 60 })

        setTimeout(() => {
            self.close();
        }, 10000)
    }, false);
} else {
    process.on('message', async function(m) {
        console.log('message from parent: ' + JSON.stringify(m));
        if (m.exit == 'exit') {
            process.exit(process.pid)
        } else if (m.filePath) {
            const options = {
                images: [m.filePath, m.filePath],
                width: m.width,
                height: m.height,
                quality: 80
            };
            // Run the module.
            await resizeOptimizeImages(options);

            setTimeout(() => {
                process.exit(process.pid)
            }, 10000)
        }
    });
    process.send({ from: 'child', pid: process.pid })

}
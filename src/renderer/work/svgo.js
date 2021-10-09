/*
 * @Author: your name
 * @Date: 2021-10-09 20:34:38
 * @LastEditTime: 2021-10-09 20:44:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/work/svgo.js
 */

const { writeFileAsync, readFile } = require('./src/renderer/utils/node-operate-folder.js')
const { optimize } = require('svgo');

self.addEventListener('message', async (e) => {
    console.error('svgo')
    let filePath = JSON.parse(e.data).filePath
    console.error(JSON.parse(e.data).filePath)
    let data = await readFile(filePath)
    const result = optimize(data, {
        // optional but recommended field
        path: filePath,
        // all config fields are also available here
        multipass: true,
    });
    await writeFileAsync(filePath, result.data)
    setTimeout(() => {
        self.close();
    }, 2000)
}, false);
/*
 * @Author: your name
 * @Date: 2021-10-09 18:58:17
 * @LastEditTime: 2021-10-09 20:13:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/work/editName.js
 */

const { renamePath, pathParsePath, pathJoinDir } = require('./src/renderer/utils/node-operate-folder.js')


self.addEventListener('message', async (e) => {
    let parent = pathParsePath(JSON.parse(e.data).filePath)
    let oldParse = JSON.parse(e.data).filePath
    let newParse = pathJoinDir(parent, JSON.parse(e.data).filename)
    renamePath(oldParse, newParse)
    // self.postMessage('You said: ' + JSON.stringify(e.data));
    // self.postMessage('You said: ' + JSON.stringify(el));
    setTimeout(() => {
        self.close();
    }, 1000)
}, false);
/*
 * @Author: your name
 * @Date: 2021-10-09 18:58:17
 * @LastEditTime: 2021-10-09 20:13:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/work/editName.js
 */

const photo = require('./src/renderer/work/photo.js')


self.addEventListener('message', async (e) => {
    console.error(JSON.parse(e.data))
    photo(JSON.parse(e.data).selectList,JSON.parse(e.data).fileName)
    // self.postMessage('You said: ' + JSON.stringify(e.data));
    // self.postMessage('You said: ' + JSON.stringify(el));
    setTimeout(() => {
        self.close();
    }, 2000)
}, false);
/*
 * @Author: your name
 * @Date: 2021-10-09 10:24:50
 * @LastEditTime: 2021-10-09 13:41:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/main/child/child.js
 */
const fs = require('fs')
let fsWait = false;
process.on('message', function(m) {
    console.log('message from parent: ' + JSON.stringify(m));
    if (m.dirPath) {
        fs.watch(m.dirPath, (event, filename) => {
            if (filename) {
                if (fsWait) return;
                fsWait = setTimeout(() => {
                    fsWait = false;
                }, 1000);
                console.log(`${process.pid} name${filename} file ${event}`);
                if (event == 'rename') {

                    process.send({ dirPath: m.dirPath })
                }
                // 性能不好，有变化，直接遍历，fs模块，不停的IO读写
            }
        });
    } else if (m.exit == 'exit') {
        process.exit(process.pid)
    }
});

process.send({ from: 'child', pid: process.pid })
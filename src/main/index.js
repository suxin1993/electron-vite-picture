import {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9085` :
    `file://${__dirname}/index.html`

function createWindow(e) {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 750,
        width: 1200,
        // maxHeight: 750,
        // maxWidth: 1300,
        // minHeight: 750,
        // minWidth: 1300,
        useContentSize: true,
        backgroundColor: '#292a2b',
        resizable: true,
        fullscreen: false,
        frame: false,
        webPreferences: {
            webSecurity: false, //使用file://协议
            nodeIntegration: true, //使用nodeIntegration 为true不起作用的时候可以将contextIsolation改为false
            nodeIntegrationInWorker: true,
            nodeIntegrationInSubframes: true,
            contextIsolation: false, //electron13之后默认为false
            enableRemoteModule: true,
        }
        // titleBarStyle: 'customButtonsOnHover'
    })
    mainWindow.loadURL(winURL)
    mainWindow.openDevTools()
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

// 利用ipc让html标签获取主进程的方法,最小化,最大化,关闭
ipcMain.on('min', e => mainWindow.minimize());
ipcMain.on('max', e => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
    } else {
        mainWindow.maximize()
    }
});
ipcMain.on('close', e => {
    if (process.platform === 'darwin') {
        app.quit()
    } else if (mainWindow) {
        mainWindow.close()
    }
});
// 利用ipc让html标签获取主进程的方法,最小化,最大化,关闭

// main.js start
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', (e) => {
    if (mainWindow === null) {
        createWindow();
    }
})
// main.js end
// 获取fs模块
const fs = require('fs');
const path = require('path');
const dirpath = require('./dir').dirpath;
// 子进程
let child_process = require('child_process');
let child = null

// 创建子进程
const createChild = () => {
    let child = child_process.fork('src/main/child/child.js');
    child.on('message', function(m) {
        console.log('message from child: ' + JSON.stringify(m));
        if (m.dirPath) {
            fileDisplay(m.dirPath, function(fileList) {
                mainWindow.send('files-reply', fileList);
            });
        }
    });
    child.send({ from: 'parent', pid: process.pid });
    child.on('exit', code => {
        console.log("关闭子进程")
        console.log('exit:', code);
    });
    return child
}
const monitoring = (f) => {
    // 通过关闭子进程的方式，取消fs.watch
    // 需要判断子进程是否存在
    console.log(f)
    console.error(child)
    if (child) {
        child.send({ exit: 'exit' });
    }
    child = createChild()
    console.log(child.pid)
    child.send({ dirPath: f });
}


//打开文件
ipcMain.on('open-message', function(e, arg) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled) {
            let files = result.filePaths
            if (files) {
                let f = files[0] //  let filePath = f.replace(f.split('/')[f.split('/').length-1],"");
                fileDisplay(f, function(fileList) {
                    e.sender.send('files-reply', fileList);
                });
                monitoring(f)
            }
        }

    }).catch(err => {
        console.log(err)
    })
});
const { pathParsePath } = require('../renderer/utils/node-operate-folder')
// 创建的时候，监控文件夹
ipcMain.on('files-monitoring', (e, arg) => {
    if (arg[0] && arg[0].filePath) {
        monitoring(pathParsePath(arg[0].filePath))
    }
})

//拖入文件
ipcMain.on('files-message', function(e, arg) {
    let filePath = path.resolve(dirpath);
    filePath = (JSON.parse(arg)).filePath;
    let oldPath = path.join((JSON.parse(arg)).filePath, (JSON.parse(arg)).fileName)
    // 只能是文件夹
    const stats = fs.statSync(oldPath);
    if (stats.isDirectory()) {
        filePath = oldPath
        fileDisplay(filePath, function(fileList) {
            e.sender.send('files-reply', fileList);
        });
        monitoring(filePath)
    } else {
        fileDisplay(filePath, function(fileList) {
            e.sender.send('files-reply', fileList);
        });
        monitoring(filePath)
    }
});
// 文件遍历
function fileDisplay(filePath, callback) {
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function(err, files) {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表
            let list = []
            files.forEach(function(filename) {
                //获取当前文件的绝对路径
                let filedir = path.join(filePath, filename);
                let isImg = function() {
                    let res = false;
                    let imgType = ['png', 'jpg', 'jpeg', 'gif', 'ico', 'JPG', 'JPEG', 'PNG', 'GIF', 'ICO', 'svg'];
                    for (let i in imgType) {
                        if (filename.split(".")[1] == imgType[i]) {
                            res = true
                        }
                    }
                    return res
                }
                if (isImg()) {
                    list.push({
                        filePath: filedir,
                        filename: path.basename(filedir),
                    })
                }
            });
            callback(list);
        }
    });
}
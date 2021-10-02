import {
  app,
  BrowserWindow,
  ipcMain
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
  `http://localhost:9080` :
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
    resizable: true,
    fullscreen: false,
    frame: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration:true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubframes: true,
      contextIsolation:false,
      enableRemoteModule:true,
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
ipcMain.on('close', e => mainWindow.close());


app.on('ready', createWindow)
const fs = require('fs');
const path = require('path');
const dirpath = require('./dir').dirpath;
const {
    dialog
} = require('electron');

//打开文件
ipcMain.on('open-message', function (e, arg) {
    dialog.showOpenDialog(mainWindow, {  properties: ['openFile', 'openDirectory']
}).then(result => {  console.log(result.canceled);  console.log(result.filePaths);
  let files=result.filePaths
  if (files) {
            var f = files[0];
            // var filePath = f.replace(f.split('/')[f.split('/').length-1],"");
            fileDisplay(f, function (fileList) {
                e.sender.send('files-reply', fileList);
            });
        }
}).catch(err => {  console.log(err)
})
  
    // dialog.showOpenDialog({
    //     properties: ['openFile', 'openDirectory']
    // }, function (files) {
    //     console.error(files)
    //     if (files) {
    //         var f = files[0];
    //         var filePath = f.replace(f.split('/')[f.split('/').length-1],"");
    //         fileDisplay(filePath, function (fileList) {
    //             e.sender.send('files-reply', fileList);
    //         });
    //     }
    // })
});

//拖入文件
ipcMain.on('files-message', function (e, arg) {
    let filePath = path.resolve(dirpath);
    filePath = (JSON.parse(arg)).filePath;
    fileDisplay(filePath, function (fileList) {
        e.sender.send('files-reply', fileList);
    });
});


function fileDisplay(filePath, callback) {
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表
            var list = []
            files.forEach(function (filename) {
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                var isImg = function () {
                    var res = false;
                    var imgType = ['png', 'jpg', 'jpeg', 'gif', 'ico', 'JPG', 'JPEG', 'PNG', 'GIF', 'ICO','svg'];
                    for (var i in imgType) {
                        if (filename.split(".")[1] == imgType[i]) {
                            res = true
                        }
                    }
                    return res
                }
                if (isImg()) {
                    list.push(filedir)

                }
            });
            callback(list);
        }
    });
}

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
const fs =require('fs')
let fsWait = false;

process.on('message', function(m){
    console.log('message from parent: ' + JSON.stringify(m));
    if(m.dirPath){
        fs.watch(m.dirPath, (event, filename) => {
                if (filename) {
                    if (fsWait) return;
                    fsWait = setTimeout(() => {
                        fsWait = false;
                    }, 1000);
                    console.log(`${process.pid} name${filename} file ${event}`);
                    if (event == 'rename') {
                        process.send({dirPath:m.dirPath})
                        // fileDisplay(f, function(fileList) {
                        //     e.sender.send('files-reply', fileList);
                        // });
                    }
                    // 性能不好，有变化，直接遍历
                }
            });
    }
});



// fs.watch('C://software//code//Images-Viewer//src//renderer', (event, filename) => {
//     if (filename) {
     
//         console.log(`${filename} file ${event}`);
       
//     }
// });


process.send({from: 'child',pid:process.pid})

// setTimeout(()=>{
//     console.log("关闭子进程")
//     process.exit(process.pid)
// },10000)
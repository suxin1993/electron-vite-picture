/*
 * @Author: your name
 * @Date: 2021-10-20 17:48:53
 * @LastEditTime: 2021-10-20 18:47:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/utils/qiniu/qiniuUpload.js
 */

const { net } = require('electron')

export function postQiNiuReander(data) {
    return new Promise(function(resolve, reject) {
        var XHR = XMLHttpRequest ? new XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP');
        XHR.onreadystatechange = function() {
            //readyState属性表示请求/响应过程的当前活动阶段。
            if (XHR.readyState == 4) {
                if ((XHR.status >= 200 && XHR.status < 300) || XHR.status == 304) {
                    try {
                        //获取数据
                        var response = XHR.responseText;
                        resolve(response);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error("Request was unsuccessful: " + XHR.statusText));
                }
            }
        }
        // 东南亚上传接口
        XHR.open('POST', 'http://up-as0.qiniup.com/', true);
        var formdata = new FormData();
        formdata.append('enctype', 'multipart/form-data')
        for (const key in data) {
            formdata.append(key, data[key])
        }
        Object.assign(formdata, data)
        XHR.send(formdata);
    })
}

// 发送请求,net发送post请求,(data数据中不能有中文字符串)
export async function requestPostMain(dataInfo) {
    return new Promise(function(resolve, reject) {
        const { url } = dataInfo
        let { data } = dataInfo
        const _url = new URL(url)
        // 请求参数
        data = JSON.stringify(data);
        var options = {
            protocol: _url.protocol,
            hostname: _url.host,
            path: `${_url.pathname}${_url.search}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': data.length
            }
        };
        var req = net.request(options, function(res) {
            res.setEncoding('utf8');
            var resData = [];
            res.on('data', function(chunk) {
                resData.push(chunk);
            });
            res.on('end', function() {
                var data = resData.join("");
                resolve(JSON.parse(data))
                console.error(JSON.parse(data))
            })
        });
        req.on('error', function(e) {
            reject(e)
            console.log('problem with request: ' + e.message);
        });
        // 发送请求
        req.write(data);
        req.end();
    })
}
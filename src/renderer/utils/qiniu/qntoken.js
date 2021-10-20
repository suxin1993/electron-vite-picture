/*
 * @Author: your name
 * @Date: 2021-10-20 16:36:07
 * @LastEditTime: 2021-10-20 16:49:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/utils/qiniu/qntoken.js
 */
const Buffer = require('./buffer/buffer.js');
const CryptoJS = require('./copyto/hmac-sha1.js');
const base64 = require('./copyto/enc-base64.js');



function base64ToUrlSafe(v) {
    return v.replace(/\//g, '_').replace(/\+/g, '-');
};

function token(opt) {
    let accessKey = opt.ak;
    let secretkey = opt.sk;
    let bucket = opt.bkt;
    let strdata = {
        "scope": bucket, //空间域名
        "deadline": Date.parse(new Date()) //当前时间截
    }
    let str = JSON.stringify(strdata);
    let encoded = Buffer.from(str).toString('base64');
    console.log('base64', encoded)
    let encodedStr = base64ToUrlSafe(encoded);
    console.log('encodedStr', str, encodedStr)
    //HmacSHA1加密
    let sign = CryptoJS.HmacSHA1(encodedStr, secretkey);
    console.log('sign', sign)
    let cod = base64.stringify(sign)
    console.log('cod', cod)
    let encodedSign = base64ToUrlSafe(cod);
    let token = accessKey + ':' + encodedSign + ':' + encodedStr;
    console.log('token', token)
    return token;
};


exports.hmacSha1 = function(encodedFlags, secretKey) {
    /*
     *return value already encoded with base64
     * */
    let hmac = crypto.createHmac('sha1', secretKey);
    hmac.update(encodedFlags);
    return hmac.digest('base64');
};

module.exports = {
    token: token
}
/*
 * @Author: your name
 * @Date: 2021-10-21 17:22:50
 * @LastEditTime: 2021-10-22 21:51:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /electron-vite-picture/src/renderer/utils/util.js
 */

//数组排序
export function compare(property, desc) {
    return function(a, b) {
        const value1 = a[property];
        const value2 = b[property];
        if (desc == true) {
            // 升序排列
            return value1 - value2;
        } else {
            // 降序排列
            return value2 - value1;
        }
    }
}
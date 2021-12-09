/*
 * @Author: your name
 * @Date: 2021-07-16 20:07:57
 * @LastEditTime: 2021-12-09 16:54:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/renderer/globalComent.js
 */
import Vue from 'vue'

//封装获取组件name的方法
const resolveComponentName = (component, componentFile = '') => {
    //获取到组件的name名称
    let componentName = (component.default || component).name
    if (!componentName && componentFile) {
        const fileName = componentFile.replace(/^.*\/([^/]+)\.js/, '$1')
        if (fileName !== 'index') {
            // 非 index.js 直接将文件名作为组件名
            componentName = fileName
        } else {
            // 文件名是index.js
            // 将该文件的最后一层的目录名作为组件名
            componentName = componentFile.replace(/^(.*\/)?([^/]+)\/index\.js$/, '$2')
        }
    }
    return componentName || ''
}

const context = require.context(
    '../globalcomponents', //这个是目录简写指的是你的组件存放的路径，
    true,
    /\.vue$/
    // 找到components文件夹下以.vue命名的文件
)


//遍历组件
context.keys().forEach(componentFilePath => {
    const component = context(componentFilePath)
    if (component.__ignore) {
        // true 表示该组件不会注册到vue组件中，但依然会被加载
        return
    }
    //获取组件中的name
    let componentName = resolveComponentName(component, componentFilePath)
    //组件名不存在打印错误
    if (!componentName) {
        console.error(`Component ${componentFilePath} register faild, the component name is undefined`)
        return
    }
    //挂载vue上，全局使用
    Vue.component(componentName, component.default || component)
})
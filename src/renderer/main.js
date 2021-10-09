import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import './assets/fonts/iconfont.css';
import './components/index';
import LogStore from "./utils/myappFucntion"
import './utils/viewer.min.css'


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

window.myApp = {}
window.myApp.LogStore = LogStore
/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')
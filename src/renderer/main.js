import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import './assets/fonts/iconfont.css';
import './components/index';
import LogStore from "./utils/myappFucntion"
import './utils/viewer.min.css'
import Toast from './components/prototypeComponents/toast/toast'


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$toast = Toast

window.myApp = {}
window.myApp.LogStore = LogStore
/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')
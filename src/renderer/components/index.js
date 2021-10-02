//组件全局注册
import Vue from 'vue'
import header from './layout-header.vue'
import container from './layout-container.vue'

Vue.component(header.name, header);
Vue.component(container.name, container);
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import 'iview/dist/styles/iview.css'
import { initWebSocket } from '@/protocol'

initWebSocket()
Vue.config.productionTip = false

new Vue({
  store,
  render: (h) => h(App)
}).$mount('#app')

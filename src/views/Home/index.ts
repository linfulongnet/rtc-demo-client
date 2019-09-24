import Vue from 'vue'
import Home from './Home.vue'
import { Layout, Header, Sider, Content } from 'iview'

const Modules: { [key: string]: any } = {
  Layout, Header, Sider, Content
}
// 循环注册全局组件
Object.keys(Modules).forEach(key => {
  Vue.component(key, Modules[key])
})

export default Home

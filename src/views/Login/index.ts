import Vue from 'vue'
import { Card, Form, FormItem, Input, Button, Icon } from 'iview'
import Login from './Login.vue'

const Modules: { [key: string]: any } = {
  Card, Form, FormItem, Input, Button, Icon
}
// 循环注册全局组件
Object.keys(Modules).forEach(key => {
  Vue.component(key, Modules[key])
})

export default Login

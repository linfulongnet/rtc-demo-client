import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface State {
  [key: string]: any

  isLogin: boolean
}

export default new Vuex.Store({
  state: {
    isLogin: true
  },
  mutations: {},
  actions: {}
})

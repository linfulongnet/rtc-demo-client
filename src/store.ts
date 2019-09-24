import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface State {
  [key: string]: any

  isLogin: boolean
}

const state: State = {
  isLogin: false
}

export default new Vuex.Store({
  state,
  mutations: {
    setLoginStatus(state, { isLogin }) {
      state.isLogin = isLogin
    }
  },
  actions: {}
})

<template>
  <div id="app">
    <Login v-if='!isLogin'></Login>
    <Home v-else></Home>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { State } from 'vuex-class'

  @Component({
    components: {
      Login: () => import('./views/Login'),
      Home: () => import('./views/Home')
    }
  })
  export default class App extends Vue {
    @State('isLogin') isLogin!: boolean
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #app, body, html {
    width: 100%;
    height: 100%;
  }
</style>

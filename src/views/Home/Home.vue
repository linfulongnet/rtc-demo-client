<template>
  <Layout v-else class='app-layout'>
    <Header></Header>
    <Layout>
      <Sider></Sider>
      <Content></Content>
    </Layout>
  </Layout>
</template>

<script lang='ts'>
  import { Component, Vue } from 'vue-property-decorator'
  import { State } from 'vuex-class'

  export default class Home extends Vue {
  }
</script>

<style scoped lang='scss'>
  .app-layout {
    width: 100%;
    height: 100%;
  }
</style>

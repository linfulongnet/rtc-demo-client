<template>
  <Layout v-else class='app-layout'>
    <Header></Header>
    <Layout>
      <Sider></Sider>
      <Content></Content>
    </Layout>
  </Layout>
</template>

<script>
  export default {
    name: 'Home'
  }
</script>

<style scoped lang='scss'>
  .app-layout {
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div id="app">
    <TopNav></TopNav>
    <router-view></router-view>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue';

export default {
  name: "app",
  components: { TopNav }
}
</script>

<style lang="less">
@import './assets/css/index.less';


</style>

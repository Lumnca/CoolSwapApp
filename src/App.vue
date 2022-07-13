<template>
  <div id="app">
    <TopNav></TopNav>
   <div class="box-body">
     <router-view></router-view>
   </div>
    <Footer></Footer>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue';
import Footer from './components/Footer.vue';

export default {
  name: "app",
  components: { TopNav, Footer }
}
</script>

<style lang="less">
@import './assets/css/index.less';
.box-body{
  min-height: 640px;
}

</style>

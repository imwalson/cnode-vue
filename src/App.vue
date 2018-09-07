<template>
  <div id="app">
    <!-- <keep-alive>
      <router-view></router-view>
    </keep-alive> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'app',
  mounted(){

  },
  methods: {
    
  }
}
</script>
<style lang="less" type="text/less" rel="stylesheet/less">
  /* 通用样式引入 */
  @import "assets/css/index.less";
  @import "assets/css/main.less";
  @import "assets/css/font-awesome.css";
</style>

<template>
  <div class="page-about">
    <mu-appbar style="width: 100%;">
      <mu-button icon slot="left" @click.native="goBack">
        <mu-icon value=":fa fa-chevron-left"></mu-icon>
      </mu-button>
      {{ title }}
    </mu-appbar>

    <div class="content">
      <div class="section ui-border-b">
        <h3 class="title">关于项目</h3>
        <p class="desc">该项目基于Cnodejs的api，采用vue2.0全家桶构建。</p>
      </div>
      <div class="section ui-border-b">
        <h3 class="title">开源主页</h3>
        <p class="desc">https://github.com/imwalson/cnode-vue</p>
      </div>
      <div class="section ui-border-b">
        <h3 class="title">CNode社区官网</h3>
        <p class="desc">https://cnodejs.org</p>
      </div>
      <div class="section ui-border-b">
        <h3 class="title">当前版本</h3>
        <p class="desc">1.0</p>
      </div>
      <div class="section ui-border-b">
        <h3 class="title">联系方式</h3>
        <p class="desc">imwalson@163.com</p>
      </div>
    </div>
  </div>
</template>


<style lang="less">
  @import "../assets/css/fn.less";

  .page-about {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .content {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      .section {
        padding: 20px 15px;
        overflow: hidden;

        .title {
          font-weight: 700;
          color: #2c3e50;
          font-size: 16px;
          line-height: 1.5;
        }
        .desc {
          padding-top: 15px;
          font-size: 14px;
        }
      }
    }
  }
</style>

<script>
  import base from '../mixins/base'
  import api from '../api'
  import _ from 'lodash'

  export default {
    name: 'aboutPage',
    mixins: [base],
    data () {
      return {
        title: '关于',
      }
    },
  }
</script>

<template>
  <div class="page-login">
    <mu-appbar style="width: 100%;">
      <mu-button icon slot="left" @click.native="goBack">
        <mu-icon value=":fa fa-chevron-left"></mu-icon>
      </mu-button>
      <mu-button icon slot="right"></mu-button>
      {{ title }}
    </mu-appbar>

    <div class="content">
      <div class="login-form">
        <div class="form-row">
          <mu-text-field 
            class="text-field" 
            v-model="accessToken" 
            placeholder="Access Token"
            :error-text="error"
            @blur="checkInput"
            @keyup="checkInput"
          ></mu-text-field>
        </div>
        <div class="form-row">
          <mu-button full-width color="primary" @click.native="submit">登录</mu-button>
        </div>
        <div class="form-row" v-if="browserContext === 'QA'">
          <mu-button full-width @click.native="qaScanQr">扫码登录</mu-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  @import "../assets/css/fn.less";

  .page-login {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;

    .mu-appbar {

      .mu-appbar-title {
        padding: 0;
        text-align: center;
      }
    }

    .content {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      .login-form {
        padding: 0 15px;
        margin-top: 80px;

        .form-row {
          padding-top: 10px;

          .text-field {
            display: block;
            width: 100%;
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>

<script>
  import {
    mapActions,
    mapState,
    mapGetters
  } from 'vuex'
  import base from '../mixins/base'
  import user from '../mixins/user'
  import quickapp from '../mixins/quickapp'
  import api from '../api'
  import _ from 'lodash'

  export default {
    name: 'loginPage',
    mixins: [base,user,quickapp],
    data () {
      return {
        title: '登录',
        error: '',
        accessToken: '',
        redirect: '/'
      }
    },
    computed: {
      ...mapGetters([
        'browserContext',
      ]),
    },
    mounted(){
      this.redirect = this.$route.query.redirect || '';

      if(this.browserContext != 'QA') return;
      if ( window.system && window.system.postMessage) {
        window.system.postMessage( 'vue spa login page loaed' );
      }else{
        alert('system.postMessage not defined')
      }
    },
    methods: {
      ...mapActions([
        'setAccountInfo',
        'setAccessToken'
      ]),
      checkInput() {
        if(!this.accessToken.length){
          this.error = '请输入Access Token';
        }else{
          this.error = '';
        }
      },
      qaScanQr() {
        //alert(this.browserContext)
        if(this.browserContext != 'QA') return;
        this.qrRes = '';
        if ( window.system && window.system.postMessage) {
          window.system.postMessage( JSON.stringify({
            type: 'openQr'
          }) );
        }else{
          alert('system.postMessage not defined')
        }
        
      },
      submit() {
        var _this = this;
        if(!this.accessToken){
          this.error = '请输入Access Token';
          this.$toast.error('请输入Access Token');
          return;
        }
        api.checkAccessToken({
          method: 'post',
          data: {
            accesstoken: this.accessToken
          }
        }).then((res)=>{
          if(res.success){
            _this.$toast.success('登录成功');
            let user = {
              id: res.id,
              loginname: res.loginname,
              avatar_url: res.avatar_url
            };
            // 更新用户信息到cookies
            _this.setToken(_this.accessToken);
            _this.setUserInfo(user);
            // store里设置用户信息
            _this.setAccessToken(_this.accessToken);
            _this.setAccountInfo(user);
            _this.redirectTo(_this.redirect);
          }
        }).catch((err)=>{
          console.log(err);
          _this.$toast.error(err.error_msg || '登录失败');
        })
      }
    },
    watch: {
      qrRes: function(val,oldVal){
        if(val){
          this.accessToken = val;
        }
      },
    }
  }
</script>

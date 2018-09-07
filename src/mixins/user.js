import router from '../router'
import api from '../api'
import axios from 'axios';
import {
  mapActions,
  mapState,
  mapGetters
} from 'vuex'

export default {
  data () {
    return {
      
    }
  },
  computed: {
    // 从 store 获取的数据
    ...mapGetters([
      'browserContext',
    ])
  },
  methods: {
    // 从 store 获取的方法
      ...mapActions([
      ]),
    // 自动登录
    oauth() {
      let openLogined = this.$cookie.get('openLogined') || ''; 
      let token = this.$cookie.get('token') || ''; 
      // 已经登陆过
      if(openLogined && token) {
        // S助手内要同步订单到三星那边
        // if(this.browserContext === 'SAMSUNG'){
        //   axios.get('/samsung/test/order-sync')
        //   .then(function(res){
        //     console.log(res.data);
        //   })
        //   .catch(function(err){
        //     console.log(err);
        //   })
        // }
        return;
      }

      switch (this.browserContext) {
        // S助手内
        case 'SAMSUNG':
          this.samsungOauth();
          break;
        // 微信内
        case 'WECHAT':
          this.wechatOauth();
          break;
        // 默认状态跳转到手机登录页面
        default:
          router.push({path: '/login'})
          break;
      } 
    },
    // 三星优选oauth
    samsungOauth(redirect) {
      let saLogin = this.$cookie.get('saLogin') || ''; 
      let saUid = this.$cookie.get('saUid') || ''; 
      console.log(saLogin);
      // 要跳转回去的页面写到cookies里
      let ssOauthFrom = redirect || encodeURIComponent(location.href);
      this.$cookie.set('ss-oauth-from',ssOauthFrom ,{ expires:  '99Y' });

      // 三星账号已登录，执行oauth (等待 cookie 写入完成)
      if(saLogin){
        var cp = 'samsungYouxuan';
        var callback = 'https://samsungyx.com/samsung/oauth-result';
        setTimeout(() => {
          location.assign(`action://samsung.account.login?cp=${cp}&callback=${callback}`);
        }, 300);
      }else{
        // 走正常登录
        router.push({path: '/login'})
      }

    },
    // 同步订单状态到三星 （中台服务同步，前端无需再发起同步）
    callSamsungOrderSync(ids,his) {
      // if(this.browserContext != 'SAMSUNG') return;

      // let saLogin = this.$cookie.get('saLogin') || ''; 
      // let saUid = this.$cookie.get('saUid') || ''; 
      // let tradeIds = ids; 
      // var history = his || false; 
      // let token = this.$cookie.get('token') || ''; 
      // if(saLogin){
      //   var url = '/samsung/order-sync';
      //   axios.post(url,{
      //     history,
      //     tradeIds,
      //     token
      //   })
      //   .then(function(res){
      //     console.log('三星订单同步返回结果：');
      //     console.log(res.data);
      //   })
      //   .catch(function(err){
      //     console.log(err);
      //   })
      // }
    },
    // 微信oauth
    wechatOauth(redirect) {
      var oauthFrom = redirect || location.href;
      location.assign(`/wechat/open-login?r=${oauthFrom}`);
    },
    // 从全局 localhost 中获取缓存的token (取不到自动跳转oauth登录)
    getToken() {
      //let token = this.$ls.get('token', '');
      let token = this.$cookie.get('token') || '';
      if(!token){
        // 自动登录
        this.oauth();
        //this.navTo('login');
        return null;
      }
      return token;
    },
    // 从全局 localhost 中获取缓存的token (不自动跳转)
    getTokenNoRedirect() {
      //let token = this.$ls.get('token', '');
      let token = this.$cookie.get('token') || '';
      return token;
    },
    setToken(token,cb) {
      //this.$ls.set('token',token);
      this.$cookie.set('token',token ,{ expires:  '99Y' });
      cb && cb();
    },
    getUserInfo() {
      //let user = this.$ls.get('user', {});
      let user = {};
      let c = this.$cookie.get('user') || '';
      try {
        if(c){
          user = JSON.parse(c);
        }
      } catch (error) {
        console.log(error);
      }
      return user;
    },
    setUserInfo(user,cb) {
      //this.$ls.set('user',user);
      this.$cookie.set('user',JSON.stringify(user) ,{ expires:  '99Y' });
      cb && cb();
    },

    // 退出登录
    logout() {
      let _this = this;
      // 需要清除的cookies
      let toClear = 'user token ss-oauth-from openLogined authenticateUserID samsung_authToken wx_openid wx_accessToken'.split(' ');
      toClear.forEach(function(key){
        _this.$cookie.delete(key);
      })
      window.bto_tracker.logout();
      // alert('退出成功');
      // 跳转到首页
      setTimeout(() => {
        location.assign('/');
      }, 500);
      
    },

    // 退出登录(解除绑定)
    openLogout() {
      let _this = this;

      if(this.browserContext === 'CUSTOM'){
        // 需要清除的cookies
        let toClear = 'user token ss-oauth-from openLogined authenticateUserID samsung_authToken wx_openid wx_accessToken'.split(' ');
        toClear.forEach(function(key){
          _this.$cookie.delete(key);
        })
        window.bto_tracker.logout();
        // 跳转到登录页
        setTimeout(() => {
          location.assign('/user');
        }, 500);
      }
      else if (this.browserContext === 'SAMSUNG') { // 三星帐号解绑
        api.samsungOpenLogout({
          params: {},
          data: {},
          headers: {}
        })
        .then(function(res){
          if(res.success){
            // 需要清除的cookies
            let toClear = 'user token ss-oauth-from openLogined authenticateUserID samsung_authToken wx_openid wx_accessToken'.split(' ');
            toClear.forEach(function(key){
              _this.$cookie.delete(key);
            })
            window.bto_tracker.logout();
            // 跳转到登录页
            setTimeout(() => {
              location.assign('/user');
            }, 500);

            Toast('退出成功');
          }else {
            Toast('退出失败：' + res.error);
          }
        })
        .catch(function(error){
          Toast('退出失败：' + error.message);
        })
      }
      else if (this.browserContext === 'WECHAT') { // 微信帐号解绑
        api.wechatOpenLogout({
          params: {},
          data: {},
          headers: {}
        })
        .then(function(res){
          if(res.success){
            // 需要清除的cookies
            let toClear = 'user token ss-oauth-from openLogined authenticateUserID samsung_authToken wx_openid wx_accessToken'.split(' ');
            toClear.forEach(function(key){
              _this.$cookie.delete(key);
            })
            window.bto_tracker.logout();
            // 跳转到登录页
            setTimeout(() => {
              location.assign('/user');
            }, 500);
            
            Toast('退出成功');
          }else {
            Toast('退出失败：' + res.error);
          }
        })
        .catch(function(error){
          Toast('退出失败：' + error.message);
        })
      }
      
    }

  }
}
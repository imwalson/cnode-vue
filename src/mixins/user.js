import router from '../router'
import api from '../api'
import axios from 'axios';

export default {
  data () {
    return {
      
    }
  },
  methods: {
    // 获取缓存的token (取不到自动跳转登录)
    getToken() {
      let token = this.$cookie.get('token') || '';
      if(!token){
        router.push('/login');
        return null;
      }
      return token;
    },
    // 获取缓存的token (不自动跳转)
    getTokenNoRedirect() {
      let token = this.$cookie.get('token') || '';
      return token;
    },
    setToken(token,cb) {
      this.$cookie.set('token',token ,{ expires:  '99Y' });
      cb && cb();
    },
    getUserInfo() {
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
      this.$cookie.set('user',JSON.stringify(user) ,{ expires:  '99Y' });
      cb && cb();
    },
    // 退出登录
    logout() {
      let _this = this;
      // 需要清除的cookies
      let toClear = 'user token'.split(' ');
      toClear.forEach(function(key){
        _this.$cookie.delete(key);
      })
      // 跳转到首页
      setTimeout(() => {
        location.assign('/');
      }, 300);
      
    },

  }
}
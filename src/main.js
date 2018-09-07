// 解决“Promise”未定义"
import promise from 'es6-promise';
promise.polyfill();

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import VueLocalStorage from 'vue-ls';
Vue.use(VueLocalStorage);

import VueCookie from 'vue-cookie';
// Tell Vue to use the plugin
Vue.use(VueCookie);

// 加载MuseUI组件
import MuseUI from 'muse-ui';
import theme from 'muse-ui/lib/theme';
import 'muse-ui/dist/muse-ui.css';
theme.add('teal', {
  primary: '#42b983',
  secondary: '#ff4081',
  success: '#4caf50',
  warning: '#ffeb3b',
}, 'light');
theme.use('teal');
Vue.use(MuseUI);
// 加载MuseUI插件
import Toast from 'muse-ui-toast';
import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';
import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
import Loading from 'muse-ui-loading';
window.Toast = Toast;
window.Loading= Loading;
window.Message= Message;


function autoFontSize() {
  // 基于750宽度响应式布局
  var devieWidth = Math.min(750,document.documentElement.clientWidth,document.documentElement.clientHeight);
  var fonSize = devieWidth > 1080 ? 144 : devieWidth / 7.5;
  document.documentElement.style.fontSize = fonSize + 'px';
}
/* eslint-disable no-new */
new Vue({
  created(){
    autoFontSize();
    // window.onresize = function() {
    //   autoFontSize()
    // };
  },
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

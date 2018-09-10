import Vue from 'vue'
import Router from 'vue-router'
import api from '../api'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      component: resolve => require(['../view/index.vue'], resolve), //首页
      name: 'home',
      meta: {
        title: '首页',
        keepAlive: true
      }
    },
    {
      path: '/topic/:id',
      component: resolve => require(['../view/topic.vue'], resolve), //主题详情
      name: 'topic',
      meta: {
        title: '主题'
      }
    },
    {
      path: '/about',
      component: resolve => require(['../view/about.vue'], resolve), // 关于
      name: 'about',
      meta: {
        title: '关于'
      }
    },
    {
      path: '/login',
      component: resolve => require(['../view/login.vue'], resolve), // 登录
      name: 'login',
      meta: {
        title: '登录'
      }
    },
    {
      path: '/user/:username',
      component: resolve => require(['../view/user.vue'], resolve), // 用户信息
      name: 'user',
      meta: {
        title: '用户信息'
      }
    },
    {
      path: '/message',
      component: resolve => require(['../view/message.vue'], resolve), // 消息
      name: 'message',
      meta: {
        title: '消息'
      }
    },
    
  ],
  scrollBehavior: function (to, from, savedPosition) {
    // 允许锚点定位
    if (to.hash) {
      return {
        // 這個是透過 to.hash 的值來找到對應的元素
        // 照你的 html 來看是不用多加處理這樣就可以了
        // 例如你按下 #3 的連結，就會變成 querySelector('#3')，自然會找到 id = 3 的元素
        selector: to.hash
      }
    }
    //console.log(savedPosition);
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// router.beforeEach((to, from, next) => {
//   // 权限拦截
//   const $cookie = router.app.$cookie;
//   if(to.meta.auth){
//     let token = $cookie.get('token') || '';
//     let browserContext = store.state.global.browserContext || '';

//     // 无token就跳到登录
//     if(!token){
      
//     }else {
//       // 有token但无权限也跳到登录
      
//     }
//   }
//   else {
//     next();
//   }
// })

router.afterEach((to, from) => {
  // 更改页面title
  var title = 'CNode：Node.js专业中文社区';
  if (to.meta.title) {
    title += (' | ' + to.meta.title)
  }
  document.title = title;
  // 统计代码
  // var API_H = location.protocol + '//' + location.host;
  // if(_czc){
  //   _czc.push(['_trackPageview', to.fullPath, API_H + from.fullPath]);
  // }
})

export default router;

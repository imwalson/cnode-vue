import api from '../../../api';

import * as type from './mutation-types'

export default {
  // 更改tab页面的滚动高度
  setScrollTop({            
    commit,
    state
  }, payload) {
    commit(type.SET_SCROLL_TOP, payload);
  },
  // 设置全局token
  setAccessToken({            
    commit,
    state
  }, payload) {
    commit(type.SET_TOKEN, payload);
  },
  // 设置全局token
  setAccountInfo({            
    commit,
    state
  }, payload) {
    commit(type.SET_USER_INFO, payload);
  },
  // 设置全局上下文CONTEXT
  setBrowserContext({            
    commit,
    state
  }, payload) {
    //console.log('浏览器环境：' + payload);
    commit(type.SET_BROWSER_CONTEXT, payload);
  },

}
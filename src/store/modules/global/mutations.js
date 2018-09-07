import * as type from './mutation-types'

export default {
  // 更改首页滚动高度
  [type.SET_SCROLL_TOP](state, payload) {
    state.scrollTop = payload;
  },
  // 更改用户信息
  [type.SET_USER_INFO](state, payload) {
    state.userInfo = payload;
  },
  // 更改全局TOKEN
  [type.SET_TOKEN](state, payload) {
    state.token = payload;
  },
  // 更改上下文CONTEXT
  [type.SET_BROWSER_CONTEXT](state, payload) {
    state.browserContext = payload;
  }
}

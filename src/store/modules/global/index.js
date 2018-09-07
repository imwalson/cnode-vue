// 全局状态
import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'

const state = {     
  // 首页滚动高度
  scrollTop: 0,
  userInfo: {},
  token: '' ,
  // 所处环境： 'WECHAT'、  'ALIPAY'、 'CUSTOM'
  browserContext: 'CUSTOM'
};

export default {
  state,
  mutations,
  actions,
  getters
}

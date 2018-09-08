import apiRequest from './request'

const API_ROOT = 'https://cnodejs.org/api/v1'

const urlList = {
  TopicList: '/topics',
  topicDetails: '/topic',
  topicCollect: '/topic_collect/collect',
  checkToken: '/accesstoken',
  userInfo: '/user',
}

export default {
  /**
   * 获取最热帖子列表
   */
  getTopicList(options) {
    return apiRequest( API_ROOT + urlList.TopicList, options)
  },
  /**
   * 获取帖子详情
   */
  getTopicDetails(id,options) {
    return apiRequest( API_ROOT + urlList.topicDetails + '/' + id, options)
  },
  /**
   * 验证accessToken
   */
  checkAccessToken(options) {
    return apiRequest( API_ROOT + urlList.checkToken, options)
  }
}


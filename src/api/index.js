import apiRequest from './request'

const API_ROOT = 'https://cnodejs.org/api/v1'

const urlList = {
  TopicList: '/topics',
  topicDetails: '/topic',
  checkToken: '/accesstoken',
  userInfo: '/user',
  topicCollect: '/topic_collect',
  topicCollectAdd: '/topic_collect/collect',
  topicCollectDel: '/topic_collect/de_collect',
  messages: '/messages',
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
  },
  /**
   * 获取用户信息
   */
  getUserInfo(username,options) {
    return apiRequest( API_ROOT + urlList.userInfo + '/' + username, options)
  },
  /**
   * 获取用户收藏帖子
   */
  getTopicCollect(username,options) {
    return apiRequest( API_ROOT + urlList.topicCollect + '/' + username, options)
  },
  /**
   * 添加到收藏
   */
  addCollect(options) {
    return apiRequest( API_ROOT + urlList.topicCollectAdd, options)
  },
  /**
   * 移除收藏
   */
  delCollect(options) {
    return apiRequest( API_ROOT + urlList.topicCollectDel, options)
  },
  /**
   * 评论点赞/取消点赞
   */
  replyUps(id,options) {
    return apiRequest( `${API_ROOT}/reply/${id}/ups` , options)
  },
  /**
   * 移除收藏
   */
  getMessages(options) {
    return apiRequest( API_ROOT + urlList.messages, options)
  },
}


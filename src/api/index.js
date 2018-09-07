import apiRequest from './request'

const API_ROOT = 'https://cnodejs.org/api/v1'

const urlList = {
  TopicList: '/topics',
  topicDetails: '/topic',
  topicCollect: '/topic_collect/collect'
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
   * 获取回复详情
   */
  // getRepliys(topic_id) {
  //   return apiRequest( API_ROOT + urlList.repliyShow,{
  //     params: {
  //       topic_id: topic_id,
  //       page: 1,
  //       page_size: 100
  //     }
  //   })
  // }
}


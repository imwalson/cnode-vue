<template>
  <div class="page-topic">
    <mu-appbar style="width: 100%;">
      <mu-button icon slot="left" @click.native="goBack">
        <mu-icon value=":fa fa-angle-left"></mu-icon>
      </mu-button>
      {{ title }}
    </mu-appbar>

    <div class="topic-content" v-if="topicData.author">
      <h3 class="topic-title bg-white">{{ topicData.title || '' }}</h3>
      <div class="info-area bg-white">
        <div class="avator">
          <img :src="topicData.author.avatar_url">
        </div>
        <div class="author">
          <span :class="'tag ' + topicData.tab">{{ tabMap[topicData.tab] || '暂无' }}</span>
          <span class="name">{{ topicData.author.loginname }}</span>
        </div>
        <div class="post-time">{{ timeagoDate(topicData.create_at) }}创建•{{ topicData.visit_count }}次浏览</div>
      </div>
      <div class="markdown-body bg-white" v-html="topicData.content || ''"></div>

      <div class="reply bg-white mt-10">
        <div class="empty text-center" v-if="!(topicData.replies && topicData.replies.length)">暂无回复</div>
        <template v-if="topicData.replies && topicData.replies.length">
          <div class="reply-title">{{ topicData.replies.length }}条回复</div>
          <div class="reply-list">
            <div 
              v-for="item in topicData.replies"
              :key="item.id"
              class="reply-item ui-border-t"
            >
              <div class="header">
                <div class="avator">
                  <img :src="item.author.avatar_url">
                </div>
                <div class="author">
                  <span class="name">{{ item.author.loginname }}</span>
                </div>
                <div class="post-time">{{ timeagoDate(item.create_at) }}</div>
              </div>
              <div class="content">
                <div class="markdown-body bg-white" v-html="item.content || ''"></div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>


<style lang="less">
  @import "../assets/css/fn.less";
  @import "../assets/css/github-markdown.less";

  .page-topic {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .topic-content {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      .topic-title {
        padding: 15px;
        font-size: 18px;
        color: #2c3e50;
        line-height: 1.5;
      }

      .info-area {
        position: relative;
        height: 40px;

        .avator {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 20px;
          overflow: hidden;
          left: 15px;
          top: 0;

          img {
            display: block;
            width: 40px;
            height: 40px;
          }
        }
        .author {
          position: absolute;
          height: 20px;
          line-height: 20px;
          border-radius: 20px;
          overflow: hidden;
          left: 70px;
          top: 0;
          color: #34495e;
          font-size: 14px;

          .tag {
            margin: 0 3px;
            height: 20px;
            line-height: 20px;
            border-radius: 2px;
            background-color: #e5e5e5;
            color: #fff;
            padding: 0 4px;
            font-size: 12px;
          }
          .tag.top {
            background-color: @uiColorRed;
          }
          .tag.share {
            background-color: @uiColorPrimary;
          }
          .tag.ask {
            background-color: @uiColorBlue;
          }
          .tag.job {
            background-color: @uiColorPurple;
          }
          .tag.good {
            background-color: @uiColorOrange;
          }
        }
        .post-time {
          position: absolute;
          height: 20px;
          line-height: 20px;
          border-radius: 20px;
          overflow: hidden;
          left: 70px;
          top: 20px;
          color: #34495e;
          font-size: 12px;
        }

      }

      .markdown-body {
        padding: 15px;
      }

      .reply {
        overflow: hidden;
        background-color: #ffffff;

        .markdown-body {
          padding: 0 15px;
          line-height: 1.2;
          font-size: 14px;
        }

        .empty {
          padding: 20px;
          font-size: 14px;
          color: #666666;
        }

        .reply-title {
          height: 40px;
          line-height: 40px;
          color: #2c3e50;
          font-size: 15px;
          padding: 0 15px;
        }
        .reply-item {
          background-color: #ffffff;
          overflow: hidden;

          .header {
            position: relative;
            padding: 15px 0;
            height: 70px;

            .avator {
              position: absolute;
              width: 40px;
              height: 40px;
              border-radius: 20px;
              overflow: hidden;
              left: 15px;
              top: 15px;

              img {
                display: block;
                width: 40px;
                height: 40px;
              }
            }
            .author {
              position: absolute;
              height: 20px;
              line-height: 20px;
              border-radius: 20px;
              overflow: hidden;
              left: 70px;
              top: 15px;
              color: #34495e;
              font-size: 14px;
            }
            .post-time {
              position: absolute;
              height: 20px;
              line-height: 20px;
              border-radius: 20px;
              overflow: hidden;
              left: 70px;
              top: 35px;
              color: #34495e;
              font-size: 12px;
            }
          }
          .content {
            font-size: 14px;
          }
        }
      }
    }
  }
</style>

<script>
  import base from '../mixins/base'
  import api from '../api'
  import _ from 'lodash'

  export default {
    name: 'topicPage',
    components: {
      
    },
    mixins: [base],
    data () {
      return {
        title: '主题',
        tabMap: {
          ask: '问答',
          share: '分享',
          job: '招聘',
          good: '精华'
        },
        topicId: '',
        topicData: {}
      }
    },
    mounted(){
      this.initPageData();
    },
    methods: {
      // 初始化页面数据
      initPageData() {
        var _this = this;
        this.topicId = this.$route.params.id || '';
        this.getTopicDetails();
      },
      // 获取主题数据
      getTopicDetails(cb) {
        var _this = this;
        try {
          // 检查token
          // let token = this.getToken();
          // if(!token){
            
          //   return;
          // }
          api.getTopicDetails(this.topicId).then(function(res){
            if(res.success){
              _this.topicData = res.data;
              cb && cb(res.data);
            }else{
              console.log(res);
            }
          }).catch(function(error){
            console.log(error);
          })
        } catch (error) {
          console.log(error);
        }
      },
    },
  }
</script>

<template>
  <div class="page-topic">
    <mu-appbar style="width: 100%;">
      <mu-button icon slot="left" @click.native="goBack">
        <mu-icon value=":fa fa-chevron-left"></mu-icon>
      </mu-button>
      {{ title }}
    </mu-appbar>

    <div class="topic-content" v-if="topicData.author">
      <h3 class="topic-title bg-white">{{ topicData.title || '' }}</h3>
      <div class="info-area bg-white">
        <div class="avator" @click="navTo('/user/' + topicData.author.loginname)">
          <img :src="topicData.author.avatar_url">
        </div>
        <div class="author">
          <span :class="'tag ' + topicData.tab">{{ tabMap[topicData.tab] || '暂无' }}</span>
          <span class="name">{{ topicData.author.loginname }}</span>
        </div>
        <div class="post-time">{{ timeagoDate(topicData.create_at) }}创建•{{ topicData.visit_count }}次浏览</div>

        <div 
          v-if="!topicData.is_collect" 
          class="star-btn fa fa-heart-o" 
          @click="addToFavorite" 
        ></div>
        <div 
          v-if="topicData.is_collect" 
          class="star-btn active fa fa-heart" 
          @click="removeFavorite" 
        ></div>
      </div>
      <div class="markdown-body bg-white" v-html="topicData.content || ''"></div>

      <div class="reply bg-white mt-10">
        <div class="empty text-center" v-if="!(topicData.replies && topicData.replies.length)">暂无回复</div>
        <template v-if="topicData.replies && topicData.replies.length">
          <div class="reply-title">{{ topicData.replies.length }}条回复</div>
          <div class="reply-list">
            <div 
              v-for="(item,index) in topicData.replies"
              :key="item.id"
              class="reply-item ui-border-t"
            >
              <div class="header">
                <div class="avator" @click="navTo('/user/' + item.author.loginname)">
                  <img :src="item.author.avatar_url">
                </div>
                <div class="author">
                  <span class="name">{{ item.author.loginname }}</span>
                </div>
                <div class="post-time">{{ timeagoDate(item.create_at) }}</div>

                <div class="up-icon">
                  <span class="fa fa-thumbs-up" v-if="item.is_uped" @click="cancelUpReply(index,item.id)"></span>
                  <span class="fa fa-thumbs-o-up" v-if="!item.is_uped" @click="upReply(index,item.id)"></span>
                  <span>{{ item.ups.length }}</span>
                </div>
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

        .star-btn {
          position: absolute;
          width: 30px;
          height: 30px;
          line-height: 30px;
          right: 20px;
          top: 5px;
          color: #666;
          font-size: 20px;
          text-align: right;
        }
        .star-btn.active {
          color: @uiColorRed;
        }

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

            .up-icon {
              position: absolute;
              width: 40px;
              height: 20px;
              line-height: 20px;
              right: 20px;
              top: 25px;
              color: #34495e;
              font-size: 14px;

              .fa {
                font-size: 20px;
                padding-right: 5px;
              }
            }

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
  import {
    mapActions,
    mapState,
    mapGetters
  } from 'vuex'
  import base from '../mixins/base'
  import user from '../mixins/user'
  import api from '../api'
  import _ from 'lodash'

  export default {
    name: 'topicPage',
    mixins: [base,user],
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
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
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
          let token = this.getTokenNoRedirect() || '';
          let options = {
            params: {
              mdrender: true
            }
          };
          if(token){
            options.params.accesstoken = token;
          }
          api.getTopicDetails(this.topicId,options).then(function(res){
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
      // 添加收藏
      addToFavorite() {
        var _this = this;
        let token = this.getTokenNoRedirect() || '';
        if(!token) return;
        api.addCollect({
          method: 'post',
          data: {
            accesstoken: token,
            topic_id: this.topicId
          }
        }).then(function(res){
          if(res.success){
            _this.topicData.is_collect = true;
            _this.$toast.success('收藏成功');
          }else{
            _this.$toast.success('收藏失败');
          }
        }).catch(function(error){
          console.log(error);
          _this.$toast.success('收藏失败');
        })
      },
      // 取消收藏
      removeFavorite() {
        var _this = this;
        let token = this.getTokenNoRedirect() || '';
        if(!token) return;
        api.delCollect({
          method: 'post',
          data: {
            accesstoken: token,
            topic_id: this.topicId
          }
        }).then(function(res){
          if(res.success){
            _this.topicData.is_collect = false;
            _this.$toast.success('取消收藏成功');
          }else{
            _this.$toast.success('取消收藏失败');
          }
        }).catch(function(error){
          console.log(error);
          _this.$toast.success('取消收藏失败');
        })
      },
      // 评论点赞
      upReply(index,id) {
        var _this = this;
        let token = this.getTokenNoRedirect() || '';
        if(!token) return;
        api.replyUps(id,{
          method: 'post',
          data: {
            accesstoken: token
          }
        }).then(function(res){
          if(res.success){
            _this.topicData.replies[index].is_uped = true;
            _this.topicData.replies[index].ups.push(_this.userInfo.id);
          }
        }).catch(function(error){
          console.log(error);
        })
      },
      // 评论取消点赞
      cancelUpReply(index,id) {
        var _this = this;
        let token = this.getTokenNoRedirect() || '';
        if(!token) return;
        api.replyUps(id,{
          method: 'post',
          data: {
            accesstoken: token
          }
        }).then(function(res){
          if(res.success){
            _this.topicData.replies[index].is_uped = false;
            _this.topicData.replies[index].ups.splice(_this.topicData.replies[index].ups.length-1,1);
          }
        }).catch(function(error){
          console.log(error);
        })
      }
    },
  }
</script>

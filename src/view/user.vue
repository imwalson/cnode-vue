<template>
  <div class="page-user">
    <mu-appbar style="width: 100%;">
      <mu-button icon slot="left" @click.native="goBack">
        <mu-icon value=":fa fa-chevron-left"></mu-icon>
      </mu-button>
      {{ title }}
    </mu-appbar>

    <div class="content">
      <div class="user-info" v-if="userData.avatar_url">
        <mu-avatar class="avatar" :size="100" @click.native="navTo('/user/' + userInfo.loginname)">
          <img :src="userData.avatar_url">
        </mu-avatar>
        <p class="user-name">{{ userData.loginname }}</p>
        <div class="create-at">{{ getDayString(userData.create_at) }}</div>
        <div class="score">积分: {{ userData.score }}</div>
      </div>
      
      <mu-tabs 
        :value.sync="activeTab" 
        inverse 
        full-width
        class="bg-white"
        color="primary" 
        text-color="rgba(0, 0, 0, .54)"  
        center
      >
        <mu-tab>最近回复</mu-tab>
        <mu-tab>最新发布</mu-tab>
        <mu-tab>话题收藏</mu-tab>
      </mu-tabs>

      <div class="tab-content" v-if="activeTab === 0">
        <div class="topic-list bg-white" v-if="userData.recent_replies && userData.recent_replies.length">
          <div 
            class="topic-item ui-border-b" 
            v-for="item in userData.recent_replies" 
            :key="item.id"
            @click="navTo('/topic/' + item.id)"
          >
            <div class="avator">
              <img :src="item.author.avatar_url">
            </div>
            <h3 class="title ui-ellipsis">{{ item.title }}</h3>
            <div class="author">{{ item.author.loginname || '' }}</div>
            <div class="post-time">{{ timeagoDate(item.last_reply_at) }}</div>
          </div>
        </div>
        <div class="empty" v-if="!(userData.recent_replies && userData.recent_replies.length)">
          暂无帖子
        </div>
      </div>

      <div class="tab-content" v-if="activeTab === 1">
        <div class="topic-list bg-white" v-if="userData.recent_topics && userData.recent_topics.length">
          <div 
            class="topic-item ui-border-b" 
            v-for="item in userData.recent_topics" 
            :key="item.id"
            @click="navTo('/topic/' + item.id)"
          >
            <div class="avator">
              <img :src="item.author.avatar_url">
            </div>
            <h3 class="title ui-ellipsis">{{ item.title }}</h3>
            <div class="author">{{ item.author.loginname || '' }}</div>
            <div class="post-time">{{ timeagoDate(item.last_reply_at) }}</div>
          </div>
        </div>
        <div class="empty" v-if="!(userData.recent_topics && userData.recent_topics.length)">
          暂无帖子
        </div>
      </div>

      <div class="tab-content" v-if="activeTab === 2">
        <div class="topic-list bg-white" v-if="collectTopic.length">
          <div 
            class="topic-item ui-border-b" 
            v-for="item in collectTopic" 
            :key="item.id"
            @click="navTo('/topic/' + item.id)"
          >
            <div class="avator">
              <img :src="item.author.avatar_url">
            </div>
            <h3 class="title ui-ellipsis">{{ item.title }}</h3>
            <div class="author">{{ item.author.loginname || '' }}</div>
            <div class="post-time">{{ timeagoDate(item.create_at) }}</div>
          </div>
        </div>
        <div class="empty" v-if="!collectTopic.length">
          暂无帖子
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="less">
  @import "../assets/css/fn.less";
  @import "../assets/css/github-markdown.less";

  .page-user {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .content {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      .mu-tab-link-highlight  {
        background-color: @uiColorPrimary !important;
      }

      .user-info {
        position: relative;
        height: 200px;

        .avatar {
          position: absolute;
          top: 20px;
          left: 50%;
          margin-left: -50px;
        }

        .user-name {
          position: absolute;
          top: 130px;
          left: 0;
          width: 100%;
          text-align: center;
          color: #2c3e50;
          font-size: 14px;
        }

        .create-at {
          position: absolute;
          bottom: 10px;
          left: 15px;
          color: #2c3e50;
          font-size: 13px;
        }

        .score {
          position: absolute;
          bottom: 10px;
          right: 15px;
          color: @uiColorPrimary;
          font-size: 13px;
        }


      }

      .empty {
        text-align: center;
        margin-top: 40px;
      }

      .topic-list {
        padding: 0;

        .topic-item {
          position: relative;
          height: 80px;

          .avator {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            overflow: hidden;
            left: 15px;
            top: 20px;

            img {
              display: block;
              width: 40px;
              height: 40px;
            }
          }
          .title {
            position: absolute;
            height: 20px;
            line-height: 20px;
            left: 70px;
            right: 15px;
            top: 20px;
            font-size: 16px;
            color: #2c3e50;
          }
          .author {
            position: absolute;
            height: 20px;
            line-height: 20px;
            left: 70px;
            bottom: 15px;
            font-size: 13px;
            color: #626262;
          }
          .post-time {
            position: absolute;
            height: 20px;
            line-height: 20px;
            right: 15px;
            bottom: 15px;
            font-size: 13px;
            color: @uiColorPrimary;
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
    name: 'userPage',
    mixins: [base],
    data () {
      return {
        title: '用户信息',
        activeTab: 0,
        username: '',
        userData: {},
        collectTopic: []
      }
    },
    mounted(){
      this.initPageData();
    },
    methods: {
      // 初始化页面数据
      initPageData() {
        var _this = this;
        this.username = this.$route.params.username || '';
        this.getUserDetails();
        this.getCollectTopic();
      },
      // 获取用户数据
      getUserDetails(cb) {
        var _this = this;
        try {
          api.getUserInfo(this.username).then(function(res){
            if(res.success){
              _this.userData = res.data;
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
      // 获取收藏
      getCollectTopic(cb) {
        var _this = this;
        try {
          api.getTopicCollect(this.username).then(function(res){
            if(res.success){
              _this.collectTopic = res.data;
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

<template>
  <div class="page-message">
    <mu-appbar style="width: 100%;">
      <mu-button icon slot="left" @click.native="goBack">
        <mu-icon value=":fa fa-chevron-left"></mu-icon>
      </mu-button>
      {{ title }}
    </mu-appbar>

    <div class="content">
      <mu-tabs 
        :value.sync="activeTab" 
        inverse 
        full-width
        class="bg-white"
        color="primary" 
        text-color="rgba(0, 0, 0, .54)"  
        center
      >
        <mu-tab>已读消息</mu-tab>
        <mu-tab>未读消息</mu-tab>
      </mu-tabs>

      <div class="tab-content" v-if="activeTab === 0">
        <div class="message-list bg-white" v-if="messageList.has_read_messages && messageList.has_read_messages.length">
          <div 
            class="message-item ui-border-b" 
            v-for="item in messageList.has_read_messages" 
            :key="item.id"
          >
            <div class="message-info">
              <div class="avator">
                <img :src="item.author.avatar_url">
              </div>
              <h3 class="title ui-ellipsis">{{ item.author.loginname }}</h3>
              <div class="post-time">{{ timeagoDate(item.reply.create_at) }}</div>
            </div>
            <div class="message-content" v-html="item.reply.content"></div>
            <div class="topic-info">
              <div class="topic-title" @click="navTo('/topic/' + item.topic.id)">话题：{{ item.topic.title }}</div>
            </div>
          </div>
        </div>
        <div class="empty" v-if="!(messageList.has_read_messages && messageList.has_read_messages.length)">
          暂无消息
        </div>
      </div>

      <div class="tab-content" v-if="activeTab === 1">
        <div class="message-list bg-white" v-if="messageList.hasnot_read_messages && messageList.hasnot_read_messages.length">
          <div 
            class="message-item ui-border-b" 
            v-for="item in messageList.hasnot_read_messages" 
            :key="item.id"
          >
            <div class="message-info">
              <div class="avator">
                <img :src="item.author.avatar_url">
              </div>
              <h3 class="title ui-ellipsis">{{ item.author.loginname }}</h3>
              <div class="post-time">{{ timeagoDate(item.reply.create_at) }}</div>
            </div>
            <div class="message-content" v-html="item.reply.content"></div>
            <div class="topic-info">
              <div class="topic-title" @click="navTo('/topic/' + item.topic.id)">话题：{{ item.topic.title }}</div>
            </div>
          </div>
        </div>
        <div class="empty" v-if="!(messageList.hasnot_read_messages && messageList.hasnot_read_messages.length)">
          暂无消息
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="less">
  @import "../assets/css/fn.less";
  @import "../assets/css/github-markdown.less";

  .page-message {
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

      .empty {
        text-align: center;
        margin-top: 40px;
      }

      .message-list {
        padding: 0;

        .message-item {
          overflow: hidden;
          padding-bottom: 15px;

          .message-info {
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
              left: 70px;
              bottom: 15px;
              font-size: 13px;
              color: @uiColorPrimary;
            }
          }
          
          .message-content {
            padding: 0 15px;
          }
          .topic-info {
            padding: 0 15px;
            margin-top: 10px;

            .topic-title {
              padding: 6px;
              background-color: #eeeeee;
              border-radius: 3px;
              line-height: 1.5;
              font-size: 14px;
              font-size: #232323;
            }
          }
        }
      }
    }
  }
</style>

<script>
  import base from '../mixins/base'
  import user from '../mixins/user'
  import api from '../api'
  import _ from 'lodash'

  export default {
    name: 'messagePage',
    mixins: [base,user],
    data () {
      return {
        title: '消息',
        activeTab: 0,
        messageList: []
      }
    },
    mounted(){
      this.initPageData();
    },
    methods: {
      // 初始化页面数据
      initPageData() {
        var _this = this;
        this.getMessageList();
      },
      getMessageList(cb) {
        var _this = this;
        let token = this.getTokenNoRedirect() || '';
        if(!token) return;
        try {
          api.getMessages({
            params: {
              accesstoken: token
            }
          }).then(function(res){
            if(res.success){
              _this.messageList = res.data;
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

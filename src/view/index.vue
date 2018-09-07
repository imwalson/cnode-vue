<template>
  <div class="page-index">
    <mu-appbar style="width: 100%;">
      <mu-button icon slot="left" @click.native="menuOpen = !menuOpen">
        <mu-icon value=":fa fa-align-justify"></mu-icon>
      </mu-button>
      {{ title }}
    </mu-appbar>

    <div class="main-container" ref="container" @scroll="onContainerScroll($event)">
      <mu-load-more 
        class="topic-list-container" 
        @refresh="refresh" 
        :refreshing="refreshing" 
        :loading="loading" 
        @load="loadMore"
        :loaded-all="!pager.hasMore"
      >
        <mu-list class="topic-list" >
          <div 
            class="topic-item bg-white ui-border-b" 
            v-for="item in topicList" 
            :key="item.id"
            @click="navTo('/topic/' + item.id)"
          >
            <h3 class="title ui-ellipsis">
              <span class="tag top" v-if="item.top">置顶</span>
              <span :class="'tag ' + item.tab" v-if="!item.top">{{ tabMap[item.tab] || '暂无' }}</span>
              {{ item.title }}
            </h3>
            <div class="content">
              <div class="avator">
                <img :src="item.author.avatar_url">
              </div>
              <div class="author">{{ item.author.loginname || '' }}</div>
              <div class="post-time">{{ timeagoDate(item.create_at) }}</div>
              <div class="status">
                <b>{{ item.reply_count || 0 }}</b>/{{ item.visit_count || 0 }}
              </div>
              <div class="reply-time">{{ timeagoDate(item.last_reply_at) }}</div>
            </div>
          </div>
        </mu-list>
      </mu-load-more>
    </div>

    <!-- 侧边栏 -->
    <mu-drawer 
      :open.sync="menuOpen" 
      :docked="docked" 
      :right="position === 'right'"
      class="left-drawer"
    >
      <div class="user-info">
        <mu-avatar class="avatar" :size="50">
          <img src="../assets/img/man.jpg">
        </mu-avatar>
        <h3 class="user-name">请登录</h3>
      </div>
      <mu-divider></mu-divider>
      <mu-list>
        <mu-list-item 
          v-for="(item,index) in menus"
          :key="item.value"
          button 
          :ripple="true"
          @click.native="nemuClickHandler(index)"
          :class="{'_active': (item.value === activeMenu) }"
        >
          <mu-list-item-action>
            <mu-icon :value="item.icon"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{ item.name }}</mu-list-item-title>
        </mu-list-item>
        
      </mu-list>
      <mu-divider></mu-divider>
      <mu-list>
        <mu-list-item button :ripple="true">
          <mu-list-item-action>
            <mu-icon value=":fa fa-bell"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>消息</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="true">
          <mu-list-item-action>
            <mu-icon value=":fa fa-exclamation-circle"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>关于</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
  </div>
</template>

<style lang="less">
  @import "../assets/css/fn.less";

  .page-index {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .left-drawer {
      width: 200px;

      .mu-list li._active {
        .mu-item-action {
          color: @uiColorPrimary !important;
        }
        .mu-item-title {
          color: @uiColorPrimary !important;
        }
      }

      .user-info {
        position: relative;
        height: 100px;

        .avatar {
          position: absolute;
          left: 20px;
          top: 25px;
        }
        .user-name {
          position: absolute;
          height: 50px;
          line-height: 50px;
          left: 85px;
          top: 25px;
          font-size: 14px;
          color: #333333;
        }
      }
    }
    
    .main-container {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      .topic-list {
        background: #EDEDED;
        padding: 0;
      }

      .topic-item {
        position: relative;
        padding: 10px 15px;
        overflow: hidden;

        .title {
          position: relative;
          padding-left: 40px;
          font-size: 15px;
          height: 24px;
          line-height: 24px;

          .tag {
            display: block;
            position: absolute;
            height: 20px;
            line-height: 20px;
            top: 2px;
            left: 0;
            border-radius: 3px;
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

        .content {
          position: relative;
          margin-top: 10px;
          height: 40px;

          .avator {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            overflow: hidden;
            left: 0;
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
            top: 0;
            left: 50px;
            color: #34495e;
            font-size: 14px;
          }
          .post-time {
            position: absolute;
            height: 20px;
            line-height: 20px;
            top: 20px;
            left: 50px;
            color: #34495e;
            font-size: 12px;
          }
          .status {
            position: absolute;
            height: 20px;
            line-height: 20px;
            top: 0;
            right: 0;
            color: #34495e;
            font-size: 14px;

            b {
              color: @uiColorPrimary;
            }
          }
          .reply-time {
            position: absolute;
            height: 20px;
            line-height: 20px;
            top: 20px;
            right: 0;
            color: #34495e;
            font-size: 12px;
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
  import api from '../api'
  import _ from 'lodash'

  export default {
    name: 'indexPage',
    mixins: [base],
    data () {
      return {
        title: '全部',
        docked: false,
        menuOpen: false,
        position: 'left',
        topicList: [],
        refreshing: false,
        loading: false,
        pager: {
          page: 1,
          size: 20,
          hasMore: true
        },
        tabMap: {
          ask: '问答',
          share: '分享',
          job: '招聘',
          good: '精华'
        },
        activeMenu: 'all',
        menus: [
          {
            value: 'all',
            icon: ':fa fa-list-ul',
            name: '全部'
          },
          {
            value: 'good',
            icon: ':fa fa-star',
            name: '精华'
          },
          {
            value: 'share',
            icon: ':fa fa-share-alt',
            name: '分享'
          },
          {
            value: 'ask',
            icon: ':fa fa-comments',
            name: '问答'
          },
          {
            value: 'job',
            icon: ':fa fa-users',
            name: '招聘'
          },
        ],
        showScrollTop: false
      }
    },
    computed: {
      ...mapGetters([
        'scrollTop',
      ]),
    },
    created () {
      
    },
    mounted(){
      this.initPageData();
    },
    activated(){
      this.recoverScrollPosition();
    },
    methods: {
      ...mapActions([
        'setScrollTop',
      ]),
      // 初始化页面数据
      initPageData() {
        var _this = this;

        this.refresh('all');
      },
      nemuClickHandler(index) {
        var _this = this;
        var item = this.menus[index];
        var value = item.value;
        this.menuOpen = false;
        if(value === this.activeMenu) return;
        this.refresh(value);
      },
      onContainerScroll(e) {
        var _this = this;
        // 保存滚动位置
        var scrollTop = e.target.scrollTop || 0;
        this.setScrollTop(scrollTop);
        // 是否显示回到顶部按钮
        setTimeout(() => {
          if( scrollTop >= 300 ){
            _this.showScrollTop = true;
          }else {
            _this.showScrollTop = false;
          }
        }, 100);
      },
      // 还原滚动位置
      recoverScrollPosition() {
        try {
          let dom = null;
          if(this.$refs.container){
            dom = this.$refs.container;
          }
          dom && (dom.scrollTop = this.scrollTop);
        } catch (error) {
          console.log(error);
        }
      },
      // 获取帖子列表
      refresh (tab) {
        var _this = this;
        this.refreshing = true;
        this.$refs.container.scrollTop = 0;
        var options = {
          params: {
            page: 1,
            limit: _this.pager.size
          }
        };
        if(tab && tab !== 'all'){
          options.params.tab = tab;
        }
        api.getTopicList(options)
        .then((res)=>{
          _this.refreshing = false;
          if(res.success){
            _this.pager = {
              page: 1,
              size: _this.pager.size,
              hasMore: (res.data.length < _this.pager.size) ? false : true
            };
            _this.topicList = res.data;
            _this.activeMenu = tab;
          }
        })
        .catch((error)=>{
          console.log(error);
          _this.refreshing = false;
        })
      },
      loadMore () {
        var _this = this;
        this.loading = true;

        var options = {
          params: {
            page: _this.pager.page + 1,
            limit: _this.pager.size
          }
        };
        if(this.activeMenu && this.activeMenu !== 'all'){
          options.params.tab = this.activeMenu;
        }
        api.getTopicList(options)
        .then((res)=>{
          _this.loading = false;
          if(res.success){
            _this.pager = {
              page: _this.pager.page + 1,
              size: _this.pager.size,
              hasMore: (res.data.length < _this.pager.size) ? false : true
            };
            _this.topicList = _this.topicList.concat(res.data);
          }
        })
        .catch((error)=>{
          console.log(error);
          _this.loading = false;
        })
      }
      
    },
  }
</script>


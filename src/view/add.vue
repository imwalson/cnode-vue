<template>
  <div class="page-add">
    <mu-appbar style="width: 100%;">
      <mu-button icon slot="left" @click.native="goBack">
        <mu-icon value=":fa fa-chevron-left"></mu-icon>
      </mu-button>
      <mu-button icon slot="right" @click.native="submit">
        <mu-icon value=":fa fa-paper-plane"></mu-icon>
      </mu-button>
      {{ title }}
    </mu-appbar>

    <div class="content">
      <div class="form-row">
        <mu-select label="选择分类" v-model="form.tab" full-width>
          <mu-option v-for="option in options" 
            :key="option.value" 
            :label="option.label" 
            :value="option.value"
          ></mu-option>
        </mu-select>
      </div>
      <div class="form-row">
        <mu-text-field v-model="form.title" label="标题" placeholder="标题，字数10字以上" full-width></mu-text-field>
      </div>
      <div class="editor-box">
        <div class="mu-input has-label full-width">
          <div class="mu-input-label">正文</div>
          <vue-editor 
            id="editor"
            useCustomImageHandler
            :editorToolbar="customToolbar"
            @imageAdded="handleImageAdded" 
            v-model="form.content"
            >
          </vue-editor>
        </div>
        
      </div>
    </div>
  </div>
</template>


<style lang="less">
  @import "../assets/css/fn.less";

  .page-add {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .content {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      .form-row {
        padding: 0 15px;
      }

      .editor-box {
        padding: 0 15px;
      }

      #editor {
        height: 400px;
      }

      .mu-input.has-label {
        padding-top: 40px;
      }
    }
  }
</style>

<script>
  import base from '../mixins/base'
  import user from '../mixins/user'
  import api from '../api'
  import _ from 'lodash'
  import {VueEditor} from 'vue2-editor'
  import axios from 'axios'
  import h2m from 'h2m';

  export default {
    name: 'addPage',
    mixins: [base,user],
    components: {
      VueEditor
    },
    data () {
      return {
        title: '发布主题',
        options: [
          {
            label: '分享',
            value: 'share'
          },
          {
            label: '问答',
            value: 'ask'
          },
          {
            label: '招聘',
            value: 'job'
          },
          {
            label: '客户端测试',
            value: 'dev'
          }
        ],
        form: {
          tab: 'share',
          title: '',
          content: ''
        },
        customToolbar: [
          [
            'bold', 
            'italic', 
            'underline', 
            'blockquote',
            // { 'size': ['small', false, 'large', 'huge'] },
            // { 'color': [] }, 
            // { 'background': [] }
          ],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['image', 'link', 'code-block', ]
        ]
      }
    },
    mounted(){
      
    },
    methods: {
      handleImageAdded(file, Editor, cursorLocation) {
        var formData = new FormData();
        formData.append('image', file)

        axios({
          url: 'https://ipfs.pokuton.com/imgupload',
          method: 'POST',
          headers:{},
          data: formData
        })
        .then((result) => {
          console.log(result);
          let url = result.data.url;
          Editor.insertEmbed(cursorLocation, 'image', url);
        })
        .catch((err) => {
          console.log(err);
        })
      },
      submit() {
        var _this = this;
        let token = this.getToken() || '';
        console.log(token);
        if(!token) return;
        if(!this.form.title){
          this.$toast.error('请输入标题');
          return;
        }
        if(!this.form.content){
          this.$toast.error('请输入正文');
          return;
        }
        let data = {
          accesstoken: token,
          title: this.form.title,
          tab: this.form.tab,
          content: h2m(this.form.content)
        }
        //console.log(data);
        api.addTopic({
          method: 'post',
          data: data
        }).then((res)=>{
          if(res.success){
            _this.$toast.success('发布成功');
            const id = res.topic_id;
            _this.navTo('/topic/' + id);
          }
        }).catch((err)=>{
          console.log(err);
          _this.$toast.error(err.error_msg || '发布失败');
        })
      }
    },
  }
</script>

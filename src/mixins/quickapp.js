import router from '../router'

export default {
  data () {
    return {
      qrRes: '',
      pickImage: ''
    }
  },
  mounted: function () {
    var _this = this;
    if(this.browserContext === 'QA'){
      try {
        // 监听快应用消息
        system.onmessage = function (data) {
          console.log("message received: " + data);
          alert("message received: " + data);
          try { data = JSON.parse(data); } catch (error) {}
          if( data.type === 'qr' ){ 
            _this.qrRes = data.data || '';
          }else if( data.type === 'pickImage' ){ 
            _this.pickImage = data.data || '';
          }
        };
      } catch (error) {
        console.log(error)
      }
    }
  },
  methods: {
    

  }
}
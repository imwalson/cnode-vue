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
          switch (data.type) {
            case 'qr':
              _this.qrRes = data.data || '';
              break;
            case 'pickImage':
              _this.pickImage = data.data || '';
              break;
            case 'route':
              var path = data.data || '';
              if(path) {
                router.replace( decodeURIComponent(path) );
              }
              break;  
            default:
              break;
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
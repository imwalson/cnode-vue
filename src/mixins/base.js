import router from '../router'
import timeagoJs from 'timeago.js';
import {
  mapActions,
  mapState,
  mapGetters
} from 'vuex'

export default {
  data () {
    return {
      
    }
  },
  computed: {
    // 从 store 获取的数据
    ...mapGetters([
      'browserContext',
    ])
  },
  mounted(){
    // 设置全局浏览器环境上下文
    let ua = navigator.userAgent || '';
    let context = 'CUSTOM';

    if(this.isWeixin(ua)) {
      context = 'WECHAT';
    }else if (this.isAlipay(ua)) {
      context = 'ALIPAY';
    }else if (this.isQa(ua)) {
      context = 'QA';
    }
    this.setBrowserContext(context);
  },
  methods: {
    // 从 store 获取的方法
    ...mapActions([
      'setBrowserContext',
    ]),

    /**
     * [浏览器环境判断]
     */
    isWeixin(ua){
      var reg = /MicroMessenger/i;
      return reg.test(ua);
    },
    isQa(ua){
      var reg = /hap\//i;
      return reg.test(ua);
    },
    isAlipay(ua){
      var reg = /AlipayClient/i;
      return reg.test(ua);
    },

    /**
     * [功能方法]
     * @param  {[type]}  item [description]
     * @return {Boolean}      [description]
     */
    timeagoDate(ts) {
      //var d = new Date(ts);
      var timeago = timeagoJs();
      var str = timeago.format(ts, 'zh_CN');
      return str;
    },
    isPhone(str) {
      return /^1\d{10}$/.test(str)
    },
    getDateString(d) {
      if(!d){
        return '';
      }   
      var str,year,month,day,h,m,s;
      var date = new Date(d);
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate(); 
      h = date.getHours();
      m = date.getMinutes();
      s = date.getSeconds(); 
      str = year.toString() + '-' + (month>9?month:'0'+month) + '-' + (day>9?day:'0'+day);
      return str;
    },
    getDayString(d) {
      if(!d){
        return '';
      }   
      var str,year,month,day,h,m,s;
      var date = new Date(d);
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate(); 
      h = date.getHours();
      m = date.getMinutes();
      s = date.getSeconds(); 
      str = year.toString() + '-' + (month>9?month:'0'+month) + '-' + (day>9?day:'0'+day) +' ' + (h>9?h:'0'+h) + ':' + (m>9?m:'0'+m) + ':' + (s>9?s:'0'+s);
      return str;
    },
    getTodayString() { 
      var str,year,month,day;
      var date = new Date();
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate(); 
      str = year.toString() + '/' + (month>9?month:'0'+month) + '/' + (day>9?day:'0'+day);
      return str;
    },
    /* 
    * url 目标url 
    * arg 需要替换的参数名称 
    * arg_val 替换后的参数的值 
    * return url 参数替换后的url 
    */ 
    changeURLArg(url, arg, arg_val) {
      var pattern = arg + '=([^&]*)';
      var replaceText = arg + '=' + arg_val;
      if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
      } else {
        if (url.match('[\?]')) {
          return url + '&' + replaceText;
        } else {
          return url + '?' + replaceText;
        }
      }
      return url + '\n' + arg + '\n' + arg_val;
    },
    windowScrollTop() {
      window.scroll(0, 0);
    },
    divScrollTop(ele) {
      try {
        ele.scrollTop = 0;
      } catch (error) {
        console.log(error);
      }
    },

    historyBack() {
      history.back();
    },
    goBack() {
      if(window.history.length > 1){
        router.back();
      }else{
        this.redirectTo('/')
      }
    },
    navTo(route,e) {
      if(!route) return;
      var url = route;

      router.push(url);
    },
    redirectTo(route,e) {
      if(!route) return;
      var url = route;

      router.replace(url)
    }
  }
}
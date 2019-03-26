import Vue from 'vue';
import App from './App.vue';
//js-cookie
import Cookies from 'js-cookie';
//进度条
import 'normalize.css/normalize.css';
//路由
import router from './router';
//vuex
import store from './store';

//Element-UI
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//全局样式
import './styles/index.scss';
//icon
import './icons'

//babel-polyfill让低版本浏览器支持es6
//import 'babel-polyfill';
//路由权限判断
import './permission.js'

Vue.config.productionTip = false;
Vue.use(Element,{
    size:Cookies.get('size')||'medium'
});

new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app');

/**
 * Created by wubo on 2017/8/20.
 */
import 'babel-polyfill';

import app from './app.vue';
import chat from './chat.vue';
import login from './login.vue';
import Vue from 'vue';
import store from './store/';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueRouter from 'vue-router';
import Vuex from 'Vuex';

Vue.use(VueRouter);
Vue.use(iView);

const router = new VueRouter({
    routes: [
      {
        path: '/',
        component: app,
        children: [
          {
            path: '/login',
            component: login
          },
          {
            path: '/chatroom',
            component: chat
          }
        ]
      }
    ]
});

let vm = new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app');

window.vm = vm;
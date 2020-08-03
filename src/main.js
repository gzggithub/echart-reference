// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store"; //引入store
import ElementUI from "element-ui";
import "../theme/index.css";
import echarts from 'echarts'
import './assets/js/customed'

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false


/* 通过控制变量引入全局样式以达到多种样式风格 */
/* if (window.configs.STYLE_LESS == 'common') {
  require("!style-loader!css-loader!less-loader!./styles/common.less")
} */
//console.log(window.configs.STYLE_LESS)
require("!style-loader!css-loader!less-loader!./styles/common.less")


router.beforeEach((to, from, next) => {
  let isLogin = sessionStorage.getItem("token");
      //let isLogin = store.state.portal.token;

      if (to.meta.needLogin) {
          // 判断该路由是否需要登录权限
         // console.log(isLogin)

          if (isLogin) {
              // 判断是否已经登录
              next();
              /*将所有路由id放到一个数组中*/
              /*通过路由meta.id判断用户是否有菜单权限*/
              // if(routerIdArray.indexOf(to.meta.id) > -1) {
              //     next()
              // } else {
              //     ElementUI.Message({
              //         message: '您暂无此权限',
              //         type: 'error',
              //         duration:2000
              //     });
              //     next({
              //         path: '/404',
              //     })
              // }
          } else {
              ElementUI.Message({
                  message: "请先登录",
                  type: "warning",
                  duration: 2000
              });
              next({
                  path: "/login",
                  query: {
                      redirect: to.path,
                      //defaultActive: to.meta.id
                  } // 将跳转的路由path作为参数，登录成功后跳转到该路由
              });
          }
      } else {
          next();
      }
});

Vue.use(ElementUI);




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

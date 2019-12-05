import Vue from 'vue'
import App from './App.vue'
import store from './store'

import '@/css/font.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import moment from 'moment'
Vue.filter('formatDate', function (value, format) {
  if (value) {
       return moment(value).format(format)
  }
})

import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/running'
import 'vue-awesome/icons/clock'
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/question'
Vue.component('icon', Icon)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import './plugins/axios'
import './serve'
import './styles.scss'
import App from './App.vue'
import router from './router'
import './plugins/element-ui'
import './plugins/mavonEditor'
import './plugins/datastore'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

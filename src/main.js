import Vue from 'vue';
import App from './App.vue';
import { Table } from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Table);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');

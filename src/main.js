import Vue from 'vue';
import App from './App.vue';
import { Table, Radio } from 'buefy';
import 'buefy/dist/buefy.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSortAmountUp,
  faSortAmountDown,
  faSort,
  faFilter,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VTooltipPlugin from 'v-tooltip';
import 'v-tooltip/dist/v-tooltip.css';
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

library.add(faSortAmountUp, faSortAmountDown, faSort, faFilter, faTimes);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Table);
Vue.use(Radio);
Vue.use(VTooltipPlugin);
Vue.use(VueVirtualScroller);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');

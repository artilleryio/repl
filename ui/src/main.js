import Vue from 'vue';
import App from './App.vue';
import VueTailwindModal from 'vue-tailwind-modal';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import ShareScenario from './components/ShareScenario.vue';
import './assets/styles/index.css';
import router from './router';

const { sortBy } = require('lodash');

Vue.config.productionTip = false;

Vue.use(Loading);

Vue.component('VueTailwindModal', VueTailwindModal);
Vue.component('share-scenario', ShareScenario);

const app = new Vue({
  router,
  render: h => h(App),
}).$mount('#app');

const spinner = app.$loading.show();
const ws = new WebSocket(process.env.VUE_APP_WS_ENDPOINT);
window.ws = ws;

// TODO: Handle reconnect

ws.onopen = function(event) {
  console.log(event);
  console.log('WS open');
  spinner.hide();
};

ws.onmessage = function(event) {
  console.log(event);

  const eventData = JSON.parse(event.data);
  if (eventData.event === 'output') {
    let newItems = app.$root.$children[0].items.concat(eventData);

    app.$root.$children[0].items = sortBy(newItems, x => x.ts);
  } else if (eventData.event === 'done') {
    // TODO: Re-enable Run button
    console.log('Run done');
  }
};

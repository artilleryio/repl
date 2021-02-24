import Vue from "vue";
import App from "./App.vue";
import VueTailwindModal from "vue-tailwind-modal";

import "./assets/styles/index.css";

const { sortBy } = require("lodash");

Vue.config.productionTip = false;

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
Vue.use(Loading);

import VueRouter from "vue-router";

Vue.component("VueTailwindModal", VueTailwindModal);
Vue.use(VueRouter);

const routes = [
  {
    path: "/:key",
    component: App,
  },
];
const router = new VueRouter({ routes });

const app = new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

const spinner = app.$loading.show();
let ENDPOINT = '';
let ws = new WebSocket(ENDPOINT);
window.ws = ws;

// TODO: Handle reconnect

ws.onopen = function(event) {
  console.log(event);
  console.log("WS open");
  spinner.hide();
};

ws.onmessage = function(event) {
  console.log(event);

  const eventData = JSON.parse(event.data);
  if (eventData.event === "output") {
    let newItems = app.$root.$children[0].items.concat(eventData);

    app.$root.$children[0].items = sortBy(newItems, (x) => x.ts);
  } else if (eventData.event === "done") {
    // TODO: Re-enable Run button
    console.log("Run done");
  }
};

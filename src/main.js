import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueApexCharts from 'vue-apexcharts'
import VueSimpleAlert from "vue-simple-alert";

Vue.use(VueApexCharts)
Vue.use(VueSimpleAlert);
Vue.component('apexchart', VueApexCharts)
Vue.config.productionTip = false;

new Vue({
  router,
  VueApexCharts,
  render: (h) => h(App),
}).$mount("#app");
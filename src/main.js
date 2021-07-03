import Vue from 'vue';
import VueI18n from 'vue-i18n';
import App from './App.vue';
import './registerServiceWorker';

// Vue.config.productionTip = false;
Vue.use(VueI18n);
const messages = {
  "en": require("./i18n/en.json"),
  "zh": require("./i18n/zh.json"),
};
const i18n = new VueI18n({
  locale: 'zh', // set locale
  messages, // set locale messages
});

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app')

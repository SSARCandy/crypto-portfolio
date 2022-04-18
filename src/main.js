import Vue from 'vue';
import VueI18n from 'vue-i18n';
import FloatingVue from 'floating-vue';
import App from './App.vue';
import './registerServiceWorker';

// Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(FloatingVue);
const messages = {
  "en": require("./i18n/en.json"),
  "zh": require("./i18n/zh.json"),
};
const i18n = new VueI18n({
  locale: 'en', 
  messages, 
});

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app');

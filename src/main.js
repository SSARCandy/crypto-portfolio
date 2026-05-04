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
  "jp": require("./i18n/jp.json"),
};
const i18n = new VueI18n({
  locale: 'en', 
  messages, 
});

const LAST_URL_KEY = 'last_url';
const normalizeBasePath = (path) => {
  if (!path) {
    return '/';
  }
  return path.endsWith('/') ? path : `${path}/`;
};
const basePath = normalizeBasePath(process.env.BASE_URL || '/');
const baseUrl = new URL(basePath, window.location.origin);
const basePathname = baseUrl.pathname;

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches
  || window.navigator.standalone === true;

const hasIdParam = (url) => new URLSearchParams(url.search).has('id');
const isEntryPath = (pathname) => pathname === basePathname
  || pathname === `${basePathname}index.html`;
const isEntryUrl = (url) => isEntryPath(url.pathname) && !url.hash;

const saveCurrentUrl = () => {
  const url = new URL(window.location.href);
  if (!hasIdParam(url)) {
    return;
  }
  if (!url.pathname.startsWith(baseUrl.pathname)) {
    return;
  }
  localStorage.setItem(LAST_URL_KEY, url.href);
};

const redirectToLastUrlIfNeeded = () => {
  if (!isStandalone()) {
    return;
  }
  const url = new URL(window.location.href);
  if (!isEntryUrl(url)) {
    return;
  }
  if (hasIdParam(url)) {
    return;
  }
  const lastUrl = localStorage.getItem(LAST_URL_KEY);
  if (!lastUrl) {
    return;
  }
  const last = new URL(lastUrl);
  if (last.origin !== url.origin) {
    return;
  }
  if (!last.pathname.startsWith(baseUrl.pathname)) {
    return;
  }
  if (last.href === url.href) {
    return;
  }
  window.location.replace(last.href);
};

redirectToLastUrlIfNeeded();
saveCurrentUrl();
window.addEventListener('pagehide', saveCurrentUrl);
window.addEventListener('popstate', saveCurrentUrl);
window.addEventListener('hashchange', saveCurrentUrl);
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    saveCurrentUrl();
  } else if (document.visibilityState === 'visible' && isStandalone()) {
    const appEl = document.getElementById('app');
    if (!appEl || appEl.innerHTML.trim() === '') {
      window.location.reload();
    }
  }
});

window.addEventListener('pageshow', (e) => {
  if (e.persisted && isStandalone()) {
    window.location.reload();
  }
});

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app');

import { createApp } from 'vue';
import loader from 'vue3-ui-preloader';

import 'vue3-ui-preloader/dist/loader.css';
import './assets/styles.css';

import Vuetify from '../libs/vuetify.js';
import vueDebounce from 'vue-debounce';

import App from './App.vue';

import { router } from './routes';

import { createPinia } from 'pinia';
const pinia = createPinia();

const app = createApp(App);

app.use(Vuetify);
app.use(pinia);
app.use(router);
app.directive('debounce', vueDebounce({ lock: true }));

app.component('loader', loader);

app.mount('#app');

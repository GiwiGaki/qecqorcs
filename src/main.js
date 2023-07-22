
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'normalize.css'
import './assets/main.css'
import '@splidejs/vue-splide/css/core';


const app = createApp(App);
app.use(router);
app.mount('#app');
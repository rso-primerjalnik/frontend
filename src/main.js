import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import {BootstrapVue3} from "bootstrap-vue-3";
import VueFeather from 'vue-feather';
import axios from "axios";
import VueAxios from "vue-axios";


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'

const app = createApp(App)

app.use(router);
app.use(BootstrapVue3);
app.component(VueFeather.name, VueFeather)

app.use(VueAxios, axios);

app.mount('#app')

export default app;

import Vue from "vue";

Vue.config.productionTip = false;

import Vuetify from "vuetify";

Vue.use(Vuetify);
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import Home from "./pages/Home.vue";
import SignIn from "./pages/SignIn.vue";
import CoreHours from "./pages/core-hours.vue";
import Team from "./pages/Team.vue";



import VueRouter from "vue-router";

Vue.use(VueRouter);
const router = new VueRouter({
    mode: "history",
    routes: [
        {name: "home-page", path: "/", component: Home},
        {name: "sign-in", path: "/sign-in", component: SignIn},
        {name: "core-hours", path: "/core-hours", component: CoreHours},
        {name: "team", path: "/team", component: Team},

    ]
});

import App from "./App.vue";

new Vue({
    el: "#app",
    router,
    render: h => h(App)
});
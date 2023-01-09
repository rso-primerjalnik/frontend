import {createRouter, createWebHistory} from "vue-router";
import HomeScreen from "@/views/HomeScreen";

const routes = [
    {
        path: "/",
        name: "HomeScreen",
        component: HomeScreen
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    console.log("router", to);
    next();
})

export default router;
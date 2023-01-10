import {createRouter, createWebHistory} from "vue-router";
import HomeScreen from "@/views/HomeScreen";
import ShoppingCart from "@/views/ShoppingCart";

const routes = [
    {
        path: "/",
        name: "HomeScreen",
        component: HomeScreen
    },
    {
        path: "/carts/:id",
        name: "ShoppingCart",
        component: ShoppingCart
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
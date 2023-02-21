import {createRouter, createWebHistory} from "vue-router/dist/vue-router";
import userPage from "@/pages/UserPage";
import helloPage from "@/pages/HelloPage";
import {useAuthenticationStore} from "@/store/authentication.store";
import usersListPage from "@/pages/UsersListPage";
import mainPage from "@/pages/MainPage";

const routes = [
    {path: '/', component: helloPage},
    {path: '/user/', component: userPage},
    {path: '/user/:id', component: userPage},
    {path: '/users', component: usersListPage},
    {path: '/main', component: mainPage}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authenticationStore = useAuthenticationStore()

    const publicPages = [
        '/',
        '/main'
    ]
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = authenticationStore.isLoggedIn

    if (authRequired && !loggedIn) {
        return next('/')
    }
    next()
})

export default router;
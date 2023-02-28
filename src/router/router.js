import {createRouter, createWebHistory} from "vue-router/dist/vue-router";
import userPage from "@/pages/UserPage";
import {useAuthenticationStore} from "@/store/authentication.store";
import usersListPage from "@/pages/UsersListPage";
import mainPage from "@/pages/MainPage";
import lessonsPage from "@/pages/LessonsPage";
import chatPage from "@/pages/ChatPage";

const routes = [
    {path: '/', component: mainPage},
    {path: '/user/', component: userPage},
    {path: '/user/:id', component: userPage},
    {path: '/users', component: usersListPage},
    {path: '/lessons', component: lessonsPage},
    {path: '/messages', component: chatPage},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authenticationStore = useAuthenticationStore()

    const publicPages = [
        '/'
    ]
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = authenticationStore.isLoggedIn

    if (authRequired && !loggedIn) {
        return next('/')
    }
    next()
})

export default router;
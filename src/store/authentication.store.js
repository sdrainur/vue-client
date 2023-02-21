import {defineStore} from "pinia";
import {logIn} from "@/service/user.service";
import router from "@/router/router";

const token = JSON.parse(localStorage.getItem('accessToken'))
const initialState = token
    ? {loggedIn: true, token}
    : {loggedIn: false, token: null}


export const useAuthenticationStore = defineStore('authentication', {
    state: () => (initialState),
    getters: {
        getAccessToken: (state) => state.token,
        isLoggedIn: (state) => state.loggedIn
    },
    actions: {
        login(email, password) {
            return logIn(email, password)
                .then(result => {
                    console.log(result)
                    this.loggedIn = true
                    this.token = result
                })
        },
        logout(){
            localStorage.removeItem('accessToken')
            router.push('/')
        }
    }
})
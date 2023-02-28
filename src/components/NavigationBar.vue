<template>
  <div class="header" :style="{background: headerColor, boxShadow: headerShadowValue}">
    <div class="container">
      <div class="header__inner">
        <div class="header__menu">
          <p class="header__logo">Meach</p>
          <div class="about__user" v-if="loggedIn">
            <v-btn
                icon
            >
              <v-avatar size="36px">
                <v-img
                    :src="require('../assets/images/6-sep-2017-beauty-salons-where-are-best-face-peeli-op.jpg.jpg')"/>
              </v-avatar>
              <v-overlay
                  activator="parent"
                  location="bottom center"
                  location-strategy="connected"
              >
                <v-container>
                  <v-card
                      class="mx-auto"
                      max-width="344"
                      style="justify-content: center; background: #eeeded"
                  >
                    <v-card-text>
                      <v-container style="display: flex; padding: 0; align-items: center; margin-bottom: 10px">
                        <v-avatar size="80px">
                          <v-img
                              :src="require('../assets/images/6-sep-2017-beauty-salons-where-are-best-face-peeli-op.jpg.jpg')"/>
                        </v-avatar>
                        <v-container>
                          <p class="user__name">{{ user.firstName + ' ' + user.secondName }}</p>
                          <p class="text__primary">{{ user.email }}</p>
                          <p class="text__primary"></p>
                        </v-container>
                      </v-container>
                      <v-divider color="#636363"></v-divider>
                      <v-container class="button__list">
                        <v-btn
                            prepend-icon="mdi-cog-outline"
                            class="text__primary button"
                        >
                          Настройки
                        </v-btn>
                        <v-btn
                            prepend-icon="mdi-help-circle-outline"
                            class="text__primary button"
                        >
                          Помощь
                        </v-btn>
                        <v-btn
                            prepend-icon="mdi-logout"
                            class="text__primary button"
                            @click="logout"
                        >
                          Выход
                        </v-btn>
                      </v-container>
                    </v-card-text>
                  </v-card>
                </v-container>
              </v-overlay>
            </v-btn>
          </div>
          <div class="header__hamburger" v-if="!loggedIn">
            <v-icon size="35px" icon="mdi-menu" @click="openMenu"></v-icon>
          </div>
        </div>
        <div class="header__links" v-if="!loggedIn">
          <v-dialog
              v-model="loginForm"
              parent
          >
            <template v-slot:activator="{ props }">
              <a
                  v-bind="props"
                  class="header__link"
              >
                Авторизоваться
              </a>
            </template>
            <v-container style="width: 350px;">
              <login-form></login-form>
            </v-container>
          </v-dialog>
          <v-dialog
              v-model="signUpForm"
              parent
          >
            <template v-slot:activator="{ props }">
              <a
                  class="header__link"
                  v-bind="props"
              >
                Регистрация
              </a>
            </template>
            <v-container style="height: 100vh">
              <registration-form></registration-form>
            </v-container>
          </v-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm";
import RegistrationForm from "@/components/SignUpForm";
import {useAuthenticationStore} from "@/store/authentication.store";
import axiosInstance from "@/service/axios.instance";


export default {
  name: "NavigationBar",
  components: {
    RegistrationForm,
    LoginForm
  },
  data() {
    return {
      loginForm: false,
      signUpForm: false,
      headerColor: null,
      headerShadowValue: null,
      loggedIn: false,
      user: {
        firstName: null,
        secondName: null,
        role: null,
        id: null
      }
    }
  },
  setup() {
    const authenticationStore = useAuthenticationStore()
    return {
      authenticationStore
    }
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
  },
  mounted() {
    this.loggedIn = this.authenticationStore.isLoggedIn
    if (this.loggedIn) {
      axiosInstance.get('/user').then(res => {
        this.user = res.data
      })
    }
  },
  methods: {
    handleScroll() {
      console.log(window.scrollY)
      if (window.pageYOffset === 0) {
        this.headerColor = '#fff0'
        this.headerShadowValue = null
      } else {
        this.headerColor = 'rgba(250,251,255,0.96)'
        this.headerShadowValue = '0px 4px 8px 0px rgba(34, 60, 80, 0.2)';
      }
    },
    openMenu() {
      const headerLinks = document.querySelector(".header__links")
      const headerInner = document.querySelector(".header__inner")
      const header = document.querySelector(".header")
      headerInner.classList.toggle("active")
      headerLinks.classList.toggle("active")
      header.classList.toggle("active")
    },
    logout() {
      this.authenticationStore.logout()
    }
  },
}
</script>

<style lang="scss">
@import "../assets/scss/header";
@import "../assets/scss/banner";
@import "../assets/scss/about";
</style>
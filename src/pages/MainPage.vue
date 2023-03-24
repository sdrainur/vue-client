<template>
  <div class="header" :style="{background: headerColor, boxShadow: headerShadowValue}">
    <div class="container">
      <div class="header__inner">
        <div class="header__menu">
          <p class="header__logo">Meach</p>
          <div class="header__hamburger">
            <v-icon size="35px" icon="mdi-menu" @click="openMenu"></v-icon>
          </div>
        </div>
        <div class="header__links">
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
  <div class="background">
    <div class="container">
      <div class="banner">
        <div class="banner__inner">
          <div class="banner__title">
            We design and develop
          </div>
          <div class="banner__text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos ipsam, nesciunt nisi possimus quibusdam quos
            recusandae?
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="about">
    <div class="container">
      <div class="about__inner">
        <div class="about__content">
          <div class="about__title">
            About Us
          </div>
          <div class="about__text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus ad aut cumque debitis delectus eaque
            eius error eveniet hic in, iste nam natus optio porro quidem tenetur vel voluptate.
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>

  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm";
import RegistrationForm from "@/components/SignUpForm";

export default {
  name: "MainPage",
  components: {
    RegistrationForm,
    LoginForm
  },
  data() {
    return {
      loginForm: false,
      signUpForm: false,
      headerColor: null,
      headerShadowValue: null
    }
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
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
    }
  },
}
</script>

<style lang="scss">
@import "../assets/scss/header";
@import "../assets/scss/banner";
@import "../assets/scss/about";
</style>
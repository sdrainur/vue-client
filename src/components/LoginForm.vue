<template>
  <v-card style="max-width: 25vw">
    <v-card-text style="max-width: 25vw" class="ma-0">
      <v-container style="max-width: 25vw" class="ma-0">
        <v-row align="center" justify="center" style="max-width: 25vw" class="ma-0">
          <h1 class="custom-font">Вход в аккаунт</h1>
        </v-row>
        <v-row align="center"
               justify="center"
               style="max-width: 50vw"
               class="ma-0">
          <v-form
              ref="form"
          >
            <v-text-field
                v-model="email"
                label="Логин"
                required
            ></v-text-field>

            <v-text-field
                v-model="password"
                type="password"
                label="Пароль"
                required
            ></v-text-field>
            <v-row align="center" justify="center">
              <v-btn class="ma-1" @click="signIn">Войти</v-btn>
              <v-dialog
                  v-model="resetForm"
                  parent
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                      class="ma-1"
                      variant="plain"
                      v-bind="props"
                  >
                    Восстановить пароль
                  </v-btn>
                </template>
                <v-container>
                  <ResetPasswordForm></ResetPasswordForm>
                </v-container>
              </v-dialog>
            </v-row>
          </v-form>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import {useToast} from "vue-toastification";
import router from "@/router/router";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import {useAuthenticationStore} from "@/store/authentication.store";

export default {
  name: "login-form",
  components: {ResetPasswordForm},
  data() {
    return {
      resetForm: false,
      email: '',
      password: '',
    }
  },
  setup() {
    const toast = useToast();
    const authenticationStore = useAuthenticationStore()

    return {
      toast,
      authenticationStore
    }
  },
  computed: {
    // loggingIn() {
    //   return this.$store.state.authentication.status.loggingIn;
    // }
  },
  // created() {
  //   this.$store.dispatch('authentication/logout');
  // },
  methods: {
    signIn() {
      if (this.email && this.password) {
        this.authenticationStore.login(this.email, this.password)
            .then(()=>{
              router.push('/user')
            })
      }
    },
    signUp() {
      router.push('/signup')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@200;400&display=swap');

.custom-font {
  font-family: 'Raleway', sans-serif;
}
</style>
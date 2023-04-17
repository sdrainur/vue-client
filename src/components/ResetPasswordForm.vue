<template>
  <v-card
      class="mx-auto title"
      max-width="500"
  >
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <v-row justify="center" align="center">
        <h2 class="mt-5">Восстановление пароля</h2>
      </v-row>
    </v-card-title>

    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-text-field
              v-model="mail"
              label="Email"
              placeholder="mail@mail.ru"
          ></v-text-field>
          <span class="text-caption text-grey-darken-1">
            Введите почту, на которую был зарегестрирован ваш Meach аккаунт.
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-text>
          <v-text-field
              label="Код подтверждения"
              type="text"
              v-model="activationCode"
          ></v-text-field>
          <v-text-field
              v-model="password"
              label="Пароль"
              type="password"
          ></v-text-field>
          <v-text-field
              v-model="confirmPassword"
              label="Повторите пароль"
              type="password"
          ></v-text-field>
          <span class="text-caption text-grey-darken-1">
            Код подтверждени отпрален на почту
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="3">
        <div class="pa-4 text-center">
          <h3 class="text-h6 font-weight-light mb-2">
            Пароль восстановлен
          </h3>
        </div>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          v-if="step === 2"
          color="primary"
          variant="flat"
          @click="setNewPassword"
      >
        Сохранить
      </v-btn>
      <v-btn
          v-if="step === 1"
          variant="text"
          @click="sendMessage(); step++"
      >
        Отправить письмо
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {useToast} from "vue-toastification";
import axiosInstance from "@/service/axios.instance";

export default {
  name: "ResetPasswordForm",
  data() {
    return {
      step: 1,
      mail: null,
      password: null,
      confirmPassword: null,
      activationCode: null
    }
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  methods: {
    sendMessage() {
      axiosInstance
          .post("/signup/reset-password", {
            mail: this.mail
          })
    },
    setNewPassword() {
      if (this.password === this.confirmPassword) {
        axiosInstance
            .post("/signup/set-password", {
              activationCode: this.activationCode,
              password: this.password
            })
            .then(() => {
              this.toast.success("Пароль восстановлен!", {
                timeout: 5000
              })
              this.step++
            }).catch(error => {
              if (error.code === 'ERR_BAD_REQUEST') {
                this.toast.success("Неверный код подтверждения", {
                  timeout: 5000
                })
              }
            }
        )
      } else {
        this.toast.error("Пароли не совпадают")
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@200;400&display=swap');
.title {
  font-family: 'Raleway', sans-serif;
}
</style>
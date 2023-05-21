<template>
  <v-card
      class="mx-auto scroll"
      max-width="500"
      max-height="80vh"
      color="element"
  >
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <span>{{ currentTitle }}</span>
    </v-card-title>

    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-text-field
              v-model="user.email"
              label="Email"
              placeholder="example@example.ru"
          ></v-text-field>
          <v-text-field
              v-model="user.firstName"
              label="Имя"
              placeholder="example@example.ru"
          ></v-text-field>
          <v-text-field
              v-model="user.secondName"
              label="Фамилия"
              placeholder="login"
          ></v-text-field>
          <v-text-field
              v-model="user.password"
              label="Пароль"
              :type="show1 ? 'text' : 'password'"
              :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="show1 = !show1"
          ></v-text-field>
          <v-text-field
              v-model="confirmPassword"
              label="Подтверждение пароля"
              :type="show2 ? 'text' : 'password'"
              :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="show2 = !show2"
          ></v-text-field>
          <span class="text-caption text-grey-darken-1">
            Почта необходима для верификации вашего аккаунта.
          </span>
          <br/>
          <a class="link" @click="step++">Уже есть код подтверждения</a>
        </v-card-text>
      </v-window-item>
      <v-window-item :value="2">
        <v-card-text>
          <v-text-field
              v-model="activationCode"
              label="Код подтверждения"
          ></v-text-field>
          <span class="text-caption text-grey-darken-1">
            Код подтверждения был отправлен на почту, введенную вами ранее.
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="3">
        <div class="pa-4 text-center">
          <v-img
              class="mb-4"
              contain
              height="64"
              :src="require('/src/assets/images/logo-with-text.png')"
          ></v-img>
          <h3 class="text-h5 title mb-2">
            Добро пожаловать!
          </h3>
          <span class="text-caption text-grey">Благодарим вас за регистрацию!</span>
        </div>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn
          v-if="step === 1 && step !== 3"
          variant="text"
          @click="step--"
      >
        Назад
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
          v-if="step === 1"
          color="element"
          variant="flat"
          @click="signUp"
      >
        Далее
      </v-btn>
      <v-btn
          v-if="step === 2"
          color="light-item"
          variant="flat"
          @click="activate"
      >
        Далее
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {useToast} from "vue-toastification";
import axiosInstance from "@/service/axios.instance";

export default {
  name: "registration-form",
  data() {
    return {
      show1: false,
      show2: false,
      user: {
        email: null,
        password: null,
        firstName: null,
        secondName: null,
      },
      confirmPassword: null,
      step: 1,
      activationCode: null,
      valid: true,
      firstNameRules: [
        v => !!v || 'Введите имя'
      ],
      secondNameRules: [
        v => !!v || 'Введите фамилию'
      ],
      email: '',
      emailRules: [
        v => !!v || 'Введите почту',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v || 'Введите пароль'
      ],
      confirmPasswprdRules: [
        v => !!v || 'Подтвердите пароль'
      ],
      loginRules: [
        v => !!v || 'Введите логин'
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: false,
    }
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return 'Регистрация'
        case 2:
          return 'Подтверждение почты'
        default:
          return false
      }
    },
  },
  setup() {
    const toast = useToast();
    return {toast}
  },
  methods: {
    signUp() {
      if (this.confirmPassword === this.user.password) {
        axiosInstance
            .post('/signup', {
              email: this.user.email,
              password: this.user.password,
              firstName: this.user.firstName,
              secondName: this.user.secondName,
            }).then(() => {
           this.step++
        }).catch(error => {
          this.toast.error(error.response.data)
        })
      } else {
        this.toast.error("Пароли не совпадают")
      }
    },
    activate() {
      if (this.activationCode !== null) {
        console.log(this.activationCode)
        fetch('http://localhost:4000/signup/activate', {
          method: 'post',
          body: JSON.stringify({
            activationCode: this.activationCode
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          }
        })
        this.step++
      } else {
        this.toast.error("Введите код активации")
      }
    },
    async validate() {
      const {valid} = await this.$refs.form.validate()
      if (valid) alert('Form is valid')
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@200;400&display=swap');
.title {
  font-family: 'Raleway', sans-serif;
}
.scroll {
  overflow-y: scroll
}
.link{
  color: blue;
}
.link:hover{
  cursor: pointer;
}
</style>
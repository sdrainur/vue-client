<template>
  <app-bar/>
  <v-main>
    <div class="container">
      <app-navigation/>
      <div class="settings__content">
        <p class="settings__header">Настройки профиля</p>
        <v-card class="settings__card shadow">
          <form>
            <v-text-field
                v-model="user.firstName"
            ></v-text-field>

            <v-text-field
                label="Фамилия"
                v-model="user.secondName"
            ></v-text-field>

            <v-text-field
                label="Университет"
                v-model="userDescription.university"
            ></v-text-field>

            <v-text-field
                label="Образование"
                v-model="userDescription.studyField"
            ></v-text-field>

            <v-text-field
                label="Место работы"
                v-model="userDescription.employment"
            ></v-text-field>

            <v-text-field
                label="Должность"
                v-model="userDescription.jobPosition"
            ></v-text-field>

            <v-text-field
                label="Город"
                v-model="userDescription.city"
            ></v-text-field>

            <v-textarea
                label="Описание"
                v-model="userDescription.description"
            ></v-textarea>

            <v-text-field
                label="Стоимость занятия (час)"
                :rules="priceRules"
                v-model="userDescription.pricePerHour"
            ></v-text-field>


            <v-btn
                class="me-4"
                type="success"
                @click="save"
            >
              Сохранить
            </v-btn>

            <v-btn
                type="error">
              Отмена
            </v-btn>
          </form>
        </v-card>
      </div>
    </div>
  </v-main>
</template>

<script>
import AppBar from "@/components/AppBar";
import AppNavigation from "@/components/AppNavigation";
import axiosInstance from "@/service/axios.instance";
import {useAuthenticationStore} from "@/store/authentication.store";

export default {
  name: "SettingsComponent",
  components: {
    AppNavigation,
    AppBar
  },
  data() {
    return {
      user: {
        id: null,
        firstName: null,
        secondName: null,
        role: null
      },
      userDescription: {
        employment: null,
        jobPosition: null,
        university: null,
        studyField: null,
        pricePerHour: null,
        description: null,
        city: null
      },
      priceRules:[value=>{
        const pattern = /^(\s*|\d+)$/
        return pattern.test(value) || 'Сумма введена неверно.'
      }]
    }
  },
  setup() {
    const authenticationStore = useAuthenticationStore()

    return {
      authenticationStore
    }
  },
  beforeMount() {
    axiosInstance.get(`/user`)
        .then(result => {
          this.user = result.data
        })
    axiosInstance.get(`/user-description`)
        .then(result => {
          if (result.data !== null) {
            this.userDescription = result.data
          }
        })
  },
  methods: {
    loadData() {
      axiosInstance.get(`/user`)
          .then(result => {
            this.user = result.data
          })
      axiosInstance.get(`/user-description`)
          .then(result => {
            this.userDescription = result.data
          })
    },
    save() {
      // axiosInstance
      //     .post('/user/name', {
      //       firstName: this.user.firstName,
      //       secondName: this.user.secondName,
      //     })
      axiosInstance
          .post('/user-description', {
            employment: this.userDescription.employment,
            jobPosition: this.userDescription.jobPosition,
            university: this.userDescription.university,
            studyField: this.userDescription.studyField,
            pricePerHour: this.userDescription.pricePerHour,
            description: this.userDescription.description,
            city: this.userDescription.city
          })
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/global.scss";
@import "src/assets/scss/settings/settings.scss";

</style>
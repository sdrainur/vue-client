<template>
  <app-bar/>
  <v-main>
    <div class="container">
      <app-navigation/>
      <div style="margin-left: 200px" class="settings__content">
        <p>Настройки профиля</p>
        <v-card class="settings__card shadow">
          <v-card-title style="display: flex; justify-content: center">
            <v-avatar size="10vw">
              <v-img
                  :src='`http://localhost:4000/public/${profilePhoto}`'
                  cover
              ></v-img>
            </v-avatar>
            <div style="width: 100%">
              <v-file-input
                  v-model="photo"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Загрузить фото профиля"
                  prepend-icon="mdi-camera"
                  label="Фото профиля"
              ></v-file-input>
              <v-btn @click="loadPhoto()" color="success" style="margin-left: 40px">
                Сохранить
              </v-btn>
              <div style="margin-left: 40px">
                <v-switch
                    v-model="isMentorAccount"
                    hide-details
                    inset
                    :label="isMentorAccount ? 'Статус ментора включен' : 'Статус ментора выключен' "
                    @click="changeRole"
                ></v-switch>
              </div>
            </div>
          </v-card-title>
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

            <v-select
                v-model="userDescription.categoryId"
                label="Категория"
                :items="categories"
                item-title="name"
                item-value="id"
            ></v-select>

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
        city: null,
        categoryId: null
      },
      priceRules: [value => {
        const pattern = /^(\s*|\d+)$/
        return pattern.test(value) || 'Сумма введена неверно.'
      }],
      photo: null,
      profilePhoto: null,
      isMentorAccount: false,
      categories: null,
      selectedCategory: null,
    }
  },
  computed: {
    photoUrl() {
      return 'data:image/jpeg;base64,' + btoa(
          new Uint8Array(this.info.image)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
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
          axiosInstance.get(`/profile-photo/${result.data.id}`).then(res => {
            console.log(res)
            this.profilePhoto = res.data.imageName;
          })
          this.isMentorAccount = result.data.role === 'MENTOR'
        })
    axiosInstance.get(`/user-description`)
        .then(result => {
          if (result.data !== null) {
            this.userDescription = result.data
          }
        })
    axiosInstance.get('/categories').then(result => {
      // this.categories = result.data.map(d=>d.name)
      this.categories = result.data
      // this.userDescription.categoryId = String(this.userDescription.categoryId)
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
            city: this.userDescription.city,
            categoryId: this.userDescription.categoryId
          })
    },
    loadPhoto() {
      if (!this.photo) {
        return
      }
      let formData = new FormData();
      formData.append('file', this.photo[0])
      axiosInstance.post('profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data boundary=---some-random-string'
        }
      })
          .then(() => {
            location.reload()
          })
    },
    changeRole() {
      const role = this.isMentorAccount ? 'USER' : 'MENTOR'
      axiosInstance.post(`/change-role/${role}`).then(res => {
        if (res.status === 200) {
          this.$toast.success('Статус аккаунта изменен')
        }
      }).catch((error) => {
        this.$toast.error(error.code)
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/global.scss";
@import "src/assets/scss/settings/settings.scss";

</style>
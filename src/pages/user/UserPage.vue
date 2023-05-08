<template>
  <app-bar></app-bar>
  <v-main>
    <div class="container">
      <app-navigation></app-navigation>
      <div style="width: 100%;">
        <div class="content">
          <div style="width: 100%;">
            <v-card
                class="shadow"
                style="border-radius: 10px; width: 100%; max-width: 100%"
                color="element"
            >
              <v-img
                  :src="require('../../assets/images/ava-95.jpg')"
                  height="100px"
                  cover
                  style="filter: blur(40px); -webkit-filter: blur(40px);"
              ></v-img>

              <div class="content" style="padding: 0 5px">
                <v-avatar size="10vw">
                  <v-img
                      :src="require('../../assets/images/ava-95.jpg')"
                      cover
                  ></v-img>
                </v-avatar>
                <div style="padding: 0 15px; margin-left: 50px">
                  <v-card-title class="user__name" style="margin-bottom: 10px">{{
                      user.firstName + ' ' + user.secondName
                    }}
                  </v-card-title>
                  <v-card-text class="text__primary info__item">
                    <v-icon style="margin-right: 5px;">mdi-text-account</v-icon>
                    <p>{{ userDescription ? userDescription.description : 'Описание отсутствует' }}</p>
                  </v-card-text>
                  <v-card-text class="text__primary info__item">
                    <v-icon style="margin-right: 5px;">mdi-school-outline</v-icon>
                    <p>
                      {{
                        userDescription ? userDescription.university + ', ' + userDescription.studyField : 'Информация об образовании отстутствует'
                      }}
                    </p>
                  </v-card-text>
                  <v-card-text class="text__primary info__item">
                    <v-icon style="margin-right: 5px;">mdi-briefcase-outline</v-icon>
                    <p>
                      {{
                        userDescription ? userDescription.employment + ', ' + userDescription.jobPosition : 'Информация о карьере отстутствует'
                      }}
                    </p>
                  </v-card-text>
                  <v-card-text class="text__primary info__item">
                    <v-icon>mdi-map-marker-outline</v-icon>
                    <p>
                      {{ userDescription ? userDescription.city : 'Информация о городе отстутствует' }}
                    </p>
                  </v-card-text>
                  <v-card-text class="text__primary info__item" style="margin-left: 5px">
                    <rating-modal-component/>
                  </v-card-text>
                </div>
              </div>
              <div>
                <div class="d-flex flex-column align-center">
                  <v-btn-toggle
                      color="primary"
                      style="border-radius: 20px; height: 30px"
                      v-model="onboarding"
                  >
                    <v-btn variant="outlined" :value="0">Статьи</v-btn>
                    <v-btn variant="outlined" :value="1">Описание</v-btn>
                    <v-btn variant="outlined" :value="2">Статистика</v-btn>
                    <v-btn variant="outlined" :value="3">Запись на занятие</v-btn>
                  </v-btn-toggle>
                </div>
                <v-window
                    v-model="onboarding"
                    show-arrows="hover"
                >
                  <v-window-item
                      :value="0"
                  >
                    <v-card
                        elevation="2"
                        height="200"
                        class="d-flex align-center justify-center ma-2"
                    >
                      <h1
                          class="text-h2"
                      >
                        Статьи
                      </h1>
                    </v-card>
                  </v-window-item>
                  <v-window-item
                      :value="1"
                  >
                    <v-card
                        elevation="2"
                        height="200"
                        class="d-flex align-center justify-center ma-2"
                    >
                      <h1
                          class="text-h2"
                      >
                        Описание
                      </h1>
                    </v-card>
                  </v-window-item>
                  <v-window-item
                      :value="2"
                  >
                    <v-card color="element" style="padding: 10px">
                      <canvas id="myChart"></canvas>
                    </v-card>
                  </v-window-item>
                  <v-window-item
                      :value="3"
                  >
                    <v-card
                        elevation="2"
                        height="200"
                        class="d-flex align-center justify-center ma-2"
                    >
                      <h1
                          class="text-h2"
                      >
                        Запись на занятие
                      </h1>
                    </v-card>
                  </v-window-item>
                </v-window>
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </div>
  </v-main>
</template>


<script>
import AppBar from "@/components/AppBar";
import AppNavigation from "@/components/AppNavigation";
import axiosInstance from "@/service/axios.instance";
import {loadPlan} from "@/service/lessons.service";
import {isProxy, toRaw} from 'vue';
import {useAuthenticationStore} from "@/store/authentication.store";
import RatingModalComponent from "@/pages/user/rating-modal/rating-modal-component";
import Chart from 'chart.js/auto'

export default {
  name: "UserPage",
  components: {
    RatingModalComponent,
    // LessonPurchase,
    AppNavigation,
    AppBar
  },
  data() {
    return {
      length: 4,
      onboarding: 2,
      show: false,
      user: {
        firstName: null,
        secondName: null,
        role: null,
        id: null
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
      newPost: false,
      date: new Date(),
      timezone: '',
      lessonsPlan: null,
      authUserId: null,
    }
  },
  setup() {
    const authenticationStore = useAuthenticationStore()

    return {
      authenticationStore
    }
  },
  beforeMount() {
    this.authUserId = this.authenticationStore.getUserId
    axiosInstance.get(this.$route.path).then(res => {
      this.user = res.data
      loadPlan(this.user.role, this.user.id).then(result => {
        // this.lessonsPlan = result.data.toRaw()
        // console.log(result.data[0])
        this.lessonsPlan = isProxy(result.data) ? toRaw(result.data) : result.data
        console.log(this.lessonsPlan)
      })
      axiosInstance.get(`/user-description/${this.user.id}`)
          .then(result => {
            this.userDescription = result.data
          })
    })
  },
  mounted() {
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        datasets: [{
          label: 'Количество проведенных занятий',
          data: [12, 19, 3, 5, 2, 3, 7, 5, 9, 10, 18, 25],
          borderWidth: 1,
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          lineWidth: 1,
          tension: 0.3
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  },
  methods: {
    setLessons(data) {
      this.lessonsPlan = data
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  width: 100%;
  max-width: 1170px;
  margin: 0 auto;
  padding: 15px 0 0 0;
}

.content {
  display: flex;
  flex-direction: row;
  margin-left: 50px;
}

.content__header {
  display: flex;
  width: 100%;
  border-radius: 15px;
  padding: 15px;
  margin: 15px;
}

.shadow {
  -webkit-box-shadow: 17px 6px 29px 10px rgba(34, 60, 80, 0.07);
  -moz-box-shadow: 17px 6px 29px 10px rgba(34, 60, 80, 0.07);
  box-shadow: 17px 6px 29px 10px rgba(34, 60, 80, 0.07);
}

.user__name {
  font-family: 'Montserrat', sans-serif;
  text-align: start;
  font-size: 30px;
  font-weight: 500;
}

.text__primary {
  font-family: 'Montserrat', sans-serif;
  text-align: start;
  font-size: 15px;
  font-weight: 400;
}

.text__title {
  font-family: 'Montserrat', sans-serif;
  text-align: center;
  font-size: 25px;
  font-weight: 400;
}

.button {
  background: #dcddf9;
  border-radius: 15px;
}

.new-post {
  display: flex;
  justify-content: center;
}

.new-post__inner {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #eeeded;
  width: 750px;
  max-width: 90%;
}

.input {

}

.info__item {
  display: flex;
  flex-direction: row;
  padding: 10px 15px;
}


</style>
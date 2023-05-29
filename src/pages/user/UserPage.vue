<template>
  <app-bar></app-bar>
  <v-main>
    <div class="container">
      <app-navigation></app-navigation>
      <div style="width: 100%; margin-left: 180px">
        <div class="content">
          <div style="width: 100%;">
            <v-card
                class="shadow"
                style="border-radius: 10px; width: 100%; max-width: 100%"
                color="element"
            >
              <v-img
                  :src='`http://localhost:4000/public/${userDescription.profilePhotoName}`'
                  height="100px"
                  cover
                  style="filter: blur(40px); -webkit-filter: blur(40px);"
              ></v-img>

              <div class="content" style="padding: 0 5px">
                <v-avatar size="10vw">
                  <v-img
                      :src='`http://localhost:4000/public/${userDescription.profilePhotoName}`'
                      cover
                  ></v-img>
                </v-avatar>
                <div style="padding: 0 15px; margin-left: 50px">
                  <v-card-title class="user__name" style="margin-bottom: 10px">{{
                      user.firstName + ' ' + user.secondName
                    }}
                  </v-card-title>
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
                    <!--                    <rating-modal-component/>-->
                    <p>({{ totalScore }})</p>
                    <v-rating
                        v-model="totalScore"
                        readonly
                        color="yellow"
                        size="28"
                    ></v-rating>
                  </v-card-text>
                  <v-card-text v-if="user.role==='MENTOR' && user.id !== authUserId">
                    <LessonPurchase :mentor="user" :lessons-plan="lessonsPlan"/>
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
<!--                    <v-btn variant="outlined" :value="0">Статьи</v-btn>-->
                    <v-btn variant="outlined" :value="1">Описание</v-btn>
                    <v-btn v-if="user.role==='MENTOR'" variant="outlined" :value="2" @click="openChart()">Статистика</v-btn>
                    <v-btn variant="outlined" :value="3">Отзывы</v-btn>
                  </v-btn-toggle>
                </div>
                <v-window
                    v-model="onboarding"
                >
                  <v-window-item
                      :value="0"
                  >
                    <v-card
                        class="mx-auto"
                        color="element"
                        style="margin: 0 10px 10px 10px; padding: 5px; border: none; box-shadow: none"
                    >
                      <v-container>
                        <v-row dense>
                          <v-col cols="12">
                            <v-card
                                color="light_item">
                              <v-card-text>
                                <v-text-field
                                    density="compact"
                                    variant="outlined"
                                    label="Новая запись"
                                    append-inner-icon="mdi-send"
                                    single-line
                                    hide-details
                                ></v-text-field>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col cols="12" v-for="i in [1, 2, 3, 4,4,4,4,4,]" :key="i">
                            <v-card
                                color="light_item"
                                style="margin-top: 10px"
                            >
                              <v-card-title class="text-h5">
                                Unlimited music now
                              </v-card-title>

                              <v-card-subtitle>Listen to your favorite artists and albums whenever and wherever, online
                                and offline.
                              </v-card-subtitle>

                              <v-card-actions>
                                <v-btn variant="text">
                                  Listen Now
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </v-window-item>
                  <v-window-item
                      :value="1"
                  >
                    <v-card
                        elevation="2"
                        height="200"
                        style="background-color: rgba(255,255,255,0); border: none; box-shadow: none"
                        class=" ma-2"
                    >
                      <v-card-title class="text__title">Описание</v-card-title>
                      <v-card-text class="d-flex justify-center text__primary info__item">
                        <p v-if="!userDescription">
                          Пользователь не оставил дополнительной информации о себе
                        </p>
                        <p v-if="userDescription">
                          {{ userDescription.description ? userDescription.description : 'Пользователь не оставил дополнительной информации о себе' }}
                        </p>
                      </v-card-text>
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
                        color="element"
                        style="border: none; box-shadow: none; padding: 5px; margin: 10px">
                      <!--                      <rating-modal-component/>-->
                      <div class="rating__card__container">
                        <v-card color="light_item" class="rating__card">
                          <v-card-text>
                            <div v-if="!getMyFeedback">
                              <v-card-title>Новый отзыв</v-card-title>
                              <div class="rating__card__container">
                                <v-rating
                                    color="grey"
                                    active-color="yellow-accent-4"
                                    hover
                                    size="30"
                                    v-model="newRating.score"
                                ></v-rating>
                                <v-textarea :value="newRating.text" @input="newRating.text=$event.target.value"
                                            label="Отзыв">
                                </v-textarea>
                                <v-btn style="background: rgba(220,221,249,0.28)" @click="postFeedback">
                                  Отправить
                                </v-btn>
                              </div>
                            </div>
                            <div class="feedback__list">
                              <div class="feedback__item" v-if="getMyFeedback">
                                <div style="display: flex; justify-content: space-between">
                                  <p class="feedback__name">Мой отзыв</p>
                                  <v-btn
                                      variant="plain"
                                      @click="deleteFeedback(getMyFeedback.id)">
                                    <v-icon size="22">mdi-close</v-icon>
                                  </v-btn>
                                </div>
                                <span class="text-grey text-caption me-2">({{ getMyFeedback.score }})</span>
                                <v-rating
                                    v-model="getMyFeedback.score"
                                    color="light-gray"
                                    active-color="yellow-accent-4"
                                    half-increments
                                    readonly
                                    hover
                                    size="20"
                                ></v-rating>
                                <p class="feedback__text">{{ getMyFeedback.text }}</p>
                                <hr/>
                              </div>
                              <div class="feedback__item" v-for="feedback in getOtherFeedbacks"
                                   v-bind:key="feedback.id">
                                <p class="feedback__name">Анонимый пользователь</p>
                                <span class="text-grey text-caption me-2">({{ feedback.score }})</span>
                                <v-rating
                                    v-model="feedback.score"
                                    color="light-gray"
                                    active-color="yellow-accent-4"
                                    half-increments
                                    readonly
                                    hover
                                    size="20"
                                ></v-rating>
                                <p class="feedback__text">{{ feedback.text }}</p>
                                <hr/>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </div>
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
// import RatingModalComponent from "@/pages/user/rating-modal/rating-modal-component";
import Chart from 'chart.js/auto'
import LessonPurchase from "@/components/LessonPurchase.vue";
// import LessonPurchase from "@/components/LessonPurchase";

export default {
  name: "UserPage",
  components: {
    LessonPurchase,
    // LessonPurchase,
    // RatingModalComponent,
    AppNavigation,
    AppBar
  },
  data() {
    return {
      length: 4,
      onboarding: 1,
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
        city: null,
        profilePhotoName: null,
      },
      newPost: false,
      date: new Date(),
      timezone: '',
      lessonsPlan: null,
      authUserId: null,
      newRating: {
        score: null,
        text: null,
      },
      totalScore: null,
      feedbacks: null,
      profilePhoto: null
    }
  },
  computed: {
    availableHours() {
      const selectedDate = new Date(this.date)
      let hours = []
      this.lessonsPlan.forEach(el => {
        const currentDate = new Date(el.lessonStartTime)
        if (currentDate.getDate() === selectedDate.getDate()
            && currentDate.getMonth() === selectedDate.getMonth()
            && currentDate.getFullYear() === selectedDate.getFullYear()) {
          hours.push(currentDate.getHours())
        }
      })
      const allTimes = [...Array(23).keys()].map(i => i + 1);
      const availableHours = allTimes.filter(el =>
          !hours.includes(el)
      )
      return availableHours
    },
    getMyFeedback() {
      return this.feedbacks.find(feedback => feedback.authorId == this.authUserId);
    },
    getOtherFeedbacks() {
      return this.feedbacks.map(feedback => {
        if (Number(feedback.authorId) !== Number(this.authUserId)) {
          return feedback
        }
      }).filter((element) => {
        return element !== undefined;
      });
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
      })
      axiosInstance.get(`/user-description/${this.user.id}`)
          .then(result => {
            this.userDescription = result.data
            console.log(result.data)
          })
      axiosInstance.get(`/feedbacks/${this.user.id}`).then(res => {
        this.totalScore = res.data.totalScore;
        this.feedbacks = res.data.feedbacks
      })
      console.log(res.data.id)
      axiosInstance.get(`/profile-photo/${res.data.id}`).then(photo => {
        this.profilePhoto = photo.data.imageName;
        console.log(photo.data.imageName)
      })
    })
  },
  methods: {
    setLessons(data) {
      this.lessonsPlan = data
    },
    buyLesson() {
      axiosInstance
          .post('/lessons/add-one', {
            mentorId: this.mentor.id,
            lessonStartTime: new Date(this.date)
          }).then(response => {
        if (response.status === 200) {
          loadPlan(this.user.role, this.user.id).then(result => {
            this.$emit('setLessons', result.data)
          })
          this.$toast.success('Чел харош')
          this.newPost = false
        }
      }).catch(() => {
        this.$toast.error('Кринжанул')
      })
    },
    openChart() {
      setTimeout(() => {
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
      }, 250)
    },
    postFeedback() {
      axiosInstance.post('/add-feedback', {
        mentorId: this.user.id,
        text: this.newRating.text,
        score: this.newRating.score
      }).then(() => {
        axiosInstance.get(`/feedbacks/${this.user.id}`).then(res => {
          if(res.status === 200){
            this.$toast.success('Отзыв добавлен!')
          }
          this.totalScore = res.data.totalScore;
          this.feedbacks = res.data.feedbacks
        })
      })
    },
    deleteFeedback(feedbackId) {
      axiosInstance.delete(`/feedback/${feedbackId}`).then(() => {
        axiosInstance.get(`/feedbacks/${this.user.id}`).then(res => {
          if(res.status === 200){
            this.$toast.success('Отзыв удален!')
          }
          this.totalScore = res.data.totalScore;
          this.feedbacks = res.data.feedbacks;
        })
      })
    }
  },
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
  padding: 0 20px;
  display: flex;
  justify-content: start;
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
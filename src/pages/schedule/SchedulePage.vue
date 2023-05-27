<template>
  <app-bar></app-bar>
  <v-main>
    <div class="container">
      <app-navigation></app-navigation>
      <div style="margin-left: 210px; width: 100% " class="content">
        <v-card class="card__schedule shadow" >
          <v-card-title class="schedule__header">Расписание</v-card-title>
<!--          <VueScheduler-->
<!--              :events="events"-->
<!--              @select-date="openDailySchedule"-->
<!--              class="schedule"/>-->
          <v-table
              fixed-header
              height="300px"
              style="background-color: rgba(235,235,235,0)"
          >
            <thead style="background-color: #ebebeb">
            <tr>
              <th class="text-left">
                Дата
              </th>
              <th class="text-left">
                Время
              </th>
              <th class="text-left">
                Ментор
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="lesson in events"
                :key="lesson.mentorId"
            >
              <td>{{ lesson.date.toLocaleString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</td>
              <td>{{ lesson.interval.from + '0 - ' + lesson.interval.to + '0' }}</td>
              <td>{{ lesson.mentorId  }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-card>
      </div>
      <v-dialog
          v-model="dailySchedule"
      >
        <v-card class="card__daily">
          <v-card-title class="schedule__daily__header">{{ this.selectedDate }}</v-card-title>
          <v-list class="list__lesson">
            <div v-if="dailyScheduleInfo==null">
              <p class="empty__schedule__message">Нет записей</p>
            </div>
            <v-list-item
                v-for="infoItem in dailyScheduleInfo"
                :key="infoItem.id"
                :value="infoItem"
                class="list__item"
            >
              <template class="list__template"
                        @click="openUser(infoItem)">
                <p class="schedule__item__name">{{ infoItem.firstName + ' ' + infoItem.secondName }}</p>
                <p class="schedule__item__time">
                  {{
                    'Время: ' + new Date(infoItem.lessonStartTime).toLocaleTimeString("ru-RU")
                    + ' - '
                    + new Date(infoItem.lessonEndTime).toLocaleTimeString("ru-RU")
                  }}
                </p>
              </template>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-btn color="primary" block @click="closeDailySchedule">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-main>
</template>

<script>
import AppBar from "@/components/AppBar";
import AppNavigation from "@/components/AppNavigation";
// import VueScheduler from '@glhrm/vue-scheduler';
import axiosInstance from "@/service/axios.instance";
import {useAuthenticationStore} from "@/store/authentication.store";

export default {
  name: "SchedulePage",
  components: {AppNavigation, AppBar},
  // components: {AppNavigation, AppBar, VueScheduler},
  data() {
    return {
      dailySchedule: false,
      dailyScheduleInfo: null,
      selectedDate: null,
      events: [],
      authUserId: null,
    }
  },
  setup() {
    const authenticationStore = useAuthenticationStore()

    return {
      authenticationStore
    }
  },
  mounted() {
    this.authUserId = this.authenticationStore.getUserId
    axiosInstance.get('/lesson/plan')
        .then(response => {
          console.log(response)
          this.events.push(...response.data.map((lesson) => {
            const startDate = new Date(lesson.lessonStartTime)
            const endDate = new Date(lesson.lessonEndTime)
            return {
              date: startDate,
              interval: {
                from: `${startDate.getHours()}:${startDate.getMinutes()}`,
                to: `${endDate.getHours()}:${endDate.getMinutes()}`
              },
              mentorId: lesson.mentorId
            }
          }))
        })
  },
  methods: {
    openDailySchedule(data) {
      this.dailySchedule = true
      this.selectedDate = data.date.toLocaleDateString("ru-RU", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      axiosInstance.get(`/lessons/${data.date.getFullYear()}/${data.date.getMonth()}/${data.date.getDate()}`)
          .then(response => {
            this.dailyScheduleInfo = response.data
          })

    },
    closeDailySchedule() {
      this.dailySchedule = false
      this.dailyScheduleInfo = null;
      this.selectedDate = null;
    },
    openUser(infoItem) {
      if (this.authUserId == infoItem.mentorId) {
        this.$router.push(`/user/${infoItem.userId}`)
      } else if (this.authUserId == infoItem.userId) {
        this.$router.push(`/user/${infoItem.mentorId}`)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/global";
@import "../../assets/scss/schedule-page/schedule";
</style>
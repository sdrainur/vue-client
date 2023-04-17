<template>
  <app-bar></app-bar>
  <v-main>
    <div class="container">
      <app-navigation></app-navigation>
      <div class="content">
        <p class="schedule__header">Расписание</p>
        <v-card class="card__schedule shadow">
          <VueScheduler
              :events="events"
              @select-date="click"
              class="schedule"/>
        </v-card>
      </div>
    </div>
  </v-main>
</template>

<script>
import AppBar from "@/components/AppBar";
import AppNavigation from "@/components/AppNavigation";
import VueScheduler from '@glhrm/vue-scheduler';
import axiosInstance from "@/service/axios.instance";

export default {
  name: "SchedulePage",
  components: {AppNavigation, AppBar, VueScheduler},
  emits: ['selectDate'],
  data() {
    return {
      events: [
        {
          date: new Date(2023, 3, 18),
          interval: {from: '11:00', to: '12:00'}
        }
      ]
    }
  },
  mounted() {
    axiosInstance.get('/lesson/plan')
        .then(response => {
          this.events.push(...response.data.map((lesson) => {
            const startDate = new Date(lesson.lessonStartTime)
            const endDate = new Date(lesson.lessonEndTime)
            return {
              date: startDate,
              interval: {
                from: `${startDate.getHours()}:${startDate.getMinutes()}`,
                to: `${endDate.getHours()}:${endDate.getMinutes()}`
              }
            }
          }))
        })
  },
  methods: {
    click(data) {
      console.log(data.date)
      axiosInstance.get(`/lessons/${data.date.getFullYear()}/${data.date.getMonth()}/${data.date.getDate()}`)
          .then(response => {
            console.log(response)
          })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/global";
@import "../../assets/scss/schedule-page/schedule";
</style>
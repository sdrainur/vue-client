<template>
  <v-dialog
      v-model="newPost"
      persistent
  >
    <template v-slot:activator="{ props }">
      <v-btn class="button" v-bind="props">Записаться на занятие</v-btn>
    </template>
    <div class="new-post" style="height: 500px">
      <v-card class="new-post__inner" style="border-radius: 15px">
        <v-card-title class="text__title">
          Новая запись
        </v-card-title>
        <v-card-text>
          <v-date-picker
              v-model="date"
              class="flex-grow"
              mode="dateTime"
              is24hr
              :minute-increment="60"
              :validHours="availableHours"
          >
            <template v-slot="{ inputValue, inputEvents }">
              <v-text-field
                  id="date"
                  :value="inputValue"
                  v-on="inputEvents"
              />
            </template>
          </v-date-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green-darken-1"
              variant="text"
              @click="newPost = false"
          >
            Отмена
          </v-btn>
          <v-btn
              color="green-darken-1"
              variant="text"
              @click="buyLesson"
          >
            Записаться
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>

import axiosInstance from "@/service/axios.instance";
import {loadPlan} from "@/service/lessons.service";

export default {
  name: "LessonPurchase",
  props: {
    mentor: {
      firstName: null,
      secondName: null,
      role: null,
      id: null
    },
    lessonsPlan: null
  },
  data() {
    return {
      newPost: false,
      date: new Date(),
      timezone: '',
    }
  },
  computed: {
    availableHours() {
      const selectedDate = new Date(this.date)
      console.log(this.lessonsPlan)
      console.log(new Date(this.date).getFullYear())
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
      console.log(allTimes)
      console.log(hours)
      const availableHours = allTimes.filter(el =>
          !hours.includes(el)
      )
      console.log(availableHours)
      return availableHours
    }
  },
  methods: {
    buyLesson() {
      axiosInstance
          .post('/lessons/add-one', {
            mentorId: this.mentor.id,
            lessonStartTime: new Date(this.date)
          }).then(response => {
        if (response.status === 200) {
          console.log('fefe')
          loadPlan(this.user.role, this.user.id).then(result => {
            this.$emit('setLessons', result.data)
          })
          this.$toast.success('Чел харош')
          this.newPost = false
        }
      }).catch(()=>{
        this.$toast.error('Кринжанул')
      })
      console.log(new Date(this.date))
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  max-width: 1170px;
  margin: 0 auto;
  padding: 15px 0 0 0;
}

.content {
  display: flex;
  flex-direction: column;
  margin-left: 50px;
}

.content__header {
  display: flex;
  width: 100%;
  border-radius: 15px;
  padding: 15px;
  margin: 15px;
  background: rgba(251, 251, 251, 0.42);
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

.date-time__picker {
  display: flex;
  flex-direction: row;
}
</style>
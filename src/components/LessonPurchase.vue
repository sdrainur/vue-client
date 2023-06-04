<template>
  <v-dialog
      v-model="newPost"
  >
    <template v-slot:activator="{ props }">
      <v-btn color="primary" variant="outlined" class="button" v-bind="props">Записаться на занятие</v-btn>
    </template>
    <!--    <div class="new-post" style="height: 500px">-->
    <!--      <v-card class="new-post__inner" style="border-radius: 15px">-->
    <!--        <v-card-title class="text__title">-->
    <!--          Новая запись-->
    <!--        </v-card-title>-->
    <!--        <v-card-text>-->
    <!--          <v-date-picker-->
    <!--              v-model="date"-->
    <!--              class="flex-grow"-->
    <!--              mode="dateTime"-->
    <!--              is24hr-->
    <!--              :minute-increment="60"-->
    <!--              :validHours="availableHours"-->
    <!--          >-->
    <!--            <template v-slot="{ inputValue, inputEvents }">-->
    <!--              <v-text-field-->
    <!--                  id="date"-->
    <!--                  :value="inputValue"-->
    <!--                  v-on="inputEvents"-->
    <!--              />-->
    <!--            </template>-->
    <!--          </v-date-picker>-->
    <!--        </v-card-text>-->
    <!--        <v-card-actions>-->
    <!--          <v-spacer></v-spacer>-->
    <!--          <v-btn-->
    <!--              color="green-darken-1"-->
    <!--              variant="text"-->
    <!--              @click="newPost = false"-->
    <!--          >-->
    <!--            Отмена-->
    <!--          </v-btn>-->
    <!--          <v-btn-->
    <!--              color="green-darken-1"-->
    <!--              variant="text"-->
    <!--              @click="buyLesson"-->
    <!--          >-->
    <!--            Записаться-->
    <!--          </v-btn>-->
    <!--        </v-card-actions>-->
    <!--      </v-card>-->
    <!--    </div>-->
    <v-card
        class="mx-auto"
        width="500"
        color="light_item"
    >
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span class="text__title">{{ currentTitle }}</span>
      </v-card-title>

      <v-window v-model="step">
        <v-window-item :value="1">
          <v-card-text>
            <div style="height: 400px">
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
              <v-card-text style="height: 80%" class="d-flex justify-center align-center text__primary">
                <p>Выберите удобную для вас дату и время</p>
              </v-card-text>
            </div>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="2">
          <v-card-text>
            <v-text-field
                label="Номер банковской карты"
            ></v-text-field>
            <v-text-field
                label="Имя и фамилия держателя карты"
                type="password"
            ></v-text-field>
            <div style="display:flex; flex-direction: row; width: 100%">
              <v-text-field
                  label="CVV  "
              ></v-text-field>
              <v-text-field
                  label="Срок действия карты"
              ></v-text-field>
            </div>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="3">
          <div class="pa-4 text-center">
            <h3 class="text-h6 font-weight-light mb-2">
              Запись оформлена успешно!
            </h3>
            <span class="text-caption text-grey"></span>
          </div>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
            v-if="step > 1"
            variant="text"
            @click="step--"
        >
          Назад
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            v-if="step < 3"
            color="primary"
            variant="flat"
            @click="buyLesson()"
        >
          Далее
        </v-btn>
      </v-card-actions>
    </v-card>
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
    lessonsPlan: null,
  },
  data() {
    return {
      newPost: false,
      date: new Date(),
      timezone: '',
      step: 1
    }
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return 'Выбор времени '
        case 2:
          return 'Оплата'
        default:
          return 'Запись оформлена'
      }
    },
    availableHours() {
      const selectedDate = new Date(this.date)
      let hours = []
      if (this.lessonsPlan) {
        this.lessonsPlan.forEach(el => {
          const currentDate = new Date(el.lessonStartTime)
          if (currentDate.getDate() === selectedDate.getDate()
              && currentDate.getMonth() === selectedDate.getMonth()
              && currentDate.getFullYear() === selectedDate.getFullYear()) {
            hours.push(currentDate.getHours())
          }
        })
      }
      const allTimes = [...Array(23).keys()].map(i => i + 1);
      console.log(allTimes)
      console.log(hours)
      const availableHours = hours.length ? allTimes.filter(el =>
          !hours.includes(el)
      ) : allTimes
      console.log(availableHours)
      return availableHours
    }
  },
  methods: {
    buyLesson() {
      if (this.step === 2) {
        axiosInstance
            .post('/lessons/add-one', {
              mentorId: this.mentor.id,
              lessonStartTime: new Date(this.date)
            }).then(response => {
          console.log(response.status)
          if (response.status === 200) {
            this.step++
            loadPlan(this.mentor.role, this.mentor.id).then(result => {
              this.$emit('setLessons', result.data)
            })
          } else {
            this.$toast.error('Ошибка покупки')
          }
        })
        console.log(new Date(this.date))
      } else {
        this.step++
      }
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
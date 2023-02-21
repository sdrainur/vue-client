<template>
  <app-bar></app-bar>
  <v-main>
    <div class="container">
      <app-navigation></app-navigation>
      <div style="width: 100%;">
        <div class="content">
          <v-card class="content__header shadow">
            <v-card-item>
              <v-avatar size="10vw">
                <v-img
                    :src="require('../assets/images/6-sep-2017-beauty-salons-where-are-best-face-peeli-op.jpg.jpg')"
                ></v-img>
              </v-avatar>
            </v-card-item>
            <div style="padding: 0 15px">
              <v-card-title class="user__name">{{ user.firstName + ' ' + user.secondName }}</v-card-title>
              <v-card-text class="text__primary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid
                aspernatur
                aut beatae cumque dicta distinctio dolorem excepturi exercitationem, ipsam itaque nemo neque officia
                optio porro, provident quis, saepe sed ut?
              </v-card-text>
              <v-card-text class="text__primary">
                <v-icon icon="mdi-map-marker-outline" style=""></v-icon>
                Казань
              </v-card-text>
            </div>
          </v-card>
          <v-card class="content__header shadow">
            <LessonPurchase :mentor="user" :lessons-plan="lessonsPlan"></LessonPurchase>
            <!--            <v-dialog-->
            <!--                v-model="newPost"-->
            <!--                persistent-->
            <!--            >-->
            <!--              <template v-slot:activator="{ props }">-->
            <!--                <v-btn class="button" v-bind="props">Новая запись</v-btn>-->
            <!--              </template>-->
            <!--              <div class="new-post">-->
            <!--                <v-card class="new-post__inner" style="border-radius: 15px">-->
            <!--                  <v-card-title class="text__title">-->
            <!--                    Новая запись-->
            <!--                  </v-card-title>-->
            <!--                  <v-card-text>-->
            <!--                    <div class="input">-->
            <!--                      <v-text-field-->
            <!--                          variant="outlined"-->
            <!--                          label="Заголовок"-->
            <!--                          style="margin-top: 15px"-->
            <!--                      /><v-textarea-->
            <!--                          variant="outlined"-->
            <!--                          label="Текст"-->
            <!--                      ></v-textarea>-->
            <!--                      <v-file-input-->
            <!--                          label="Файл"-->
            <!--                          variant="outlined"-->
            <!--                      ></v-file-input>-->
            <!--                    </div>-->
            <!--                  </v-card-text>-->
            <!--                  <v-card-actions>-->
            <!--                    <v-spacer></v-spacer>-->
            <!--                    <v-btn-->
            <!--                        color="green-darken-1"-->
            <!--                        variant="text"-->
            <!--                        @click="newPost = false"-->
            <!--                    >-->
            <!--                      Отмена-->
            <!--                    </v-btn>-->
            <!--                    <v-btn-->
            <!--                        color="green-darken-1"-->
            <!--                        variant="text"-->
            <!--                        @click="newPost = false"-->
            <!--                    >-->
            <!--                      Опубликовать-->
            <!--                    </v-btn>-->
            <!--                  </v-card-actions>-->
            <!--                </v-card>-->
            <!--              </div>-->
            <!--            </v-dialog>-->
          </v-card>
        </div>
      </div>
    </div>
  </v-main>
</template>


<script>
import AppBar from "@/components/AppBar";
import AppNavigation from "@/components/AppNavigation";
import axiosInstance from "@/service/axios.instance";
import LessonPurchase from "@/components/LessonPurchase";
import {loadPlan} from "@/service/lessons.service";
import {isProxy, toRaw} from 'vue';

export default {
  name: "UserPage",
  components: {
    LessonPurchase,
    AppNavigation,
    AppBar
  },
  data() {
    return {
      user: {
        firstName: null,
        secondName: null,
        role: null,
        id: null
      },
      newPost: false,
      date: new Date(),
      timezone: '',
      lessonsPlan: null
    }
  },
  mounted() {
    axiosInstance.get(this.$route.path).then(res => {
      this.user = res.data
      loadPlan(this.user.role, this.user.id).then(result => {
        // this.lessonsPlan = result.data.toRaw()
        // console.log(result.data[0])
        this.lessonsPlan = isProxy(result.data) ? toRaw(result.data) : result.data
        console.log(this.lessonsPlan)
      })
    })
  },
  methods: {
    setLessons(data) {
      this.lessonsPlan = data
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

.input {

}


</style>
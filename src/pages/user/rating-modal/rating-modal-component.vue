<template>
  <div>
    <!--    <div class="rating__info">-->
    <!--      <p class="text-black me-2">({{ rating }})</p>-->
    <!--      <div @click="openDialog" class="rating">-->
    <!--        <v-rating-->
    <!--            v-model="rating"-->
    <!--            color="grey"-->
    <!--            active-color="yellow-accent-4"-->
    <!--            half-increments-->
    <!--            hover-->
    <!--            readonly-->
    <!--            size="30"-->
    <!--        ></v-rating>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="rating__card__container">
      <v-card class="rating__card">
        <v-card-title>Новый отзыв</v-card-title>
        <v-card-text>
          <div class="rating__card__container">
            <v-rating
                color="grey"
                active-color="yellow-accent-4"
                half-increments
                hover
                size="30"
            ></v-rating>
            <v-textarea label="Отзыв">
            </v-textarea>
            <v-btn style="background: rgba(220,221,249,0.28)">
              Отправить
            </v-btn>
          </div>
          <div class="feedback__list">
            <div class="feedback__item">
              <p class="feedback__name">Имя Фамилия</p>
              <span class="text-grey text-caption me-2">({{ rating }})</span>
              <v-rating
                  v-model="rating"
                  color="white"
                  active-color="yellow-accent-4"
                  half-increments
                  hover
                  size="18"
              ></v-rating>
              <p class="feedback__text">Самый лучший отзыв. Могу писать что угодно. Никто ничего против не скажет...</p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "rating-modal-component",
  data() {
    return {
      dialog: false,
      rating: 4.5,
      score: null,
      text: null
    }
  },
  methods: {
    openDialog() {
      this.dialog = true
    }
  }
}
</script>

<style scoped>
@import "@/assets/scss/user-page/rating-modal.scss";
</style>
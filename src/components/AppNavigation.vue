<template>
  <div class="navigation">
    <v-btn
        variant="text"
        class="button"
        prepend-icon="mdi-account-outline"
        @click="$router.push('/user')"
    >
      Профиль
    </v-btn>
    <v-btn
        variant="text"
        class="button"
        prepend-icon="mdi-account-multiple-outline"
        @click="$router.push('/users')"
    >
      Пользователи
    </v-btn>
<!--    <v-btn-->
<!--        variant="text"-->
<!--        class="button"-->
<!--        prepend-icon="mdi-school-outline"-->
<!--        @click="$router.push('/lessons')"-->
<!--    >-->
<!--      Обучение-->
<!--    </v-btn>-->
    <v-btn
        variant="text"
        class="button"
        prepend-icon="mdi-calendar-month-outline"
        @click="$router.push('/schedule')"
    >
      Расписание
    </v-btn>
    <v-btn
        variant="text"
        class="button"
        prepend-icon="mdi-chat-outline"
        @click="$router.push('/messages')"
    >
      Сообщения
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "AppNavigation"
}
</script>

<style scoped>
.navigation {
  display: flex;
  flex-direction: column;
  max-width: 250px;
  position: fixed;
  z-index: 1;
  width: 250px;
}

.button {
  max-width: 200px;
  margin: 5px 0;
  justify-content: start;
}
</style>
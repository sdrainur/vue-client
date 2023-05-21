<template>
  <app-bar></app-bar>
  <v-main>
    <div class="container">
      <app-navigation></app-navigation>
      <div style="width: 100%;">
        <div class="content">
          <div class="d-flex flex-column align-center">
            <v-btn-toggle
                v-model="choice"
                color="primary"
                style="border-radius: 20px;"
            >
              <v-btn variant="outlined" value="mentors" @click="getUsers">Менторы</v-btn>
              <v-btn variant="outlined" value="users" @click="getUsers">Пользователи</v-btn>
            </v-btn-toggle>
          </div>
          <v-card
              class="content__header shadow btn"
              color="element"
              v-for="user in users"
              v-bind:key="user"
              @click="$router.push('/user/'+user.id)"
          >
            <v-card-item>
              <v-avatar size="70px">
                <v-img
                    :src="require('../assets/images/Profile-Avatar-PNG.png')"
                ></v-img>
              </v-avatar>
            </v-card-item>
            <div class="user__info" style="padding: 0 15px">
              <v-card-text class="user__name">{{ user.firstName + ' ' + user.secondName }}</v-card-text>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </v-main>
</template>


<script>
import AppBar from "@/components/AppBar";
import AppNavigation from "@/components/AppNavigation";
import {loadUsers} from "@/service/usersList.service";

export default {
  name: "UsersListPage",
  components: {AppNavigation, AppBar},
  data() {
    return {
      users: null,
      choice: 'mentors'
    }
  },
  beforeMount() {
    loadUsers(this.choice)
        .then(response => {
          this.users = response.data
        })
  },
  methods:{
    getUsers(){
      loadUsers(this.choice)
          .then(response => {
            this.users = response.data
          })
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

.btn {
  transition: 100ms;
}

.btn:hover {
  cursor: pointer;
  scale: 1.05;
}

.choose__button {
  transition: 100ms;
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
  -webkit-box-shadow: 4px 4px 29px -11px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 4px 4px 29px -11px rgba(34, 60, 80, 0.2);
  box-shadow: 4px 4px 29px -11px rgba(34, 60, 80, 0.2);
}

.user__name {
  font-family: 'Montserrat', sans-serif;
  text-align: start;
  font-size: 20px;
  font-weight: 500;
}

.user__info {
  display: flex;
  align-items: center;
}

.text__primary {
  font-family: 'Montserrat', sans-serif;
  text-align: start;
  font-size: 15px;
  font-weight: 400;
}
</style>
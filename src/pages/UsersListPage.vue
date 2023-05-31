<template>
  <app-bar></app-bar>
  <v-main>
    <div class="container">
      <app-navigation></app-navigation>
      <div style="margin-left: 150px; width: 100%;">
        <div class="content">
          <div class="d-flex flex-column align-center">
            <v-btn-toggle
                v-model="choice"
                color="primary"
                style="border-radius: 20px;"
            >
              <!--              <v-btn variant="outlined" value="mentors" @click="getUsers">Менторы</v-btn>-->
              <!--              <v-btn variant="outlined" value="users" @click="getUsers">Пользователи</v-btn>-->
              <v-select
                  color="light_item"
                  prepend-inner-icon="mdi-format-list-bulleted"
                  v-model="selectedCategoryId"
                  :items="categories"
                  item-title="name"
                  item-value="id"></v-select>
              <v-select
                  color="light_item"
                  prepend-inner-icon="mdi-format-indent-increase"
                  v-model="selectedSortId"
                  :items="sorts"
                  item-title="name"
                  item-value="id"
              ></v-select>
            </v-btn-toggle>
          </div>
          <v-card
              class="content__header shadow btn"
              color="element"
              v-for="user in shownUsersInfo"
              v-bind:key="user"
              @click="$router.push('/user/'+user.id)"
          >
            <div
                style="width: 100%; display: flex; align-items: center; flex-direction: row; justify-content: space-between">
              <div style="display: flex; align-items: center; flex-direction: row">
                <v-card-item>
                  <v-avatar size="90px">
                    <v-img
                        :src='`http://localhost:4000/public/${user.profilePhotoName}`'
                        cover
                    ></v-img>
                  </v-avatar>
                </v-card-item>
                <div style="display: flex;">
                  <v-card-text class="user__name">{{ user.firstName + ' ' + user.secondName }}</v-card-text>
                </div>
                <v-card-text class="text__primary">{{ user.categoryname }}</v-card-text>
              </div>
              <div style="margin-right: 30px">
                <v-card-text class="text__primary">
                  <span>({{ Number(user.score).toFixed(1) }})</span>
                  <v-rating half-increments color="orange" size="20" v-model="user.score" readonly/>
                </v-card-text>
                <p class="text__primary">Стоимость занятия: {{user.pricePerHour}} руб/ч</p>
              </div>
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
import axiosInstance from "@/service/axios.instance";

export default {
  name: "UsersListPage",
  components: {AppNavigation, AppBar},
  data() {
    return {
      users: null,
      choice: 'mentors',
      usersInfo: null,
      shownUsersInfo: null,
      categories: [{id: '0', name: 'Все категории'}],
      selectedSortId: 3,
      selectedCategoryId: '0',
      sorts: [
        {id: 2, name: 'По возрастанию оценки'},
        {id: 3, name: 'По убыванию оценки'},
        {id: 4, name: 'По возрастанию стоимости занятия'},
        {id: 5, name: 'По убыванию стоимости занятия'}
      ]
    }
  },
  computed: {
    sortData() {
      return [this.selectedCategoryId, this.selectedSortId]
    }
  },
  watch: {
    "sortData": function (val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.shownUsersInfo = val[0] === '0' ? this.usersInfo : this.usersInfo.filter(user => user.categoryid === val[0])
      if(val[1]===2){
        this.shownUsersInfo.sort((a, b)=>{
          if(a.score < b.score) return -1
          if(a.score > b.score) return 1
          return 0
        })
      }
      if(val[1]===3){
        this.shownUsersInfo.sort((a, b)=>{
          if(a.score < b.pricePerHour) return -1
          if(a.score > b.score) return 1
          return 0
        })
      }
      if(val[1]===4){
        this.shownUsersInfo.sort((a, b)=>{
          if(a.pricePerHour < b.pricePerHour) return -1
          if(a.pricePerHour > b.pricePerHour) return 1
          return 0
        })
      }
      if(val[1]===5){
        this.shownUsersInfo.sort((a, b)=>{
          if(a.pricePerHour > b.pricePerHour) return -1
          if(a.pricePerHour < b.pricePerHour) return 1
          return 0
        })
      }
    }
  },
  beforeMount() {
    axiosInstance.get('all-users-info').then(res => {
      this.usersInfo = res.data
      this.shownUsersInfo = res.data.sort((a, b)=>{
        if(a.score < b.pricePerHour) return -1
        if(a.score > b.score) return 1
        return 0
      })
    })
    axiosInstance.get('/categories').then(result => {
      this.categories.push(...result.data)
    })
    loadUsers(this.choice)
        .then(response => {
          this.users = response.data
        })
  },
  methods: {
    getUsers() {
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
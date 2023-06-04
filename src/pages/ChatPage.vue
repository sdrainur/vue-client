<template>
  <app-bar/>
  <v-main>
    <div class="container">
      <app-navigation/>
      <div style="margin-left: 200px" class="chat">
        <v-card color="element_lighter" class="dialogs shadow">
          <div class="search">
            <div class="search__inner">
              <v-icon icon="mdi-arrow-left" @click="closeMessages" v-if="openedUser"/>
              <input class="search__field" placeholder="Поиск...">
              <v-icon icon="mdi-magnify"/>
            </div>
          </div>
          <div class="dialogs__list" v-if="!openedUser">
            <div v-for="user in users" v-bind:key="user">
              <div class="user" @click="openMessages(user)">
                <v-avatar size="50px" style="margin: 0 5px">
                  <v-img
                      :src='`http://localhost:4000/public/${user.profilePhotoName}`'
                      cover/>
                </v-avatar>
                {{ user.firstName + ' ' + user.secondName }}
              </div>
              <v-divider/>
            </div>
          </div>
          <div class="messages" v-if="openedUser">
            <div id="messages__list" class="messages__list">
              <div v-for="message in messages" v-bind:key="message">
                <div class="message__received" v-if="this.authUserId != message.sender">
                  <div class="message__received__inner">
                    <p class="message__text">{{ message.textOrFilePath }}</p>
                  </div>
                </div>
                <div class="message__sent" v-if="this.authUserId == message.sender">
                  <div class="message__sent__inner">
                    <p class="message__text"> {{ message.textOrFilePath }} </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="message__input">
              <div v-if="hasLessonNow">
                <input
                    class="message__input__field"
                    placeholder="Введите сообщение"
                    :value="newMessageText"
                    @input="newMessageText=$event.target.value"
                    @submit.prevent="sendMessage"
                    @keyup.enter="sendMessage">
                <v-icon size="30px" icon="mdi-send-circle-outline" @click="sendMessage"/>
              </div>
              <input
                  v-if="!hasLessonNow"
                  readonly="readonly"
                  class="message__input__field"
                  placeholder="Отправлять сообщения можно только во время занятия"
              >
            </div>
          </div>
        </v-card>
        <v-card color="element_lighter" class="chat__menu shadow">
          <div class="menu__inner" v-if="openedUser">
            <div class="user__info">
              <v-avatar class="avatar" size="100px">
                <v-img
                    :src='`http://localhost:4000/public/${openedUser.profilePhotoName}`'
                    cover
                ></v-img>
              </v-avatar>
              <div>
                {{ openedUser.firstName + ' ' + openedUser.secondName }}
              </div>
            </div>
            <v-divider/>
            <AudioCallingComponent
                :socket="socket"
                :auth-user-id="authUserId"
                :sender-id="openedUser.id"
                :opened-user="openedUser"/>
            <CallingComponent
                :socket="socket"
                :auth-user-id="authUserId"
                :sender-id="openedUser.id"
                :opened-user="openedUser"
            />
          </div>
          <div class="menu__inner" v-if="!openedUser">
            <div class="user__info">
              <p>
                Выберите пользователя
              </p>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </v-main>
</template>

<script>
import AppBar from "@/components/AppBar";
import AppNavigation from "@/components/AppNavigation";
import {loadRelatedUsers} from "@/service/user.service";
import {loadMessages} from "@/service/chat.service";
import {useAuthenticationStore} from "@/store/authentication.store";
import CallingComponent from "@/components/CallingComponent";
import {createSocket, joinSocket, sendMessage} from "@/ws/chat.ws";
import {authToken} from "@/service/auth.service";
import axiosInstance from "@/service/axios.instance";
import AudioCallingComponent from "@/components/AudioCallingComponent.vue";


export default {
  name: "ChatPage",
  components: {AudioCallingComponent, CallingComponent, AppNavigation, AppBar},
  data() {
    return {
      openedUser: null,
      users: null,
      messages: null,
      authUserId: null,
      newMessageText: null,
      hasLessonNow: null
    }
  },
  setup() {

    const authenticationStore = useAuthenticationStore()

    const socket = createSocket(authenticationStore.getUserId, authToken)

    return {
      socket,
      authenticationStore
    }
  },
  beforeMount() {
    this.authUserId = this.authenticationStore.userId
    joinSocket(this.socket, this.authUserId);
    this.socket.on('chat', (data) => {
      if ((data.to === this.openedUser.id && data.from === this.authUserId) ||
          (data.to === this.authUserId && data.from === this.openedUser.id)) {
        this.messages.push(data.message)
      }
    })
    this.$watch('messages', function () {
      this.$nextTick(() => {
        let objDiv = document.getElementById("messages__list");
        console.log(objDiv.scrollHeight);
        objDiv.scrollTop = objDiv.scrollHeight;
      });
    }, {deep: true})
    loadRelatedUsers().then(result => {
      this.users = result.data
    })
  },
  unmounted() {
    this.socket.emit('leave', {
      userId: this.authUserId
    })
  },
  methods: {
    sendMessage() {
      sendMessage(this.socket, this.authUserId, this.openedUser.id, this.openedUser.uuid, this.newMessageText)
      this.newMessageText = ''
    },
    openMessages(user) {
      console.log(user)
      loadMessages(user.uuid).then(result => {
        this.messages = result.data
        this.openedUser = user
      })
      axiosInstance.get(`/lessons/has-lesson-now/${user.id}`).then(result => {
        this.hasLessonNow = result.data.hasLessonNow
      })
    },
    closeMessages() {
      this.openedUser = null;
      this.messages = null
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
@import "src/assets/scss/main";
@import "src/assets/scss/chat_page/dialogs";
@import "src/assets/scss/chat_page/menu";
@import "src/assets/scss/chat_page/chat";
</style>
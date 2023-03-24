<template>
  <app-bar/>
  <v-main>
    <div class="container">
      <app-navigation/>
      <div class="chat">
        <div class="dialogs shadow">
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
                      :src="require('../assets/images/6-sep-2017-beauty-salons-where-are-best-face-peeli-op.jpg.jpg')"/>
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
              <input
                  class="message__input__field"
                  placeholder="Введите сообщение"
                  :value="newMessageText"
                  @input="newMessageText=$event.target.value"
                  @submit.prevent="sendMessage"
                  @keyup.enter="sendMessage">
              <v-icon size="30px" icon="mdi-send-circle-outline" @click="sendMessage"/>
            </div>
          </div>
        </div>
        <div class="chat__menu shadow">
          <div class="menu__inner" v-if="openedUser">
            <div class="user__info">
              <v-avatar class="avatar" size="100px">
                <v-img
                    :src="require('../assets/images/6-sep-2017-beauty-salons-where-are-best-face-peeli-op.jpg.jpg')"
                ></v-img>
              </v-avatar>
              <div>
                {{ openedUser.firstName + ' ' + openedUser.secondName }}
              </div>
            </div>
            <v-divider/>
            <CallingComponent
                :socket="socket"
                :auth-user-id="authUserId"
                :sender-id="openedUser.id"
                :opened-user="openedUser"
            />
            <v-btn variant="text">Видеозвонок</v-btn>
          </div>
          <div class="menu__inner" v-if="!openedUser">
            <div class="user__info">
              <p>
                Выберите пользователя
              </p>
            </div>
          </div>
        </div>
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


export default {
  name: "ChatPage",
  components: {CallingComponent, AppNavigation, AppBar},
  data() {
    return {
      openedUser: null,
      users: null,
      messages: null,
      authUserId: null,
      newMessageText: null
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
      console.log(data)
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
      alert('opening')
      loadMessages(user.uuid).then(result => {
        this.messages = result.data
        this.openedUser = user
        // listenRtcSocket(this.socket, this.authUserId, user.id)
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
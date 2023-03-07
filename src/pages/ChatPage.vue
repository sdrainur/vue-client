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
          <!--          <div style="height:100%; display: flex; justify-content: center; align-items: center">-->
          <!--            <p class="dialogs__info" >Нет доступных диалогов</p>-->
          <!--          </div>-->
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
                    {{ message.textOrFilePath }}
                  </div>
                </div>
                <div class="message__sent" v-if="this.authUserId == message.sender">
                  <div class="message__sent__inner">
                    {{ message.textOrFilePath }}
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
      </div>
    </div>
  </v-main>
</template>

<script>
import AppBar from "@/components/AppBar";
import AppNavigation from "@/components/AppNavigation";
import {io} from "socket.io-client";
import {loadRelatedUsers} from "@/service/user.service";
import {authToken} from "@/service/auth.service";
import {loadMessages} from "@/service/chat.service";
import {useAuthenticationStore} from "@/store/authentication.store";


export default {
  name: "ChatPage",
  components: {AppNavigation, AppBar},
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

    const token = authToken
    const socket = io("http://localhost:4000/", {
      transportOptions: {
        polling: {
          extraHeaders: {
            'Authorization': 'Bearer ' + token
          }
        }
      },
      query: {
        userId: authenticationStore.getUserId
      }
    })
    return {
      socket,
      authenticationStore
    }
  },
  beforeMount() {
    console.log('connected')
    this.authUserId = this.authenticationStore.userId
    this.socket.emit('join', {
      userId: this.authUserId
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
      this.socket.emit('chat', {
        data: {
          uuid: this.openedUser.uuid,
          text: this.newMessageText,
        },
        to: this.openedUser.id,
        from: this.authUserId
      })
      this.newMessageText = null
    },
    openMessages(user) {
      loadMessages(user.uuid).then(result => {
        this.messages = result.data
        this.openedUser = user
        this.socket.on('chat', (data) => {
          console.log(data.message)
          this.messages.push(data.message)
        })
      })
    },
    closeMessages() {
      this.openedUser = null;
      this.messages = null
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
@import "src/assets/scss/main";


.container {
  display: flex;
  width: 100%;
  max-width: 1170px;
  margin: 0 auto;
  padding: 15px 0 0 0;
}

.chat {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.dialogs {
  font-family: $font-family-text;
  margin: 0 10px;
  padding: 5px;
  border-radius: 30px;
  width: 70%;
  height: 80vh;
}

.dialogs__list {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px;
  height: calc(100% - 25px);
}

.user {
  padding: 20px 30px;
  font-size: 20px;
  transition: 100ms;

  &:hover {
    cursor: pointer;
    scale: 1.05;
  }
}

.search {
  width: auto;
  height: 20px;
  margin: 5px 20px;
}

.search__inner {
  display: flex;
  margin: 0 20px;
}

.search__field {
  width: 100%;
  margin: 0 10px;

  &:focus {
    outline: none;
  }

  &::placeholder {

  }
}

.messages {
  margin: 10px 20px;
  padding: 10px;
  height: calc(100% - 25px);
}

.messages__list {
  display: flex;
  flex-direction: column;
  height: calc(100% - 55px);
  overflow-y: scroll;
}

.message__input {
  height: 20px;
  margin: 10px 15px;
}

.message__input__field {
  width: calc(100% - 30px);

  &:focus {
    outline: none;
  }
}

.message__sent {
  display: flex;
  justify-content: end;
  margin: 10px;
}

.message__received {
  display: flex;
  justify-content: start;
  margin: 10px;
}


.message__received__inner {
  display: inline-block;
  padding: 5px;
  max-width: 250px;
  border-radius: 20px;
  background: #fff5f5;
  box-shadow: 10px 10px 19px #ebebeb,
  -10px -10px 19px #ffffff;

}

.message__sent__inner {
  display: inline-block;
  border-radius: 20px;
  max-width: 250px;
  padding: 5px;
  background: #f5fff7;
  box-shadow: -10px 10px 19px #ebebeb,
  10px -10px 19px #ffffff;
}

.dialogs__info {
  font-size: 20px;
  color: #6d6d6d;

  &:hover {
    cursor: default;
  }
}

</style>
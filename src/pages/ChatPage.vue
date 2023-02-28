<template>
  <app-bar/>
  <v-main>
    <div class="container">
      <app-navigation/>
      <div class="chat">
        <div class="dialogs shadow">
          <div class="search">
            <div class="search__inner">
              <v-icon icon="mdi-arrow-left" @click="closeMessages" v-if="openedMessages"/>
              <input class="search__field" placeholder="Поиск...">
              <v-icon icon="mdi-magnify"/>
            </div>
          </div>
          <div class="dialogs__list" v-if="!openedMessages">
            <div v-for="i in new Array(20)" v-bind:key="i">
              <div class="user" @click="openMessages">
                <v-avatar size="50px" style="margin: 0 5px">
                  <v-img
                      :src="require('../assets/images/6-sep-2017-beauty-salons-where-are-best-face-peeli-op.jpg.jpg')"/>
                </v-avatar>
                Иван Иванов
              </div>
              <v-divider/>
            </div>
          </div>
          <div class="messages" v-if="openedMessages">
            <div class="messages__list">
              <div class="message__received">
                <div class="message__received__inner">
                  Привет
                </div>
              </div>
              <div class="message__sent">
                <div class="message__sent__inner">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad blanditiis cumque dicta distinctio
                  dolores eaque fuga hic labore nam nesciunt, perferendis porro quas saepe sint tempora tempore, vitae.
                  Obcaecati, sapiente.
                </div>
              </div>
            </div>
            <div class="message__input">
              <input placeholder="Введите сообщение">
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
import {loadChatRooms} from "@/service/chat.service";


export default {
  name: "ChatPage",
  components: {AppNavigation, AppBar},
  data() {
    return {
      openedMessages: false
    }
  },
  setup() {
  },
  beforeMount() {
    loadChatRooms()
  },
  methods: {
    openMessages() {
      this.openedMessages = true;
    },
    closeMessages() {
      this.openedMessages = false;
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
}

.message__input {
  height: 20px;
  margin: 10px 15px;
}

.message__sent {
  display: flex;
  justify-content: end;
}

.message__received {
  display: flex;
  justify-content: start;
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


</style>
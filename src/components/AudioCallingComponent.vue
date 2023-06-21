<template>
  <div class="text-center">
    <v-dialog
        v-model="outcomingCall"
        width="auto"
    >
      <template v-slot:activator="{ props }">
        <v-btn
            variant="text"
            v-bind="props"
            @click="call"
        >
          Аудиозвонок
        </v-btn>
      </template>
      <v-card class="call__item" id="callItem">
        <audio autoplay loop>
          <source :src="require('/src/assets/sounds/outcoming_call.mp3')" type='audio/mpeg'>
        </audio>
        <v-card-title>
          <div class="call__title__container">
            <div class="avatar">
              <v-avatar class="avatar__item" size="7vw">
                <v-img
                    cover
                    src='http://localhost:4000/public/1685881842441-week7_1100.jpg'></v-img>
              </v-avatar>
            </div>
            <p class="font__name">{{ this.openedUser.firstName + ' ' + this.openedUser.secondName }}</p>
            <p class="font_information">Выполняется звонок...</p>
          </div>
        </v-card-title>
        <v-card-actions class="call__actions">
          <v-btn
              variant="outlined"
              icon
              color="error"
              class="call__button"
          >
            <v-icon>mdi-phone-hangup</v-icon>
          </v-btn>
          <!--          <v-btn-->
          <!--              variant="outlined"-->
          <!--              icon-->
          <!--              color="secondary"-->
          <!--              class="call__button"-->
          <!--          >-->
          <!--            <v-icon>mdi-microphone</v-icon>-->
          <!--          </v-btn>-->
          <!--          <v-btn-->
          <!--              variant="outlined"-->
          <!--              icon-->
          <!--              color="secondary"-->
          <!--              class="call__button"-->
          <!--          >-->
          <!--            <v-icon>mdi-video</v-icon>-->
          <!--          </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
        v-model="this.incomingCall"
        width="auto"
    >
      <v-card class="call__item" id="callItem">
        <audio autoplay loop>
          <source :src="require('/src/assets/sounds/outcoming_call.mp3')" type='audio/mpeg'>
        </audio>
        <v-card-title>
          <div class="call__title__container">
            <div class="avatar">
              <v-avatar class="avatar__item" size="7vw">
                <v-img
                    cover
                    src='http://localhost:4000/public/1685881911821-46.jpg'></v-img>
              </v-avatar>
            </div>
            <p class="font__name">{{ this.openedUser.firstName + ' ' + this.openedUser.secondName }}</p>
            <p class="font_information">Входящий звонок...</p>
          </div>
        </v-card-title>
        <v-card-actions class="call__actions">
          <v-btn
              variant="outlined"
              icon
              color="error"
              class="call__button"
          >
            <v-icon>mdi-phone-hangup</v-icon>
          </v-btn>
          <v-btn
              variant="outlined"
              icon
              color="success"
              class="call__button"
              @click="acceptCall"
          >
            <v-icon>mdi-phone</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
        v-model="connectedCall"
        width="auto"
    >
      <v-card color="element" style="border-radius: 15px">
        <div class="call__videos">
          <audio autoplay

                 id="remoteVideo"
                 class="video__remote">
          </audio>
          <audio autoplay

                 id="video"
                 class="video">
          </audio>
        </div>
        <v-card-title>
          <div class="call__title__container">
            <div class="avatar">
              <v-avatar class="avatar__item" size="7vw">
                <v-img
                    cover
                    src='http://localhost:4000/public/1685881911821-46.jpg'></v-img>
              </v-avatar>
            </div>
            <p class="font__name">{{ this.openedUser.firstName + ' ' + this.openedUser.secondName }}</p>
            <p class="font_information">Соединение установлено</p>
          </div>
        </v-card-title>
        <v-card-actions class="call__actions">
          <v-btn
              variant="outlined"
              icon
              color="error"
              class="call__button"
          >
            <v-icon>mdi-phone-hangup</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>


import {createOffer, createPeer, listenRtcSocket, openedUserId, setLocalMediaStream} from "@/webrtc/webrtc.service";

export default {
  name: "AudioCallingComponent",
  props: [
    'authUserId',
    'senderId',
    'socket',
    'openedUser'
  ],
  data() {
    return {
      outcomingCall: false,
      myPeerConnection: null,
      targetPeerConnection: null,
      callItem: null,
      audioItem: null,
      incomingCall: false,
      connectedCall: false
    }
  },
  beforeMount() {
    this.socket.on('openAudioCall', () => {
      this.dialog = true;
      setLocalMediaStream();
    })
    listenRtcSocket(this.socket)
    createPeer(this.socket, this.authUserId, this.openedUser.id)
    this.socket.on('audioCall', (data) => {
      console.log(data)
      if (data.type === 'invite' && data.from === this.openedUser.id) {
        this.incomingCall = true
      }
    })
    this.socket.on('audioCall', (data) => {
      if (data.type === 'accept' && data.from === this.openedUser.id) {
        this.outcomingCall = false
        this.connectedCall = true
        this.inviteCall()
      }
    })
  },
  methods: {
    async inviteCall() {
      this.socket.emit('openAudioCall', {
        to: openedUserId
      })
      this.dialog = true
      await setLocalMediaStream();
      await createOffer();
    },
    call() {
      this.outcomingCall = true;
      console.log('inviting')
      this.socket.emit('audioCall', {
        from: this.authUserId,
        to: this.openedUser.id,
        type: 'invite'
      })
    },
    acceptCall() {
      this.incomingCall = false
      this.connectedCall = true
      this.socket.emit('audioCall', {
        from: this.authUserId,
        to: this.openedUser.id,
        type: 'accept'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/chat_page/calling_component.scss";
</style>
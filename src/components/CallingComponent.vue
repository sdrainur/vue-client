<!--<template>-->
<!--  <div class="text-center">-->
<!--    <v-dialog-->
<!--        v-model="dialog"-->
<!--        width="auto"-->
<!--    >-->
<!--      <template v-slot:activator="{ props }">-->
<!--        <v-btn-->
<!--            variant="text"-->
<!--            v-bind="props"-->
<!--            @click="inviteCall"-->
<!--        >-->
<!--          Аудиозвонок-->
<!--        </v-btn>-->
<!--      </template>-->

<!--      <v-card>-->

<!--        <video autoplay-->
<!--               playsinline-->
<!--               id="video"-->
<!--               :height="300"-->
<!--               :width="400">-->

<!--        </video>-->
<!--        <video autoplay-->
<!--               playsinline-->
<!--               id="remoteVideo"-->
<!--               :height="300"-->
<!--               :width="400">-->

<!--        </video>-->
<!--        <v-card-actions>-->
<!--          <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>-->
<!--        </v-card-actions>-->
<!--      </v-card>-->
<!--    </v-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->

<!--import {createCall, createNewPeer, peerConnection, setRemoteMedia} from "@/webrtc/webrtc.service";-->

<!--export default {-->
<!--  name: "CallingComponent",-->
<!--  props: [-->
<!--    'authUserId',-->
<!--    'senderId',-->
<!--    'socket',-->
<!--    'openedUser'-->
<!--  ],-->
<!--  data() {-->
<!--    return {-->
<!--      dialog: false,-->
<!--      myPeerConnection: null,-->
<!--      targetPeerConnection: null,-->
<!--    }-->
<!--  },-->
<!--  beforeMount() {-->
<!--    // listenRtcSocket(this.socket)-->
<!--    this.socket.on('session_description', async (data) => {-->
<!--      this.dialog = true-->
<!--      createCall().then(() =>-->
<!--          createNewPeer(this.socket, false, this.senderId, this.openedUser.id).then(async () => {-->
<!--                await setRemoteMedia(this.socket, data, this.senderId, this.openedUser.id)-->
<!--              }-->
<!--          )-->
<!--      )-->
<!--    })-->
<!--    this.socket.on('ice_candidate', async (iceCandidate) => {-->
<!--      this.dialog = true-->
<!--      createNewPeer(this.socket, false, this.senderId, this.openedUser.id).then(() => {-->
<!--            console.log(iceCandidate)-->
<!--            peerConnection.addIceCandidate(-->
<!--                new RTCIceCandidate(iceCandidate)-->
<!--            )-->
<!--          }-->
<!--      )-->
<!--    })-->
<!--  },-->
<!--  methods: {-->
<!--    inviteCall() {-->
<!--      //   console.log(this.authUserId)-->
<!--      //   console.log(this.senderId)-->
<!--      //   this.myPeerConnection = new RTCPeerConnection({-->
<!--      //     iceServers: freeice(),-->
<!--      //   })-->
<!--      //   this.myPeerConnection.onicecandidate = event => {-->
<!--      //     if(event.candidate){-->
<!--      //-->
<!--      //     }-->
<!--      //   }-->
<!--      createCall().then(() => createNewPeer(this.socket, true, this.authUserId, this.openedUser.id))-->
<!--    },-->

<!--    // openVideo() {-->
<!--    // navigator.mediaDevices.getUserMedia({video: true})-->
<!--    //     .then(stream => {-->
<!--    //       const video = document.querySelector('video');-->
<!--    //       video.srcObject = stream;-->
<!--    //       video.onloadedmetadata = () => {-->
<!--    //         video.play();-->
<!--    //       };-->
<!--    //     }).catch((err) => {-->
<!--    //   console.error(`${err.name}: ${err.message}`);-->
<!--    // });-->
<!--    // createCall();-->
<!--    // },-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->


<template>
  <div class="text-center">
    <v-dialog
        v-model="dialog"
        width="auto"
    >
      <template v-slot:activator="{ props }">
        <v-btn
            variant="text"
            v-bind="props"
            @click="inviteCall"
        >
          Аудиозвонок
        </v-btn>
      </template>

      <v-card>

        <video autoplay
               playsinline
               id="video"
               :height="300"
               :width="400">

        </video>
        <video autoplay
               playsinline
               id="remoteVideo"
               :height="300"
               :width="400">

        </video>
        <v-card-actions>
          <v-btn color="primary" @click="dialog = false">Close Dialog</v-btn>
          <v-btn color="primary" @click="inviteCall">Позвонить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>


import {createOffer, createPeer, listenRtcSocket, openedUserId, setLocalMediaStream} from "@/webrtc/webrtc.service";

export default {
  name: "CallingComponent",
  props: [
    'authUserId',
    'senderId',
    'socket',
    'openedUser'
  ],
  data() {
    return {
      dialog: false,
      myPeerConnection: null,
      targetPeerConnection: null,
    }
  },
  beforeMount() {
    this.socket.on('openCall', () => {
      this.dialog = true;
      setLocalMediaStream();
    })
    listenRtcSocket(this.socket)
    createPeer(this.socket, this.authUserId, this.openedUser.id)
  },
  methods: {
    async inviteCall() {
      this.socket.emit('openCall', {
        to: openedUserId
      })
      this.dialog = true
      await setLocalMediaStream();
      await createOffer();
    },
  }
}
</script>

<style scoped>

</style>
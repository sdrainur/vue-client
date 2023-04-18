<template>
  <v-dialog v-model="isVisible" max-width="500px" persistent>
    <h1>Hello</h1>
    <v-btn @click="closeDialog">Close</v-btn>
  </v-dialog>
</template>

<script>
export default {
  name: "DayScheduleComponent",
  props: {
    visible: { type: Boolean, required: true }
  },
  data () {
    return {
      isVisible: this.$props.visible
    }
  },

  mounted() {
    console.log(this.isVisible)
  },
  watch: {
    // `visible(value) => this.isVisible = value` could work too
    visible() {
      this.isVisible = this.$props.visible
    }
  },
  methods:{
    closeDialog(){
      this.$emit('visible', false)
    }
  }
}
</script>

<style scoped>

</style>
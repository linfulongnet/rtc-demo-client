<template>
  <div id="app">
<!--    <AudioRecording/>-->
    <Recording/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
// import AudioRecording from './components/AudioRecording.vue';
import Recording from './components/Recording.vue';

@Component({
  components: {
    // AudioRecording,
    Recording,
  },
})
export default class App extends Vue {
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>

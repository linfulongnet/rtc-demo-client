<template>
  <section class="audio-recording">
    <header class='recording-header'>
      <button @click="toggleRecording" v-text="actionName"></button>
      <div>
        Recording time: {{recordingTime}}
      </div>
    </header>

    <div class='recording-container'
         v-for="(source,index) in audioSources" :key="index">
      <audio :src="source.src" controls></audio>
      <button @click="saveAsRecordData(source)">download</button>
    </div>

  </section>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component
  export default class Recording extends Vue {
    public isRecording: boolean = false
    public stream: any = null
    public recorder: any = null
    public times: number = 0
    public recordingTime: number = 0
    public audioSources: any[] = []
    public constraints: { [key: string]: any } = {
      audio: true,
      video: false
    }

    get actionName() {
      return this.isRecording ? 'Stop Record' : 'Start Record'
    }

    public async startRecord() {
      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints)
      console.log('Got stream:', this.stream)

      this.isRecording = true

      this.recorder = new MediaRecorder(this.stream)
      console.log(this.recorder)
      this.recorder.onstart = (event: Event) => {
        console.log('Recorder started')
      }
      this.recorder.onpause = (event: Event) => {
        console.log('Recorder paused')
      }
      this.recorder.onstop = (event: Event) => {
        console.log('Recorder stopped')
      }

      this.recorder.ondataavailable = (event: MediaStreamEvent) => {
        console.log('ondataavailable:', event)
      }
      this.recorder.start(1000)
      this.times = setInterval(() => {
        this.recordingTime++
      }, 1000)
    }

    public async stopRecord() {
      this.recorder.stop()
      this.stream = null
      this.isRecording = false
      clearInterval(this.times)
      this.times = this.recordingTime = 0

      // this.recorder.stopRecording(async () => {
      //   console.log('stopRecord', this.recorder)
      //
      //   const src = await this.getDataUrl()
      //   const blob = await this.recorder.getBlob()
      //   this.audioSources.push({
      //     src, blob,
      //     filename: new Date().toISOString()
      //   })
      //
      //   this.stream = null
      //   this.isRecording = false
      //   clearInterval(this.times)
      //   this.times = this.recordingTime = 0
      // })
    }

    public toggleRecording() {
      if (this.isRecording) {
        this.stopRecord()
      } else {
        this.startRecord()
      }
    }

  }
</script>

<style scoped lang="scss">
  $marginValue: 10px;

  audio {
    height: 30px;
  }

  .recording-header {
    margin-bottom: $marginValue;
    border-bottom: 1px solid #2c3e50;
  }

  .recording-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: $marginValue;

    &:last-child {
      margin-bottom: 0;
    }

    & audio {
      margin-right: $marginValue;
    }
  }
</style>

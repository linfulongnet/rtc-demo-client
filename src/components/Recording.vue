<template>
  <section class="audio-recording">
    <header class='recording-header'>
      <button @click="toggleRecording" v-text="actionName"></button>
      <button @click="togglePause" v-text="pauseName" :disabled='!isRecording'></button>
      <div>
        Recording time: {{recordingTime}}
      </div>
    </header>

    <div class='recording-container'
         v-for="(source,index) in audioSources" :key="index">
      <audio :src="source.dataUrl" controls></audio>
      <button @click="saveAsRecordData(source)">download</button>
    </div>
  </section>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component
  export default class Recording extends Vue {
    public isPaused: boolean = false
    public isRecording: boolean = false
    public stream: any = null
    public recorder: any = null
    public times: number = 0
    public recordingTime: number = 0
    public audioSources: any[] = []
    public constraints: { [key: string]: any } = {
      audio: {
        sampleRate: 128000
      },
      video: false
    }
    public dataChunks: Blob[] = []

    get actionName() {
      return this.isRecording ? 'Stop Record' : 'Start Record'
    }

    get pauseName() {
      return this.isPaused ? 'Resume' : 'Paused'
    }

    public async startRecord() {
      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints)
      this.isRecording = true

      let tracks = this.stream.getAudioTracks()
      let firstTrack = tracks[0]
      if (!firstTrack) {
        throw new Error('DOMException: UnkownError, media track not found.')
      }
      console.log('tracks', firstTrack, firstTrack.getSettings())
      let context = new AudioContext()
      let sampleRate = context.sampleRate
      console.log('sampleRate', sampleRate)

      this.recorder = new MediaRecorder(this.stream, {
        audioBitsPerSecond: 128000
        // videoBitsPerSecond: 2500000,
        // mimeType: 'audio/webm'
      })
      console.log('MediaRecorder', this.recorder)
      this.recorder.onstart = (event: Event) => {
        console.log('Recorder started')

        this.calcRecordingTime()
      }
      this.recorder.onpause = (event: Event) => {
        console.log('Recorder paused')
      }
      this.recorder.onstop = (event: Event) => {
        this.clearRecordingInterval()
        let blob = new Blob(this.dataChunks, {'type': this.recorder.mimeType})
        const dataUrl = URL.createObjectURL(blob)
        console.log('Recorder stopped', blob, dataUrl)
        this.audioSources.push({
          dataUrl,
          fileName: new Date().toISOString() + '.' + this.getExt()
        })

        this.$nextTick(() => {
          this.recorder = null
          this.stream = null
        })
      }

      this.recorder.ondataavailable = (event: BlobEvent) => {
        console.log('ondataavailable', event.data)
        this.dataChunks.push(event.data)
      }
      this.recorder.start(100)
    }

    public async stopRecord() {
      this.recorder.stop()
      this.isRecording = false
      this.recordingTime = 0
    }

    public toggleRecording() {
      if (this.isRecording) {
        this.stopRecord()
      } else {
        this.startRecord()
      }
    }

    public togglePause() {
      if (this.isPaused) {
        this.recorder.resume()
        this.calcRecordingTime()
      } else {
        this.recorder.pause()
        this.clearRecordingInterval()
      }

      this.isPaused = !this.isPaused
    }

    calcRecordingTime() {
      this.times = setInterval(() => {
        this.recordingTime++
      }, 1000)
    }

    clearRecordingInterval() {
      clearInterval(this.times)
    }

    getExt(): string {
      let ext = ''
      try {
        const reg = /(\w+)\/(?<ext>\w+)(;codecs)?/i
        ext = this.recorder.mimeType.match(reg).groups.ext
      } catch (e) {

      }
      return ext
    }

    public saveAsRecordData({dataUrl, fileName}: { [key: string]: string }): void {
      if (!dataUrl) {
        return
      }
      if (!fileName) {
        fileName = new Date().toISOString()
      }

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = fileName

      link.click()
      setTimeout(() => {
        link.remove()
      }, 100)
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

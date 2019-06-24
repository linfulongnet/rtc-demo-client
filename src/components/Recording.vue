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
  import WavCodec from '@/modules/wavCodec'

  @Component
  export default class Recording extends Vue {
    public isPaused: boolean = false
    public isRecording: boolean = false
    public stream?: MediaStream
    public recorder?: MediaRecorder
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
    public context?: AudioContext
    public source?: MediaStreamAudioSourceNode
    public processor?: ScriptProcessorNode
    public channelCount: number = 1
    public sampleRate: number = 10000
    public bufferSize: number = 4096
    public sampleSize: number = 16
    public pcmSamples: any[] = []

    get actionName() {
      return this.isRecording ? 'Stop Record' : 'Start Record'
    }

    get pauseName() {
      return this.isPaused ? 'Resume' : 'Paused'
    }

    public async startRecord() {
      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints)
      this.isRecording = true

      // 获取音频轨道数据
      let tracks = this.stream.getAudioTracks()
      let firstTrack = tracks[0]
      if (!firstTrack) {
        throw new Error('DOMException: UnkownError, media track not found.')
      }
      let firstTrackSettings = firstTrack.getSettings()

      // 创建音频环境，处理音频数据
      this.context = new AudioContext()
      this.channelCount = firstTrackSettings.channelCount || 1
      this.sampleSize = firstTrackSettings.sampleSize
      this.sampleRate = this.context.sampleRate
      let wavCodec = new WavCodec({
        sampleRate: this.sampleRate,
        channelCount: this.channelCount,
        bufferSize: this.bufferSize,
        sampleSize: this.sampleSize
      })
      this.source = this.context.createMediaStreamSource(this.stream)
      this.processor = this.context.createScriptProcessor(this.bufferSize, this.channelCount, this.channelCount)
      this.processor.onaudioprocess = (ev: AudioProcessingEvent) => {
        const sample = ev.inputBuffer.getChannelData(0)
        // console.log('this.processor.onaudioprocess:', ev, sample)
        this.pcmSamples.push(sample)
        wavCodec.encode(sample)
      }
      this.sourceConnect()

      this.recorder = new MediaRecorder(this.stream, {
        audioBitsPerSecond: this.sampleRate
      })
      this.recorder.onstart = (event: Event) => {
        console.log('Recorder started')

        this.calcRecordingTime()
      }
      this.recorder.onpause = (event: Event) => {
        console.log('Recorder paused')
      }
      this.recorder.onstop = async (event: Event) => {
        this.isRecording = false
        this.recordingTime = 0
        this.clearRecordingInterval()

        this.sourceDisconnect()
        this.contextClose()

        wavCodec.finish()
        let wavBlob = wavCodec.getBlob()
        let wavAudio = {
          dataUrl: URL.createObjectURL(wavBlob),
          fileName: 'wavCodec.wav'
        }
        this.audioSources.push(wavAudio)
        console.log('wavCodec getBlob', wavAudio, wavBlob)

        if (!this.recorder || !this.stream) {
          return
        }
        this.stream.getTracks().forEach((track) => track.stop())

        let blob = new Blob(this.dataChunks, {'type': this.recorder.mimeType})
        const dataUrl = URL.createObjectURL(blob)
        console.log('Recorder stopped', blob, dataUrl)
        this.audioSources.push({
          dataUrl,
          fileName: new Date().toISOString() + '.' + this.getExt()
        })

        // 最后翻译音频对象
        this.recorder = undefined
        this.stream = undefined
      }
      this.recorder.ondataavailable = async (event: BlobEvent) => {
        const data = event.data
        // const buffer = await new Response(data).arrayBuffer()
        // console.log('ondataavailable', data, new Uint8Array(buffer))
        this.dataChunks.push(data)
      }
      this.recorder.start(60)
    }

    public async stopRecord() {
      this.recorder && this.recorder.stop()
    }

    public toggleRecording() {
      if (this.isRecording) {
        this.stopRecord()
      } else {
        this.startRecord()
      }
    }

    public contextClose() {
      this.context && this.context.close()
    }

    public sourceDisconnect() {
      this.source && this.source.disconnect()
      this.processor && this.processor.disconnect()
    }

    public sourceConnect() {
      if (!this.source || !this.processor || !this.context) {
        console.error('sourceConnect error:', this.source, this.processor, this.context)
        return
      }
      this.source.connect(this.processor)
      this.processor.connect(this.context.destination)
    }

    public togglePause() {
      if (!this.recorder) {
        return
      }

      if (this.isPaused) {
        this.recorder.resume()
        this.sourceConnect()
        this.calcRecordingTime()
      } else {
        this.recorder.pause()
        this.sourceDisconnect()
        this.clearRecordingInterval()
      }

      this.isPaused = !this.isPaused
    }

    public calcRecordingTime() {
      this.times = setInterval(() => {
        this.recordingTime++
      }, 1000)
    }

    public clearRecordingInterval() {
      clearInterval(this.times)
    }

    public getExt(): string {
      let ext: string = ''
      if (!this.recorder) {
        return ext
      }

      try {
        const reg: RegExp = /(\w+)\/(?<ext>\w+)(;codecs)?/i
        const res: RegExpMatchArray | null = this.recorder.mimeType.match(reg)

        ext = (res && res.groups && res.groups.ext) || ext
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

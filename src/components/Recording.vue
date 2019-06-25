<template>
  <section class="audio-recording">
    <header class='recording-header'>
      <button @click="toggleRecording" v-text="actionName"></button>
      <button @click="togglePause" v-text="pauseName" :disabled='!isRecording'></button>
      <div>
        Recording time: {{durationLabel}}
      </div>
    </header>

    <div class='recording-container'
         v-for="(source,index) in audioSources" :key="index">
      <span>{{source.fileName}}</span>
      <audio :src="source.dataUrl" controls></audio>
      <button @click="saveAsRecordData(source)">download</button>
    </div>
  </section>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import WavCodec, {IWavCodec} from '@/modules/wavCodec'

@Component
export default class Recording extends Vue {
  public isPaused: boolean = false
  public isRecording: boolean = false
  public stream?: MediaStream
  public recorder?: MediaRecorder
  public audioSources: any[] = []
  public constraints: { [key: string]: any } = {
    audio: true,
    video: false,
  }
  public dataChunks: Blob[] = []
  public sampleRate: number = 9000
  public bufferSize: number = 4096
  public duration: number = 0
  public wavCodec?: IWavCodec

  public async startRecord() {
    this.stream = await navigator.mediaDevices.getUserMedia(this.constraints)
    this.isRecording = true

    // 创建音频环境，处理音频数据
    // @ts-ignore
    const wavCodec = this.wavCodec = new WavCodec(this.stream, {
      sampleRate: this.sampleRate,
      bufferSize: this.bufferSize,
    })
    wavCodec.onDuration = (allDuration: number) => {
      this.duration = allDuration
    }
    wavCodec.start()


    // 原生API
    this.recorder = new MediaRecorder(this.stream)
    this.recorder.onstart = (event: Event) => {
      console.log('Recorder started')
      this.calcRecordingTime()
    }
    this.recorder.onpause = (event: Event) => {
      console.log('Recorder paused')
    }
    this.recorder.onstop = async (event: Event) => {
      this.isRecording = false
      if (!this.recorder || !this.stream) {
        return
      }
      this.stream.getTracks().forEach((track) => track.stop())

      const blob = new Blob(this.dataChunks, {type: this.recorder.mimeType})
      const dataUrl = URL.createObjectURL(blob)
      console.log('Recorder stopped', blob, dataUrl)
      this.audioSources.push({
        dataUrl,
        fileName: 'mediaRecorder' + new Date().toISOString() + '.' + this.getExt(),
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
    this.isPaused = false
    this.recorder && this.recorder.stop()

    if (this.wavCodec) {
      this.wavCodec.stop()
      const wavBlob = this.wavCodec.getBlob()
      const wavAudio = {
        dataUrl: URL.createObjectURL(wavBlob),
        fileName: 'record' + new Date().toISOString() + '.wav',
      }
      this.audioSources.push(wavAudio)
      console.log('this.wavCodec getBlob', wavBlob, wavAudio.dataUrl)
    }
  }

  public toggleRecording() {
    if (this.isRecording) {
      this.stopRecord()
    } else {
      this.startRecord()
    }
  }

  public togglePause() {
    const wavCodec = this.wavCodec as IWavCodec
    const recorder = this.recorder as MediaRecorder

    if (this.isPaused) {
      recorder.resume()
      wavCodec.resume()
      this.calcRecordingTime()
    } else {
      recorder.pause()
      wavCodec.pause()
    }

    this.isPaused = !this.isPaused
  }

  public calcRecordingTime() {
    this.duration = 0
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
      console.error(e)
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

  get durationLabel() {
    return parseFloat((this.duration).toFixed(3))
  }

  get actionName() {
    return this.isRecording ? 'Stop Record' : 'Start Record'
  }

  get pauseName() {
    return this.isPaused ? 'Resume' : 'Paused'
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

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

    <div class='user-info' style='text-align: left;color:#a020ff' v-if='userInfo.id'>
      <span style='padding:0 10px'>current:</span>
      <span style='padding:0 10px'>id: {{userInfo.id}}</span>
      <span style='padding:0 10px'>onlineTime: {{userInfo.onlineTime}}</span>
    </div>
    <div class='rtc-connection-wrap'
         v-if='wsList.length'>
      <table class='online-users'>
        <thead>
        <tr>
          <th>id</th>
          <th>onlineTime</th>
          <th>call</th>
          <th>hang up</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for='(user,index) in wsList'
            :key='index'>
          <td v-for='(val,idx) in user'
              :key='idx'>
            {{val}}
          </td>
          <td>
            <button @click='callPeer(user)'>call</button>
          </td>
          <td>
            <button @click='hangUpPeer(user)'>hang up</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class='data-channel'>
      <div class='send-record' v-if='sendRecord.length'>
        <h4>send-record</h4>
        <div class='send-record-container'>
          <p v-for='(item,index) in sendRecord'
             :key='index'
             class='send-record-item'>
            {{item}}
          </p>
        </div>
      </div>
      <div class='receive-record' v-if='receiveRecord.length'>
        <h4>receive-record</h4>
        <div class='receive-record-container'>
          <p v-for='(item,index) in receiveRecord'
             :key='index'
             class='receive-record-item'>
            {{item}}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import WavCodec, { IWavCodec } from '@/modules/wavCodec'
import { sleep } from '@/utils/time'

enum SignalingType {
  Online = 100,
  Offline,
  UserInfo,
  UserList,
  Offer,
  Answer,
  Candidate,
  HangUp,
  Transfer,
}

interface Signaling {
  [key: string]: any

  command?: number
  target?: number
  data?: { [key: string]: any }
}

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
  public sampleRate: number = 8000
  public bufferSize: number = 512
  public duration: number = 0
  public wavCodec?: IWavCodec

  public ws?: WebSocket
  public localPeer?: RTCPeerConnection
  public receiveChannel?: RTCDataChannel
  public sendChannel?: RTCDataChannel
  public userInfo: any = {}
  public wsList: Array<{ [key: string]: any }> = []
  public receiveRecord: any[] = []
  public sendRecord: any[] = []

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

      const blob = new Blob(this.dataChunks, { type: this.recorder.mimeType })
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

  public saveAsRecordData({ dataUrl, fileName }: { [key: string]: string }): void {
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

  get durationLabel(): number {
    return parseFloat((this.duration).toFixed(3))
  }

  get actionName(): string {
    return this.isRecording ? 'Stop Record' : 'Start Record'
  }

  get pauseName(): string {
    return this.isPaused ? 'Resume' : 'Paused'
  }

  public send(data: object) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return
    }
    try {
      this.ws.send(JSON.stringify(data))
    } catch (e) {

    }
  }

  public wsOffline(data?: { [key: string]: any }) {
    if (!data) {
      return
    }
    for (let i = 0; i < this.wsList.length; i++) {
      const item = this.wsList[i]
      if (data.id === item.id) {
        this.wsList.splice(i, 1)
        break
      }
    }
  }

  public wsOnline(data?: { [key: string]: any }) {
    data && this.wsList.push(data)
  }

  public async processCommand(message: Signaling) {
    // @ts-ignore
    const { command, data, target, source } = message

    switch (command) {
      case SignalingType.Online:
        this.wsOnline(data)
        console.log('Online:', data)
        break
      case SignalingType.Offline:
        this.wsOffline(data)
        console.log('Offline:', data)
        break
      case SignalingType.UserInfo:
        console.log('UserInfo:', data)
        // 接收自己的连接信息
        this.userInfo = {
          ...this.userInfo,
          ...data,
        }
        this.send({
          command: SignalingType.UserList,
        })
        break
      case SignalingType.UserList:
        console.log('UserList:', data)
        this.wsList = [
          ...this.wsList,
          ...(data || {}).list,
        ]
        break
      case SignalingType.Offer:
        console.log('[Offer] data:%o, target:%d, source:%d', data, target, source)
        if (!this.localPeer) {
          this.localPeer = this.newRTCPeerConnection()
        }
        await this.localPeer.setRemoteDescription(new RTCSessionDescription((data || {}).desc))
        await this.localPeer.setLocalDescription(await this.localPeer.createAnswer())
        this.send({
          command: SignalingType.Answer,
          target: source,
          data: {
            desc: this.localPeer.localDescription,
          },
        })
        break
      case SignalingType.Answer:
        console.log('[Answer] data:%o, target:%d, source:%d', data, target, source)
        if (!this.localPeer) {
          this.localPeer = this.newRTCPeerConnection()
        }
        await this.localPeer.setRemoteDescription(new RTCSessionDescription((data || {}).desc))
        for (let i = 0; i < 10; i++) {
          await sleep(1000)
          this.sendDataChannelMessage('test RTCDataChannel ' + i)
        }
        break
      case SignalingType.Candidate:
        if (!this.localPeer) {
          return
        }
        console.log('[Candidate] data:%o, target:%d, source:%d', data, target, source)
        data && data.candidate && this.localPeer.addIceCandidate(new RTCIceCandidate(data.candidate))
        break
      case SignalingType.HangUp:
        console.log('[HangUp] data:%o, target:%d, source:%d', data, target, source)
        this.hangUp()
        break
      case SignalingType.Transfer:
        console.log('[Transfer] data:%o, target:%d, source:%d', data, target, source)
        break
      default:
        console.warn('[Unknown] command:%d, target:%d, source:%d, data:%o', command, target, source, data)
    }
  }

  public initWebSocket() {
    const ws: WebSocket = (window as any).ws = this.ws = new WebSocket(`ws://${window.location.hostname}:7000/ws`)
    ws.onmessage = (event: MessageEvent) => {
      let message: Signaling
      try {
        message = JSON.parse(event.data)
      } catch (e) {
        message = {}
      }

      this.processCommand(message)
    }
    ws.onopen = (event: Event) => {
      console.log('WebSocket opened!', event)
    }
    ws.onerror = (event: Event) => {
      console.log('WebSocket error:', event)
    }
    ws.onclose = (event: CloseEvent) => {
      console.log('WebSocket closed:', event)
      // setTimeout(this.initWebSocket, 5 * 1000)
    }
  }

  public beforeMount() {
    this.newRTCPeerConnection()
    this.initWebSocket()
  }

  public newRTCPeerConnection(): RTCPeerConnection {
    this.localPeer = new RTCPeerConnection()

    this.sendChannel = this.localPeer.createDataChannel('sendChannel')
    this.sendChannel.onopen = this.sendChannel.onclose = (event: Event) => {
      switch (event.type) {
        case 'open':
          console.log('sendChannel onopen:', event)
          break
        case 'close':
          console.log('sendChannel onclose:', event)
          break
      }
    }

    this.localPeer.ondatachannel = (event: RTCDataChannelEvent) => {
      this.receiveChannel = event.channel
      this.receiveChannel.onmessage = (ev: MessageEvent) => {
        console.log('receiveChannel onmessage:', ev)
        this.writeRecord(ev.data, 1)
      }
      this.receiveChannel.onopen = this.receiveChannel.onclose = (ev: Event) => {
        switch (ev.type) {
          case 'open':
            console.log('receiveChannel onopen:', ev)
            break
          case 'close':
            console.log('receiveChannel onclose:', ev)
            break
        }
      }
    }

    return this.localPeer
  }

  public async callPeer(user: { [key: string]: any }) {
    console.log('callPeer', user.id)
    if (!this.localPeer) {
      this.localPeer = this.newRTCPeerConnection()
    }
    this.localPeer.onicecandidate = (ev: RTCPeerConnectionIceEvent) => {
      if (!ev.candidate) {
        return
      }
      this.send({
        command: SignalingType.Candidate,
        target: user.id,
        data: {
          candidate: ev.candidate,
        },
      })
    }

    await this.localPeer.setLocalDescription(await this.localPeer.createOffer())
    this.send({
      command: SignalingType.Offer,
      target: user.id,
      data: {
        desc: this.localPeer.localDescription,
      },
    })
  }

  public hangUpPeer(user: { [key: string]: any }) {
    console.log('hangUpPeer', user.id)
    this.send({
      command: SignalingType.HangUp,
      target: user.id,
    })
  }

  public hangUp() {
    if (!this.localPeer) {
      return
    }

    this.localPeer.ontrack = null
    this.localPeer.oniceconnectionstatechange = null
    this.localPeer.onsignalingstatechange = null
    this.localPeer.onicegatheringstatechange = null

    // Close the peer connection
    this.localPeer.close()
    this.localPeer = undefined

  }

  public sendDataChannelMessage(message: string) {
    if (!this.sendChannel || this.sendChannel.readyState !== 'open') {
      return
    }
    this.sendChannel.send(message)
    this.writeRecord(message, 0)
  }

  public writeRecord(message: string, type: number) {
    const timeStr: string = new Date().toLocaleTimeString()
    const record: string = `${timeStr}: ${message}`
    if (type === 0) {
      this.sendRecord.push(record)
    } else {
      this.receiveRecord.push(record)
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

  .online-users {
    width: 100%;
  }

  .data-channel {
    display: flex;

    .send-record,
    .receive-record {
      flex: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-height: 60px;
      line-height: 26px;
      padding: 10px;
      text-align: left;

      h4 {
        margin: 0;
        padding: 0;
        text-align: center;
      }

      .send-record-container,
      .receive-record-container {
        max-height: 60vh;
        overflow: auto;
      }
    }
  }
</style>

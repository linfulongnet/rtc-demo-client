import {cloneDeep} from 'lodash'

export interface RTCConfiguration {
  [key: string]: any
}

export interface IRemoteUser {
  [key: string]: any

  id: string | number
  desc: string
}

export interface IPeerRtc {
  [key: string]: any

  ws: WebSocket

  config?: RTCConfiguration
  stream?: MediaStream
  candidates?: any[]
  remoteUser?: IRemoteUser[]

  onicecandidate: (event: RTCPeerConnectionIceEvent) => void
  onaddstream: (event: MediaStreamEvent) => void

  isConnected: () => boolean
  send: (data?: any) => void
  offer: () => void
  answer: () => void
}

function initWebSocket(url: string): WebSocket {
  const ws: WebSocket = new WebSocket(url)
  ws.onopen = () => {
    console.log('webSocket opened')
  }
  ws.onclose = () => {
    console.log('webSocket closed')
  }
  ws.onerror = (event: Event) => {
    console.log('webSocket error', event)
  }
  ws.onmessage = (event: Event) => {
    console.log('webSocket onmessage', event)
  }

  return ws
}

export class PeerRtc extends RTCPeerConnection implements IPeerRtc {
  public config: RTCConfiguration
  public ws: WebSocket
  public candidates?: any[]
  public remoteUser?: IRemoteUser[]
  public stream?: MediaStream

  constructor(wsUrl: string, option?: RTCConfiguration) {
    super(option)
    this.config = cloneDeep(option || {})
    this.ws = initWebSocket(wsUrl)
    this.candidates = []
    this.remoteUser = []

  }

  // 向对方发送nat candidate
  public onIcecandidate(event: RTCPeerConnectionIceEvent) {
    if (!event.candidate) {
      return
    }
    console.log('send remote with my nat candidate', event.candidate)
    this.send({
      type: 'candidate',
      data: {
        candidate: event.candidate,
        remoteUserId: 0,
      },
    })
  }

  // 收到对方的视频流
  public onaddstream(event: MediaStreamEvent) {
    console.log('onaddstream trigger', event.stream)
  }

  // 对方关闭
  public onIceconnectionstatechange(peer: RTCPeerConnection, event: Event) {
    console.log('signalingstatechange', event, this.iceConnectionState)
    if (this.iceConnectionState === 'disconnected') {
      this.stream && this.stream.getVideoTracks()[0].stop()
    }
  }

  public isConnected(): boolean {
    return this.ws.readyState === WebSocket.OPEN
  }

  public send(data?: any): void {
    if (!this.isConnected()) {
      console.warn('webSocket is not connected!')
      return
    }
    this.ws.send(JSON.stringify(data))
  }

  public offer(): void {
    // let remote = client._remote;
    // remote.sendData({
    //   type: 'offer',
    //   data: {
    //     desc: data.desc
    //   }
    // });
  }

  public answer(): void {
    // let remote = client._remote;
    // remote.sendData({
    //   type: 'answer',
    //   data: {
    //     desc: data.desc
    //   }
    // });
  }

}

export default PeerRtc

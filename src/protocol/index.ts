import { Transfer } from './rpc'

export * from './rpc'

type queryCallBack = (data?: any) => void

export interface SendOption {
  [key: string]: any

  callback?: queryCallBack
  decoder?: any
}

const SocketCallOption: { [key: number]: SendOption } = {}

let socket: WebSocket | undefined = undefined

export function initWebSocket(url?: string) {
  if (socket && (socket.readyState === socket.OPEN || socket.readyState === socket.CONNECTING)) {
    return
  }

  if (!url) {
    url = `ws://${window.location.hostname}:7000/ws`
  }
  socket = new WebSocket(url)
  socket.onmessage = (event: MessageEvent) => {
    const data: Uint8Array = event.data
    console.log('onmessage:', data)
    const message: Transfer.IRpc = Transfer.Rpc.decode(data)
    const callOption: SendOption | undefined = SocketCallOption[message.qid]
    if (callOption) {
      if (callOption.decoder) {
        message.data = callOption.decoder.decode(message.data)
      }
      if (callOption.callback) {
        callOption.callback(message)
      }
    }

    delete SocketCallOption[message.qid]
  }
  socket.onopen = (event: Event) => {
    console.log('WebSocket opened!')
    socket.binaryType = 'arraybuffer'
  }
  socket.onclose = (event: CloseEvent) => {
    console.log('WebSocket closed:')
  }
}

function socketIsOpen(): boolean {
  if (socket && socket.readyState === socket.OPEN) {
    return true
  }
  return false
}

export function sendMessage(rpc: Transfer.IRpc, option: SendOption): void {
  if (!socketIsOpen) {
    return
  }

  SocketCallOption[rpc.qid] = option
  const bytes: Uint8Array = Transfer.Rpc.encode(rpc).finish()
  socket.send(bytes)
}

let qid = 0

function getQid(): number {
  if (qid >= 0xFFFFFFFF) {
    qid = 0
  }

  return qid++
}

export function newRpc(): Transfer.IRpc {
  const rpc = new Transfer.Rpc()
  rpc.qid = getQid()

  return rpc
}

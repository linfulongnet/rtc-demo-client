// @ts-ignore
import { Transfer } from './rpc'

type queryCallBack = (rpc: Transfer.IRpc) => void

export interface SendOption {
  [key: string]: any

  callback?: queryCallBack
  decodeCtx?: any
}

const SocketCallOption: { [key: number]: SendOption } = {}

const socket: WebSocket = new WebSocket(`ws://${window.location.hostname}:7000/ws`)
socket.onmessage = (event: MessageEvent) => {
  const data: Uint8Array = event.data
  const message: Transfer.IRpc = Transfer.Rpc.decode(data)
  const callOption: SendOption | undefined = SocketCallOption[message.qid]
  if (callOption) {
    if (callOption.decodeCtx) {
      message.data = callOption.decodeCtx.decode(message.data)
    }
    if (callOption.callback) {
      callOption.callback(message)
    }
  }

  delete SocketCallOption[message.qid]
}
socket.onopen = (event: Event) => {
  console.log('WebSocket opened!', event)
  socket.binaryType = 'arraybuffer'
}
socket.onclose = (event: CloseEvent) => {
  console.log('WebSocket closed:', event)
}


function socketIsOpen(): boolean {
  if (socket && socket.readyState === socket.OPEN) {
    return true
  }
  return false
}

function send(rpc: Transfer.IRpc, option: SendOption): void {
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

function newRpc(): Transfer.IRpc {
  const rpc = new Transfer.Rpc()
  rpc.qid = getQid()

  return rpc
}

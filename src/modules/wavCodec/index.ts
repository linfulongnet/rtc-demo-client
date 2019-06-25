export interface ICodecOption {
  [key: string]: any

  originSampleRate?: number
  sampleRate?: number
  sampleSize?: number
  channelCount?: number
  bufferSize?: number
}

const DefCodecOption: ICodecOption = {
  originSampleRate: 44100,
  sampleRate: 22050,
  channelCount: 1,
  bufferSize: 4096,
  sampleSize: 16
}

export interface IWavCodec {
  config: ICodecOption
  dataViews: DataView[]
  dataViewsLength: number
  ratio: number

  stream?: MediaStream
  source?: MediaStreamAudioSourceNode
  processor?: ScriptProcessorNode

  new(option?: ICodecOption): IWavCodec

  compress(samples: Float32Array, sampleRate: number): Float32Array

  encode(samples: Float32Array): void

  finish(): void

  cancel(): void

  getBlob(type?: string): Blob

  start(): void

  stop(): void

  pause(): void

  resume(): void

  onDuration(cb: (allDuration: number, duration: number) => void): void

  ondataavailable(event: BlobEvent): void
}

// @ts-ignore
export class WavCodec implements IWavCodec {
  config: ICodecOption
  dataViews: DataView[] = []
  dataViewsLength: number = 0
  ratio: number = 1
  stream: MediaStream
  source: MediaStreamAudioSourceNode
  processor: ScriptProcessorNode
  duration: number = 0

  cbs: { [key: string]: Function } = {}

  constructor(stream: MediaStream, option?: ICodecOption) {
    this.stream = stream
    this.config = {
      ...DefCodecOption,
      ...option
    }

    // 获取音频轨道数据
    const tracks = this.stream.getAudioTracks()
    const firstTrackSettings = tracks[0].getSettings()
    this.config.sampleSize = firstTrackSettings.sampleSize as number
    const channelCount: number = this.config.channelCount = firstTrackSettings.channelCount as number
    const sampleRate: number = this.config.sampleRate as number
    const bufferSize: number = this.config.bufferSize as number

    // 生成音频源节点，及设置采样数据量大小
    const context = new AudioContext()
    this.source = context.createMediaStreamSource(stream)
    this.processor = context.createScriptProcessor(bufferSize, channelCount, channelCount)
    this.processor.onaudioprocess = this.onaudioprocess.bind(this)

    const originSampleRate: number = this.config.originSampleRate = this.source.context.sampleRate as number

    // 计算压缩比率值
    this.ratio = Math.ceil(originSampleRate / sampleRate)
    console.log('ratio', originSampleRate, sampleRate, this.ratio)
  }

  start() {
    this.resume()
  }

  stop() {
    this.pause()
    this.stream.getTracks().forEach((track) => track.stop())
  }

  pause() {
    this.source && this.source.disconnect()
    this.processor && this.processor.disconnect()
  }

  resume() {
    this.source.connect(this.processor)
    this.processor.connect(this.source.context.destination)
  }

  onaudioprocess(ev: AudioProcessingEvent) {
    const sample = ev.inputBuffer.getChannelData(0)
    this.duration += ev.inputBuffer.duration
    this.cbs['duration'] && this.cbs['duration'](this.duration, ev.inputBuffer.duration)
    this.encode(sample)
  }

  ondataavailable(event: BlobEvent) {

  }

  onDuration(cb: (allDuration: number, duration: number) => void) {
    this.cbs['duration'] = cb
  }

  /*
  * 压缩录音数据，根据重定义的采样率压缩数据，在生成wav格式前处理
  * @param samples 采集的音频数据
  * @param ratio 压缩比率
  * */
  compress(samples: Float32Array): Float32Array {
    const length = ~~(samples.length / this.ratio)
    const result = new Float32Array(length)
    for (let index = 0; index < length; index++) {
      result[index] = samples[index * this.ratio]
    }
    return result
  }

  encode(samples: Float32Array): void {
    // 根据采样率比值压缩原始音频数据
    samples = this.compress(samples)

    let {channelCount} = this.config
    let buffer: ArrayBuffer = new ArrayBuffer(samples.length * (channelCount as number) * 2)
    let view: DataView = new DataView(buffer)
    let offset: number = 0

    for (let i = 0; i < samples.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, samples[i]))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    }

    this.dataViews.push(view)
    this.dataViewsLength += buffer.byteLength
  }

  finish() {
    let buffer: ArrayBuffer = new ArrayBuffer(44)
    let view: DataView = new DataView(buffer)
    let {channelCount, sampleRate, sampleSize} = this.config as { sampleRate: number, sampleSize: number, channelCount: number }
    let dataSize: number = channelCount * this.dataViewsLength * 2
    let blockAlign: number = channelCount * sampleSize / 8

    // 设置wav格式头部信息数据
    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + dataSize, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, channelCount, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * blockAlign, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, sampleSize, true)
    writeString(view, 36, 'data')
    view.setUint32(40, dataSize, true)

    this.dataViews.unshift(view)
  }

  cancel() {
    this.dataViews = []
    this.dataViewsLength = 0
  }

  getBlob(type?: string): Blob {
    return new Blob(this.dataViews, {type: type || 'audio/wav'})
  }
}

export default WavCodec

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

// function floatTo16BitPCM(output, offset, input) {
//   let initOffset = offset;
//   for (let i = 0; i < input.length; i++, initOffset += 2) {
//     const s = Math.max(-1, Math.min(1, input[i]));
//     output.setInt16(initOffset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
//   }
// }
// function floatTo8bitPCM(output, offset, input) {
//   let initOffset = offset;
//   for (let i = 0; i < input.length; i++, initOffset++) {
//     const s = Math.max(-1, Math.min(1, input[i]));
//     const val = s < 0 ? s * 0x8000 : s * 0x7FFF;
//     output.setInt8(initOffset, parseInt(val / 256 + 128, 10), true);
//   }
// }

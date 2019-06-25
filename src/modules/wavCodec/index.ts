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
  // sampleRate: 8000、16000、32000、44100、48000
  sampleRate: 16000,
  channelCount: 1,
  bufferSize: 4096,
  sampleSize: 16
}

export interface IWavCodec {
  config: ICodecOption
  dataViews: DataView[]
  dataViewsLength: number

  stream?: MediaStream
  source?: MediaStreamAudioSourceNode
  processor?: ScriptProcessorNode

  encode(samples: Float32Array): void

  getWavHead(): DataView

  getBlob(type?: string): Blob

  start(): void

  stop(): void

  pause(): void

  resume(): void

  onDuration(allDuration: number, duration: number): void
}

export class WavCodec implements IWavCodec {
  config: ICodecOption
  dataViews: DataView[] = []
  dataViewsLength: number = 0
  duration: number = 0

  stream?: MediaStream
  source?: MediaStreamAudioSourceNode
  processor?: ScriptProcessorNode

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
    const bufferSize: number = this.config.bufferSize as number

    // 生成音频源节点，及设置采样数据量大小
    const context = new AudioContext()
    this.source = context.createMediaStreamSource(stream)
    this.processor = context.createScriptProcessor(bufferSize, channelCount, channelCount)
    this.processor.onaudioprocess = this.onaudioprocess.bind(this)
    this.config.originSampleRate = this.source.context.sampleRate as number
  }

  start() {
    this.dataViews = []
    this.dataViewsLength = 0

    this.resume()
  }

  stop() {
    this.pause()
    this.stream && this.stream.getTracks().forEach((track) => track.stop())
  }

  pause() {
    this.source && this.source.disconnect()
    this.processor && this.processor.disconnect()
  }

  resume() {
    if (!this.source || !this.processor) {
      return
    }
    this.source.connect(this.processor)
    this.processor.connect(this.source.context.destination)
  }

  onaudioprocess(ev: AudioProcessingEvent) {
    const sample = ev.inputBuffer.getChannelData(0)
    this.duration += ev.inputBuffer.duration
    this.onDuration(this.duration, ev.inputBuffer.duration)
    this.encode(sample)
  }

  onDuration(allDuration: number, duration: number) {
  }

  encode(samples: Float32Array): void {
    // 根据采样率比值压缩原始音频数据
    samples = interpolateArray(samples, this.config.sampleRate as number, this.config.originSampleRate as number)

    let {channelCount} = this.config as { channelCount: number }
    let buffer: ArrayBuffer = new ArrayBuffer(samples.length * channelCount * 2)
    let view: DataView = new DataView(buffer)

    floatTo16BitPCM(view, samples)

    this.dataViews.push(view)
    this.dataViewsLength += buffer.byteLength
  }

  getWavHead(): DataView {
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

    return view
  }

  getBlob(type?: string): Blob {
    const buffer: DataView[] = [
      this.getWavHead(),
      ...this.dataViews
    ]
    console.log('buffer', buffer)
    return new Blob(buffer, {type: type || 'audio/wav'})
  }
}

export default WavCodec

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

/*
* 压缩录音数据，根据重定义的采样率压缩数据，在生成wav格式前处理
* @param samples   采集的音频数据
* @param ratio     压缩比率
* */
function compress(samples: Float32Array, ratio: number): Float32Array {
  const length = ~~(samples.length / ratio)
  const result = new Float32Array(length)
  for (let index = 0; index < length; index++) {
    result[index] = samples[index * ratio]
  }
  return result
}

// 音频重采样数据线性插值
function linearInterpolate(before: number, after: number, atPoint: number) {
  return before + (after - before) * atPoint
}

/**
 * 音频重采样
 * @param data               原始数据
 * @param originSampleRate   原始采样率
 * @param sampleRate         新采样率
 */
function interpolateArray(data: Float32Array, sampleRate: number, originSampleRate: number): Float32Array {
  if (originSampleRate == sampleRate) {
    return data
  }

  let fitCount: number = ~~(data.length * (sampleRate / originSampleRate))
  let newData: Float32Array = new Float32Array(fitCount)
  let lastDataPos: number = data.length - 1
  let lastFitPos: number = fitCount - 1
  let springFactor: number = lastDataPos / lastFitPos
  newData[0] = data[0]
  for (let i = 1; i < lastFitPos; i++) {
    let tmp = i * springFactor
    let before = ~~(Math.floor(tmp))
    let after = ~~(Math.ceil(tmp))
    newData[i] = linearInterpolate(data[before], data[after], tmp - before)
  }
  newData[lastFitPos] = data[lastDataPos]

  return newData
}

/**
 * 音频重采样
 * @param sourceData         原始数据
 * @param originSampleRate   原始采样率
 * @param sampleRate         新采样率
 */
function resampledData(sourceData: Float32Array, sampleRate: number, originSampleRate: number): Float32Array {
  if (originSampleRate == sampleRate) {
    return sourceData
  }

  let srcSize = sourceData.length
  let last_pos = srcSize - 1
  let dstSize = srcSize * (sampleRate / originSampleRate)
  let destinationData: Float32Array = new Float32Array(dstSize)
  for (let idx = 0; idx < dstSize; idx++) {
    let index = ~~((idx * originSampleRate) / (sampleRate))
    let p1 = index
    let coef = index - p1
    let p2 = (p1 == last_pos) ? last_pos : p1 + 1
    destinationData[idx] = ((1.0 - coef) * sourceData[p1] + coef * sourceData[p2])
  }

  return destinationData
}

// 编码16位pcm数据 sampleSize=16
function floatTo16BitPCM(view: DataView, input: Float32Array, offset: number = 0): void {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]))
    s = s < 0 ? s * 0x8000 : s * 0x7FFF
    view.setInt16(offset, s, true)

    // // 取整数
    // let sample = (samples[i] * 0x7FFF) | 0
    // if (sample > 0x7FFF) {
    //   sample = 0x7FFF
    // } else if (sample < -0x8000) {
    //   sample = -0x8000
    // }
    // view.setInt16(offset, sample, true)
  }
}

// 编码8位pcm数据 sampleSize=8
function floatTo8bitPCM(view: DataView, input: Float32Array, offset: number = 0): void {
  for (let i = 0; i < input.length; i++, offset++) {
    const s = Math.max(-1, Math.min(1, input[i]))
    let val = s < 0 ? s * 0x8000 : s * 0x7FFF
    val = (val / 256 + 128) | 0
    view.setInt8(offset, val)
  }
}

export interface ICodecOption {
  [key: string]: any

  sampleRate: number
  sampleSize: number
  channelCount: number
  bufferSize: number
}

export interface IWavCodec {
  config: ICodecOption
  dataViews: DataView[]
  dataViewsLength: number

  new(option?: ICodecOption): IWavCodec

  writeString(view: DataView, offset: number, str: string): void

  compress(samples: Float32Array, sampleRate: number): Float32Array

  encode(samples: Float32Array): void

  finish(): void

  cancel(): void

  getBlob(type?: string): Blob
}

const DefCodecOption: ICodecOption = {
  sampleRate: 44100,
  channelCount: 1,
  bufferSize: 4096,
  sampleSize: 16
}

// @ts-ignore
export class WavCodec implements IWavCodec {
  config: ICodecOption
  dataViews: DataView[] = []
  dataViewsLength: number = 0

  constructor(option: ICodecOption = DefCodecOption) {
    this.config = {
      ...option
    }
  }

  writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  /*
  * 压缩录音数据
  * @param samples 采集的音频数据
  * @param ratio 压缩比率
  * */
  compress(samples: Float32Array, ratio: number): Float32Array {
    const length = samples.byteLength / ratio
    const result = new Float32Array(length)
    for (let index = 0; index < length; index++) {
      result[index] = samples[index * ratio]
    }
    return result
  }

  encode(samples: Float32Array): void {
    let {channelCount} = this.config
    let buffer = new ArrayBuffer(samples.length * channelCount * 2)
    let view: DataView = new DataView(buffer)
    let offset = 0

    for (let i = 0; i < samples.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, samples[i]))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    }

    this.dataViews.push(view)
    this.dataViewsLength += buffer.byteLength
  }

  finish() {
    let buffer = new ArrayBuffer(44)
    let view = new DataView(buffer)
    let {channelCount, sampleRate} = this.config
    let dataSize: number = channelCount * this.dataViewsLength * 2

    // 设置wav格式头部信息数据
    this.writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + dataSize, true)
    this.writeString(view, 8, 'WAVE')
    this.writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, channelCount, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 4, true)
    view.setUint16(32, channelCount * 2, true)
    view.setUint16(34, 16, true)
    this.writeString(view, 36, 'data')
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

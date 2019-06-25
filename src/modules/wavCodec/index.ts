export interface ICodecOption {
  [key: string]: any

  originSampleRate?: number
  sampleRate?: number
  sampleSize?: number
  channelCount?: number
  bufferSize?: number
}

export interface IWavCodec {
  config: ICodecOption
  dataViews: DataView[]
  dataViewsLength: number
  ratio: number

  new(option?: ICodecOption): IWavCodec

  writeString(view: DataView, offset: number, str: string): void

  compress(samples: Float32Array, sampleRate: number): Float32Array

  encode(samples: Float32Array): void

  finish(): void

  cancel(): void

  getBlob(type?: string): Blob
}

const DefCodecOption: ICodecOption = {
  originSampleRate: 44100,
  sampleRate: 22050,
  channelCount: 1,
  bufferSize: 4096,
  sampleSize: 16
}

// @ts-ignore
export class WavCodec implements IWavCodec {
  config: ICodecOption
  dataViews: DataView[] = []
  dataViewsLength: number = 0
  ratio: number = 1

  constructor(option: ICodecOption = DefCodecOption) {
    this.config = {
      ...DefCodecOption,
      ...option
    }
    let {sampleRate, originSampleRate} = this.config as { sampleRate: number, originSampleRate: number }
    this.ratio = Math.ceil(originSampleRate / sampleRate)
    console.log('ratio', originSampleRate, sampleRate, this.ratio)
  }

  writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
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
    this.writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + dataSize, true)
    this.writeString(view, 8, 'WAVE')
    this.writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, channelCount, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * blockAlign, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, sampleSize, true)
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

import {shallowMount} from '@vue/test-utils'
import AudioRecording from '@/components/AudioRecording.vue'

// function sleep(s: number): Promise<boolean> {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(true)
//     }, s * 1000)
//   })
// }

describe('AudioRecording.vue', () => {
  it('mount audio-recording component', () => {
    const wrapper = shallowMount(AudioRecording, {})
    const btn = wrapper.find('button')
    expect(btn.html()).toMatch('Start Record')
    expect(wrapper.vm.$data.isRecording).toBe(false)
  })
  // it('toggleRecording', async () => {
  //   const wrapper = shallowMount(AudioRecording, {})
  //   const btn = wrapper.find('button')
  //   btn.trigger('click')
  //
  //   await sleep(3)
  //
  //   expect(wrapper.vm.$data.isRecording).toBe(true)
  //   btn.trigger('click')
  //
  //   await sleep(3)
  //
  //   expect(btn.html()).toMatch('Stop Record')
  // })
})

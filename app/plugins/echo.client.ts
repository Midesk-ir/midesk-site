import { emitRealtimeEvent, onRealtimeEvent, realtimeKey } from '~/utils/realtime-bus'

type Listener = (payload: unknown) => void

class MockEchoChannel {
  private channel: string
  private subs = new Map<string, () => void>()

  constructor(channel: string) {
    this.channel = channel
  }

  listen(event: string, handler: Listener) {
    const key = realtimeKey(this.channel, event)
    const off = onRealtimeEvent(key, handler)
    this.subs.set(event, off)
    return this
  }

  stopListening(event?: string) {
    if (event) {
      this.subs.get(event)?.()
      this.subs.delete(event)
    } else {
      this.subs.forEach(off => off())
      this.subs.clear()
    }
    return this
  }
}

export default defineNuxtPlugin(() => {
  const echo = {
    private(channel: string) {
      return new MockEchoChannel(channel)
    },
    emit(channel: string, event: string, payload: unknown) {
      emitRealtimeEvent(realtimeKey(channel, event), payload)
    }
  }

  return { provide: { echo } }
})

declare module '#app' {
  interface NuxtApp {
    $echo: {
      private: (channel: string) => MockEchoChannel
      emit: (channel: string, event: string, payload: unknown) => void
    }
  }
}

export {}

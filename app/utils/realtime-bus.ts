type RealtimeHandler = (payload: unknown) => void

const listeners = new Map<string, Set<RealtimeHandler>>()

export function onRealtimeEvent(key: string, handler: RealtimeHandler) {
  if (!listeners.has(key)) listeners.set(key, new Set())
  listeners.get(key)!.add(handler)
  return () => listeners.get(key)?.delete(handler)
}

export function emitRealtimeEvent(key: string, payload: unknown) {
  listeners.get(key)?.forEach(handler => handler(payload))
}

export function realtimeKey(channel: string, event: string) {
  return `${channel}:${event}`
}

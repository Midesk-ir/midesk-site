import type { ChatMessage, ChatMessageType } from '~/types/phase4'

type RawSender = {
  id?: string
  name?: string
  full_name?: string
  avatar_url?: string | null
}

type RawReaction = {
  emoji: string
  user_id?: string
}

type RawReply = {
  id?: string
  body?: string
  sender?: RawSender | string
  sender_user_id?: string
}

export type RawChatMessage = {
  id: string
  channel_id: string
  sender_user_id?: string
  body?: string | null
  type?: string
  file_path?: string | null
  file_name?: string | null
  reply_to?: RawReply | null
  reactions?: RawReaction[]
  created_at: string
  edited_at?: string | null
  sender?: RawSender | null
}

function normalizeSender(raw: RawSender | null | undefined, fallbackId?: string) {
  return {
    id: raw?.id ?? fallbackId ?? '',
    name: raw?.name ?? raw?.full_name ?? '—',
    avatar_url: raw?.avatar_url ?? null
  }
}

function normalizeReactions(
  raw: RawReaction[] | undefined,
  currentUserId?: string | null
): ChatMessage['reactions'] {
  const grouped = new Map<string, { count: number, reacted_by_me: boolean }>()

  for (const reaction of raw ?? []) {
    const current = grouped.get(reaction.emoji) ?? { count: 0, reacted_by_me: false }
    current.count += 1
    if (currentUserId && reaction.user_id === currentUserId) {
      current.reacted_by_me = true
    }
    grouped.set(reaction.emoji, current)
  }

  return Array.from(grouped.entries()).map(([emoji, data]) => ({
    emoji,
    count: data.count,
    reacted_by_me: data.reacted_by_me
  }))
}

function normalizeReply(raw: RawReply | null | undefined): ChatMessage['reply_to'] {
  if (!raw) return undefined

  const sender = typeof raw.sender === 'string'
    ? raw.sender
    : normalizeSender(raw.sender, raw.sender_user_id).name

  return {
    id: raw.id ?? '',
    body: raw.body ?? '',
    sender
  }
}

export function normalizeChatMessage(
  raw: RawChatMessage,
  currentUserId?: string | null
): ChatMessage {
  return {
    id: raw.id,
    channel_id: raw.channel_id,
    sender: normalizeSender(raw.sender, raw.sender_user_id),
    body: raw.body ?? undefined,
    type: (raw.type ?? 'text') as ChatMessageType,
    file_path: raw.file_path ?? undefined,
    file_name: raw.file_name ?? undefined,
    reply_to: normalizeReply(raw.reply_to),
    reactions: normalizeReactions(raw.reactions, currentUserId),
    created_at: raw.created_at,
    edited_at: raw.edited_at ?? undefined
  }
}

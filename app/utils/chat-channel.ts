import type { ChatChannel, ChatChannelType } from '~/types/phase4'

type RawMember = {
  user_id?: string
  user?: { id?: string }
  muted_until?: string | null
}

type RawChannel = {
  id: string
  name?: string | null
  type: string
  description?: string | null
  members?: RawMember[]
  last_message_at?: string | null
  unread_count?: number
}

export function normalizeChatChannel(
  raw: RawChannel,
  extras?: { unread_count?: number }
): ChatChannel {
  const members = raw.members ?? []
  const memberIds = members
    .map(m => m.user_id ?? m.user?.id)
    .filter((id): id is string => Boolean(id))
  const type = raw.type as ChatChannelType

  return {
    id: raw.id,
    name: raw.name ?? undefined,
    type,
    description: raw.description ?? undefined,
    is_readonly: type === 'channel',
    member_ids: memberIds,
    last_message_at: raw.last_message_at ?? undefined,
    unread_count: extras?.unread_count ?? raw.unread_count ?? 0,
    members_count: memberIds.length,
    is_muted: members.some(m => m.muted_until && new Date(m.muted_until) > new Date())
  }
}

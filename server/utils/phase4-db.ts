import { randomUUID } from 'node:crypto'
import type { UserBrief } from '../../app/types/phase1'
import type {
  AiQueryPayload,
  AiRequest,
  ChatChannel,
  ChatMessage,
  CreateChatChannelPayload,
  CreateMeetingPayload,
  CreateNotePayload,
  Meeting,
  Note,
  NotificationPreference,
  SendChatMessagePayload,
  UpdateNotificationPreferencePayload
} from '../../app/types/phase4'

const users: UserBrief[] = [
  { id: 'u1', name: 'علی محمدآبادی', avatar_url: null },
  { id: 'u2', name: 'Sara Johnson', avatar_url: null },
  { id: 'u3', name: 'محمد کریمی', avatar_url: null }
]

function meetingIso(daysFromNow: number, hour: number, minute = 0) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const channelReads = new Map<string, Map<string, string>>()

let messages: ChatMessage[] = [
  {
    id: 'msg1',
    channel_id: 'ch1',
    sender: users[2]!,
    body: 'سلام تیم، وضعیت اسپرینت چطوره؟',
    type: 'text',
    reactions: [{ emoji: '👍', count: 2, reacted_by_me: false }],
    created_at: '2026-06-28T08:00:00Z'
  },
  {
    id: 'msg2',
    channel_id: 'ch1',
    sender: users[1]!,
    body: 'تسک‌های فرانت تقریباً تموم شدن.',
    type: 'text',
    reactions: [],
    created_at: '2026-06-28T08:05:00Z'
  },
  {
    id: 'msg3',
    channel_id: 'ch1',
    sender: users[0]!,
    body: 'عالیه، فردا review داریم.',
    type: 'text',
    reactions: [{ emoji: '✅', count: 1, reacted_by_me: true }],
    created_at: '2026-06-28T08:10:00Z'
  },
  {
    id: 'msg4',
    channel_id: 'ch2',
    sender: users[0]!,
    body: 'سلام محمد، گزارش حضور آماده شد؟',
    type: 'text',
    reactions: [],
    created_at: '2026-06-27T14:00:00Z'
  },
  {
    id: 'msg5',
    channel_id: 'ch3',
    sender: users[0]!,
    body: 'اطلاعیه: جلسه عمومی فردا ساعت ۱۰.',
    type: 'text',
    reactions: [],
    created_at: '2026-06-26T09:00:00Z'
  }
]

let channels: ChatChannel[] = [
  {
    id: 'ch1',
    name: 'تیم توسعه',
    type: 'group',
    member_ids: ['u1', 'u2', 'u3'],
    last_message: messages[2],
    last_message_at: messages[2]!.created_at,
    unread_count: 0,
    members_count: 3,
    is_muted: false
  },
  {
    id: 'ch2',
    type: 'dm',
    member_ids: ['u1', 'u3'],
    last_message: messages[3],
    last_message_at: messages[3]!.created_at,
    unread_count: 1,
    members_count: 2,
    is_muted: false
  },
  {
    id: 'ch3',
    name: 'اعلان‌ها',
    type: 'channel',
    is_readonly: true,
    member_ids: ['u1', 'u2', 'u3'],
    last_message: messages[4],
    last_message_at: messages[4]!.created_at,
    unread_count: 0,
    members_count: 3,
    is_muted: false
  }
]

let meetings: Meeting[] = [
  {
    id: 'mt1',
    title: 'استندآپ روزانه',
    organizer: users[0]!,
    start_at: meetingIso(0, 10),
    end_at: meetingIso(0, 10, 30),
    provider: 'jitsi',
    room_url: 'https://meet.jit.si/midesk-mt1',
    status: 'scheduled',
    attendees: [
      { user: users[0]!, status: 'accepted' },
      { user: users[1]!, status: 'accepted' },
      { user: users[2]!, status: 'invited' }
    ]
  },
  {
    id: 'mt2',
    title: 'Review اسپرینت',
    organizer: users[2]!,
    start_at: meetingIso(2, 14),
    end_at: meetingIso(2, 15, 30),
    provider: 'jitsi',
    room_url: 'https://meet.jit.si/midesk-mt2',
    status: 'scheduled',
    attendees: [
      { user: users[0]!, status: 'accepted' },
      { user: users[2]!, status: 'accepted' },
      { user: users[1]!, status: 'invited' }
    ]
  },
  {
    id: 'mt3',
    title: 'جلسه HR — آنبوردینگ',
    organizer: users[0]!,
    start_at: meetingIso(-5, 9),
    end_at: meetingIso(-5, 10),
    provider: 'bbb',
    room_url: 'https://meet.jit.si/midesk-mt3',
    status: 'completed',
    attendees: [
      { user: users[0]!, status: 'attended' },
      { user: users[2]!, status: 'attended' }
    ]
  }
]

let aiRequests: AiRequest[] = [
  {
    id: 'ai1',
    type: 'general',
    prompt: 'خلاصه وضعیت پروژه Midesk را بنویس',
    context_type: 'project',
    context_id: 'p1',
    status: 'completed',
    result: '## خلاصه پروژه\n\n- **اسپرینت فعال:** ۸۵٪ پیشرفت\n- **تسک‌های باز:** ۱۲\n- **ریسک:** تاخیر در تست E2E',
    created_at: '2026-06-28T10:00:00Z',
    completed_at: '2026-06-28T10:00:05Z'
  }
]

let notes: Note[] = [
  {
    id: 'n1',
    title: 'ایده‌های UI',
    body: '- Dark mode consistency\n- Page header pattern\n- Currency RTL fix',
    color: '#fef08a',
    is_pinned: true,
    visibility: 'team',
    created_by: users[0]!,
    created_at: '2026-06-20T08:00:00Z',
    updated_at: '2026-06-27T12:00:00Z'
  },
  {
    id: 'n2',
    title: 'چک‌لیست deploy',
    body: '1. typecheck\n2. build\n3. migrate',
    color: '#bfdbfe',
    is_pinned: false,
    visibility: 'private',
    created_by: users[1]!,
    created_at: '2026-06-22T09:00:00Z',
    updated_at: '2026-06-22T09:00:00Z'
  },
  {
    id: 'n3',
    title: 'یادداشت پروژه',
    body: 'Kanban WIP limit = 5 برای ستون review',
    color: '#bbf7d0',
    is_pinned: false,
    visibility: 'project',
    project_id: 'p1',
    created_by: users[2]!,
    created_at: '2026-06-25T11:00:00Z',
    updated_at: '2026-06-25T11:00:00Z'
  }
]

const defaultEvents: NotificationPreference[] = [
  {
    event_type: 'task_assigned',
    event_label: 'تخصیص تسک',
    channels: { in_app: true, email: true, sms: false, push: true, telegram: false }
  },
  {
    event_type: 'leave_approved',
    event_label: 'تأیید مرخصی',
    channels: { in_app: true, email: true, sms: true, push: true, telegram: false }
  },
  {
    event_type: 'meeting_start',
    event_label: 'شروع جلسه',
    channels: { in_app: true, email: false, sms: true, push: true, telegram: true }
  },
  {
    event_type: 'expense_approved',
    event_label: 'تأیید هزینه',
    channels: { in_app: true, email: true, sms: false, push: true, telegram: false }
  },
  {
    event_type: 'chat_mention',
    event_label: 'منشن در چت',
    channels: { in_app: true, email: false, sms: false, push: true, telegram: true }
  }
]

const userPreferences = new Map<string, NotificationPreference[]>()

function getUserBrief(id: string): UserBrief {
  return users.find(u => u.id === id) ?? { id, name: 'کاربر', avatar_url: null }
}

function channelForUser(channel: ChatChannel, userId: string): ChatChannel | null {
  if (!channel.member_ids.includes(userId)) return null
  const unread = computeUnread(channel.id, userId)
  return { ...channel, unread_count: unread }
}

function computeUnread(channelId: string, userId: string): number {
  const lastRead = channelReads.get(channelId)?.get(userId)
  const channelMessages = messages.filter(m => m.channel_id === channelId)
  if (!lastRead) return channelMessages.filter(m => m.sender.id !== userId).length
  return channelMessages.filter(m => m.created_at > lastRead && m.sender.id !== userId).length
}

function enrichChannel(channel: ChatChannel, userId: string): ChatChannel {
  const last = messages
    .filter(m => m.channel_id === channel.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
  return {
    ...channel,
    last_message: last,
    last_message_at: last?.created_at,
    unread_count: computeUnread(channel.id, userId),
    members_count: channel.member_ids.length
  }
}

function dmDisplayName(channel: ChatChannel, userId: string): string | undefined {
  if (channel.type !== 'dm') return channel.name
  const other = channel.member_ids.find(id => id !== userId)
  return other ? getUserBrief(other).name : channel.name
}

function sortChannels(list: ChatChannel[]) {
  return [...list].sort((a, b) => {
    const ta = a.last_message_at ?? ''
    const tb = b.last_message_at ?? ''
    return tb.localeCompare(ta)
  })
}

function generateAiResult(type: string, prompt: string): string {
  if (type === 'task_analysis') {
    return '## تحلیل تسک‌ها\n\n| وضعیت | تعداد |\n|---|---|\n| انجام‌شده | ۱۸ |\n| در حال انجام | ۷ |\n| مسدود | ۲ |\n\n**پیشنهاد:** تمرکز روی تسک‌های مسدود.'
  }
  if (type === 'document_generator') {
    return '## پیش‌نویس سند\n\n**موضوع:** ' + prompt + '\n\nاین سند به‌صورت خودکار تولید شده است.'
  }
  if (type === 'resume_screener') {
    return '## نتیجه غربال رزومه\n\n- **امتیاز:** ۸۲/۱۰۰\n- **نقاط قوت:** Vue, TypeScript\n- **پیشنهاد:** دعوت به مصاحبه'
  }
  return '## پاسخ AI\n\n' + prompt + '\n\n*(پاسخ نمونه mock)*'
}

export function usePhase4Db() {
  return {
    listChannels(userId: string) {
      const list = channels
        .filter(c => c.member_ids.includes(userId))
        .map(c => enrichChannel(c, userId))
        .map(c => ({ ...c, name: dmDisplayName(c, userId) ?? c.name }))
      return sortChannels(list)
    },

    getChannel(channelId: string, userId: string) {
      const channel = channels.find(c => c.id === channelId)
      if (!channel || !channel.member_ids.includes(userId)) return null
      const enriched = enrichChannel(channel, userId)
      return { ...enriched, name: dmDisplayName(enriched, userId) ?? enriched.name }
    },

    createChannel(payload: CreateChatChannelPayload, userId: string) {
      const memberIds = [...new Set([userId, ...payload.member_ids])]
      if (payload.type === 'dm' && memberIds.length !== 2) {
        throw createError({ statusCode: 422, message: 'DM requires exactly one other member' })
      }
      if (payload.type === 'dm') {
        const existing = channels.find(
          c => c.type === 'dm'
            && c.member_ids.length === 2
            && memberIds.every(id => c.member_ids.includes(id))
        )
        if (existing) return enrichChannel(existing, userId)
      }
      const channel: ChatChannel = {
        id: randomUUID(),
        name: payload.name,
        type: payload.type,
        description: payload.description,
        is_readonly: payload.is_readonly ?? payload.type === 'channel',
        member_ids: memberIds,
        unread_count: 0,
        members_count: memberIds.length,
        is_muted: false
      }
      channels.push(channel)
      return enrichChannel(channel, userId)
    },

    listMessages(channelId: string, userId: string, opts: { before?: string, limit?: number }) {
      const channel = channels.find(c => c.id === channelId)
      if (!channel || !channel.member_ids.includes(userId)) {
        throw createError({ statusCode: 404, message: 'Channel not found' })
      }
      const limit = opts.limit ?? 50
      let list = messages
        .filter(m => m.channel_id === channelId)
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
      if (opts.before) {
        const idx = list.findIndex(m => m.id === opts.before)
        list = idx > 0 ? list.slice(0, idx) : []
      }
      return list.slice(-limit)
    },

    sendMessage(channelId: string, payload: SendChatMessagePayload, userId: string) {
      const channel = channels.find(c => c.id === channelId)
      if (!channel || !channel.member_ids.includes(userId)) {
        throw createError({ statusCode: 404, message: 'Channel not found' })
      }
      if (channel.is_readonly && userId !== 'u1') {
        throw createError({ statusCode: 403, message: 'Read-only channel' })
      }
      let reply_to: ChatMessage['reply_to']
      if (payload.reply_to_id) {
        const parent = messages.find(m => m.id === payload.reply_to_id)
        if (parent) {
          reply_to = { id: parent.id, body: parent.body?.slice(0, 80) ?? '', sender: parent.sender.name }
        }
      }
      const msg: ChatMessage = {
        id: randomUUID(),
        channel_id: channelId,
        sender: getUserBrief(userId),
        body: payload.body,
        type: payload.type ?? (payload.file_path ? 'file' : 'text'),
        file_path: payload.file_path,
        file_name: payload.file_name,
        reply_to,
        reactions: [],
        created_at: new Date().toISOString()
      }
      messages.push(msg)
      const idx = channels.findIndex(c => c.id === channelId)
      if (idx >= 0) {
        channels[idx] = enrichChannel(channels[idx]!, userId)
      }
      return msg
    },

    markRead(channelId: string, userId: string) {
      const channel = channels.find(c => c.id === channelId)
      if (!channel) return
      const last = messages.filter(m => m.channel_id === channelId).sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
      if (!last) return
      if (!channelReads.has(channelId)) channelReads.set(channelId, new Map())
      channelReads.get(channelId)!.set(userId, last.created_at)
    },

    addReaction(messageId: string, emoji: string, userId: string) {
      const msg = messages.find(m => m.id === messageId)
      if (!msg) throw createError({ statusCode: 404, message: 'Message not found' })
      const existing = msg.reactions.find(r => r.emoji === emoji)
      if (existing) {
        if (existing.reacted_by_me) {
          existing.count = Math.max(0, existing.count - 1)
          existing.reacted_by_me = false
        } else {
          existing.count += 1
          existing.reacted_by_me = true
        }
        msg.reactions = msg.reactions.filter(r => r.count > 0)
      } else {
        msg.reactions.push({ emoji, count: 1, reacted_by_me: true })
      }
      return msg
    },

    getUnreadTotal(userId: string) {
      return channels
        .filter(c => c.member_ids.includes(userId))
        .reduce((sum, c) => sum + computeUnread(c.id, userId), 0)
    },

    listMeetings(userId: string, filter?: 'today' | 'upcoming' | 'past') {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const todayEnd = new Date(todayStart.getTime() + 86400000)
      return meetings.filter((m) => {
        const isAttendee = m.attendees.some(a => a.user.id === userId) || m.organizer.id === userId
        if (!isAttendee) return false
        const start = new Date(m.start_at)
        if (filter === 'today') return start >= todayStart && start < todayEnd
        if (filter === 'upcoming') return start >= todayStart && m.status !== 'completed' && m.status !== 'cancelled'
        if (filter === 'past') return start < todayStart || m.status === 'completed'
        return true
      }).sort((a, b) => a.start_at.localeCompare(b.start_at))
    },

    getMeeting(id: string, userId: string) {
      const m = meetings.find(x => x.id === id)
      if (!m) return null
      const allowed = m.organizer.id === userId || m.attendees.some(a => a.user.id === userId)
      return allowed ? m : null
    },

    createMeeting(payload: CreateMeetingPayload, userId: string) {
      const meeting: Meeting = {
        id: randomUUID(),
        title: payload.title,
        organizer: getUserBrief(userId),
        start_at: payload.start_at,
        end_at: payload.end_at,
        provider: payload.provider,
        room_url: `https://meet.jit.si/midesk-${randomUUID().slice(0, 8)}`,
        status: 'scheduled',
        attendees: payload.attendee_ids.map(id => ({
          user: getUserBrief(id),
          status: id === userId ? 'accepted' : 'invited'
        }))
      }
      meetings.push(meeting)
      return meeting
    },

    startMeeting(id: string, userId: string) {
      const m = meetings.find(x => x.id === id)
      if (!m) throw createError({ statusCode: 404, message: 'Meeting not found' })
      if (m.organizer.id !== userId) throw createError({ statusCode: 403, message: 'Forbidden' })
      m.status = 'in_progress'
      return m
    },

    listAiRequests(userId: string) {
      return aiRequests.filter(r => true).sort((a, b) => b.created_at.localeCompare(a.created_at))
    },

    getAiRequest(id: string) {
      return aiRequests.find(r => r.id === id) ?? null
    },

    createAiQuery(payload: AiQueryPayload, userId: string) {
      const req: AiRequest = {
        id: randomUUID(),
        type: payload.type ?? 'general',
        prompt: payload.prompt,
        context_type: payload.context_type,
        context_id: payload.context_id,
        status: 'queued',
        created_at: new Date().toISOString()
      }
      aiRequests.unshift(req)
      return req
    },

    completeAiRequest(id: string) {
      const req = aiRequests.find(r => r.id === id)
      if (!req) return null
      req.status = 'processing'
      req.status = 'completed'
      req.result = generateAiResult(req.type, req.prompt)
      req.completed_at = new Date().toISOString()
      return req
    },

    listNotes(userId: string, visibility?: string) {
      return notes
        .filter((n) => {
          if (visibility && n.visibility !== visibility) return false
          if (n.visibility === 'private') return n.created_by.id === userId
          return true
        })
        .sort((a, b) => {
          if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
          return b.updated_at.localeCompare(a.updated_at)
        })
    },

    createNote(payload: CreateNotePayload, userId: string) {
      const note: Note = {
        id: randomUUID(),
        title: payload.title,
        body: payload.body,
        color: payload.color ?? '#e2e8f0',
        is_pinned: false,
        visibility: payload.visibility,
        project_id: payload.project_id,
        task_id: payload.task_id,
        created_by: getUserBrief(userId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      notes.unshift(note)
      return note
    },

    updateNote(id: string, payload: Partial<CreateNotePayload>, userId: string) {
      const note = notes.find(n => n.id === id)
      if (!note) throw createError({ statusCode: 404, message: 'Note not found' })
      if (note.created_by.id !== userId && userId !== 'u1') {
        throw createError({ statusCode: 403, message: 'Forbidden' })
      }
      Object.assign(note, payload, { updated_at: new Date().toISOString() })
      return note
    },

    deleteNote(id: string, userId: string) {
      const idx = notes.findIndex(n => n.id === id)
      if (idx < 0) throw createError({ statusCode: 404, message: 'Note not found' })
      if (notes[idx]!.created_by.id !== userId && userId !== 'u1') {
        throw createError({ statusCode: 403, message: 'Forbidden' })
      }
      notes.splice(idx, 1)
    },

    togglePin(id: string, userId: string) {
      const note = notes.find(n => n.id === id)
      if (!note) throw createError({ statusCode: 404, message: 'Note not found' })
      note.is_pinned = !note.is_pinned
      note.updated_at = new Date().toISOString()
      return note
    },

    getNotificationPreferences(userId: string) {
      if (!userPreferences.has(userId)) {
        userPreferences.set(userId, structuredClone(defaultEvents))
      }
      return userPreferences.get(userId)!
    },

    getNotificationEvents() {
      return defaultEvents.map(e => ({ event_type: e.event_type, event_label: e.event_label }))
    },

    updateNotificationPreference(
      userId: string,
      eventType: string,
      payload: UpdateNotificationPreferencePayload
    ) {
      const prefs = this.getNotificationPreferences(userId)
      const item = prefs.find(p => p.event_type === eventType)
      if (!item) throw createError({ statusCode: 404, message: 'Event not found' })
      item.channels = { ...item.channels, ...payload.channels }
      return item
    }
  }
}

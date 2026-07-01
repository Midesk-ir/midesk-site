import type { UserBrief } from './phase1'

export type ChatChannelType = 'dm' | 'group' | 'channel'
export type ChatMessageType = 'text' | 'file' | 'image' | 'system'
export type MeetingProvider = 'jitsi' | 'bbb' | 'google_meet'
export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type MeetingAttendeeStatus = 'invited' | 'accepted' | 'declined' | 'attended'
export type AiRequestStatus = 'queued' | 'processing' | 'completed' | 'failed'
export type NoteVisibility = 'private' | 'team' | 'project'
export type AiContextType = 'general' | 'project' | 'task' | 'candidate'

export interface ChatReaction {
  emoji: string
  count: number
  reacted_by_me: boolean
}

export interface ChatMessageReply {
  id: string
  body: string
  sender: string
}

export interface ChatMessage {
  id: string
  channel_id: string
  sender: UserBrief
  body?: string
  type: ChatMessageType
  file_path?: string
  file_name?: string
  reply_to?: ChatMessageReply
  reactions: ChatReaction[]
  created_at: string
  edited_at?: string
}

export interface ChatChannel {
  id: string
  name?: string
  type: ChatChannelType
  description?: string
  is_readonly?: boolean
  member_ids: string[]
  last_message?: ChatMessage
  last_message_at?: string
  unread_count: number
  members_count: number
  is_muted: boolean
}

export interface CreateChatChannelPayload {
  type: ChatChannelType
  name?: string
  description?: string
  member_ids: string[]
  is_readonly?: boolean
}

export interface SendChatMessagePayload {
  body?: string
  type?: ChatMessageType
  file_name?: string
  file_path?: string
  reply_to_id?: string
}

export interface MeetingAttendee {
  user: UserBrief
  status: MeetingAttendeeStatus
}

export interface Meeting {
  id: string
  title: string
  organizer: UserBrief
  start_at: string
  end_at: string
  provider: MeetingProvider
  room_url?: string
  status: MeetingStatus
  attendees: MeetingAttendee[]
}

export interface CreateMeetingPayload {
  title: string
  start_at: string
  end_at: string
  provider: MeetingProvider
  attendee_ids: string[]
}

export interface AiRequest {
  id: string
  type: string
  prompt: string
  context_type?: AiContextType
  context_id?: string
  status: AiRequestStatus
  result?: string
  created_at: string
  completed_at?: string
}

export interface AiQueryPayload {
  prompt: string
  type?: string
  context_type?: AiContextType
  context_id?: string
}

export interface Note {
  id: string
  title: string
  body: string
  color?: string
  is_pinned: boolean
  visibility: NoteVisibility
  project_id?: string
  task_id?: string
  created_by: UserBrief
  created_at: string
  updated_at: string
}

export interface CreateNotePayload {
  title: string
  body: string
  color?: string
  visibility: NoteVisibility
  project_id?: string
  task_id?: string
}

export interface NotificationChannelPrefs {
  in_app: boolean
  email: boolean
  sms: boolean
  push: boolean
  telegram: boolean
}

export interface NotificationPreference {
  event_type: string
  event_label: string
  channels: NotificationChannelPrefs
}

export interface UpdateNotificationPreferencePayload {
  channels: Partial<NotificationChannelPrefs>
}

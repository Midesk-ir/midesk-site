import type { User } from './index'

export type SprintStatus = 'planning' | 'active' | 'review' | 'closed'
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type SwimlaneMode = 'none' | 'assignee' | 'priority'
export type CalendarEventType = 'meeting' | 'deadline' | 'reminder' | 'other'

export interface UserBrief {
  id: string
  name: string
  avatar_url: string | null
}

export interface Sprint {
  id: string
  project_id: string
  name: string
  goal?: string
  status: SprintStatus
  start_date: string
  end_date: string
  total_points: number
  completed_points: number
  tasks_count: number
  done_count: number
}

export interface ProjectColumn {
  id: string
  project_id: string
  name: string
  slug: string
  color?: string
  order_index: number
  wip_limit: number | null
  is_done_column: boolean
  current_count: number
}

export interface BoardColumn {
  id: string
  slug: string
  name: string
  color?: string
  wip_limit: number | null
  current_count: number
  is_done_column: boolean
  tasks: import('./index').Task[]
}

export interface Worklog {
  id: string
  task_id?: string | null
  project_id: string
  project_name?: string
  task_title?: string | null
  description?: string | null
  duration_minutes: number
  logged_date: string
  user: UserBrief
}

export interface WorklogFilters {
  from?: string
  to?: string
  project_id?: string
}

export interface CreateWorklogPayload {
  project_id: string
  task_id?: string | null
  duration_minutes: number
  logged_date: string
  description?: string
}

export interface CalendarEvent {
  id: string
  title: string
  type: CalendarEventType
  start_date: string
  end_date: string
  all_day: boolean
  color?: string
}

export interface Holiday {
  id: string
  name: string
  date: string
}

export interface Shift {
  id: string
  name: string
  date: string
  start_time: string
  end_time: string
}

export interface LeaveType {
  id: string
  name: string
  default_balance_days: number
  unit: 'day' | 'hour'
  is_paid: boolean
}

export interface LeaveBalance {
  leave_type: LeaveType
  total: number
  used: number
  remaining: number
}

export interface LeaveApprovalStep {
  role: string
  status: 'pending' | 'approved' | 'rejected' | 'skipped'
}

export interface LeaveRequest {
  id: string
  user: UserBrief
  leave_type: LeaveType
  start_date: string
  end_date: string
  duration_days: number
  status: LeaveRequestStatus
  note?: string
  reject_reason?: string
  approval_chain?: LeaveApprovalStep[]
}

export interface CreateLeaveRequestPayload {
  leave_type_id: string
  start_date: string
  end_date: string
  note?: string
}

export interface BurndownData {
  sprint: Sprint
  daily: Array<{ date: string, remaining_points: number, completed_points: number }>
  ideal_line: Array<{ date: string, remaining_points: number }>
}

export interface VelocitySprint {
  sprint_id: string
  sprint_name: string
  committed_points: number
  completed_points: number
}

export interface VelocityReport {
  sprints: VelocitySprint[]
  average_completed: number
}

export interface CfdDataPoint {
  date: string
  columns: Record<string, number>
}

export interface CfdReport {
  column_names: Record<string, string>
  daily: CfdDataPoint[]
}

export interface Phase1DashboardExtras {
  active_sprint: (Sprint & { project_name: string, days_remaining: number }) | null
  week_worklog_minutes: number
  pending_leave_count: number
}

export interface CreateSprintPayload {
  name: string
  goal?: string
  start_date: string
  end_date: string
}

export interface CloseSprintPayload {
  move_to: 'backlog' | string
}

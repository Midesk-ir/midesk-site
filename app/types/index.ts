export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER'

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface User {
  id: string
  name: string
  email: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
}

export interface Tenant {
  id: string
  name: string
  region: 'IR' | 'INTL'
  locale: string
  timezone: string
  default_currency: string
  calendar_type: 'jalali' | 'gregorian'
}

export interface BootstrapData {
  user: User
  tenant: Tenant | null
  permissions: string[]
}

export interface AuthResponse {
  token: string
  user: User
  tenant: Tenant | null
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface ChecklistItem {
  id: string
  title: string
  is_done: boolean
  order_index: number
}

export interface Comment {
  id: string
  body: string
  user: Pick<User, 'id' | 'name' | 'avatar_url'>
  created_at: string
  mentions?: string[]
}

export interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assignee: Pick<User, 'id' | 'name' | 'avatar_url'> | null
  labels: Label[]
  due_date: string | null
  order_index: number
  checklist: ChecklistItem[]
  comments_count: number
  story_points: number | null
  sprint_id: string | null
  created_at: string
  updated_at: string
}

export interface KanbanColumn {
  id: string
  slug: string
  name: string
  title?: string
  color?: string
  wip_limit: number | null
  current_count: number
  is_done_column: boolean
  tasks: Task[]
}

export interface Project {
  id: string
  name: string
  description: string | null
  status: 'active' | 'archived'
  members_count: number
  tasks_count: number
  progress: number
  created_at: string
}

export interface ProjectMember {
  id: string
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar_url'>
  role: UserRole
  joined_at: string
}

export interface Team {
  id: string
  name: string
  description: string | null
  members_count: number
}

export interface Notification {
  id: string
  type: string
  title: string
  body: string
  read_at: string | null
  action_url: string | null
  created_at: string
}

export interface DashboardSummary {
  my_tasks: Task[]
  overdue_tasks: Task[]
  active_projects: Project[]
  recent_activity: Array<{
    id: string
    type: string
    message: string
    created_at: string
  }>
  active_sprint?: import('./phase1').Sprint & { project_name: string, days_remaining: number } | null
  week_worklog_minutes?: number
  pending_leave_count?: number
  finance_widget?: {
    pending_expenses_count?: number
    pending_expenses_amount?: number
    overdue_invoices_count?: number
    currency?: string
    latest_payslip?: import('./phase3').MyPayslipBrief | null
    my_pending_expenses_count?: number
  }
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export interface MoveTaskPayload {
  status: TaskStatus
  order_index: number
}

export interface CreateOrgPayload {
  name: string
  region: 'IR' | 'INTL'
  locale: string
  calendar_type: 'jalali' | 'gregorian'
  default_currency: string
  timezone: string
}

export interface InviteMemberPayload {
  email?: string
  phone?: string
  role: UserRole
}

export const KANBAN_COLUMNS: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done']

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'neutral',
  medium: 'blue',
  high: 'amber',
  critical: 'red'
}

export * from './phase1'
export * from './phase2'
export * from './phase3'
export * from './phase4'

import { randomUUID } from 'node:crypto'
import type {
  Comment,
  KanbanColumn,
  Label,
  Notification,
  Project,
  ProjectMember,
  Task,
  TaskStatus,
  Team,
  Tenant,
  User,
  UserRole
} from '../../app/types'
import { initPhase1Tasks, usePhase1Db } from './phase1-db'
import { usePhase2Db } from './phase2-db'
import { usePhase3Db } from './phase3-db'
import { usePhase4Db } from './phase4-db'
import { usePhase5Db } from './phase5-db'

interface Session {
  token: string
  userId: string
  tenantId: string | null
}

import type { H3Event } from 'h3'

declare global {
  // eslint-disable-next-line no-var
  var __midesk_sessions: Map<string, Session> | undefined
  // eslint-disable-next-line no-var
  var __midesk_otpCodes: Map<string, { code: string, expires: number }> | undefined
}

const sessions = globalThis.__midesk_sessions ??= new Map<string, Session>()
const otpCodes = globalThis.__midesk_otpCodes ??= new Map<string, { code: string, expires: number }>()

let users: User[] = [
  {
    id: 'u1',
    name: 'علی محمدآبادی',
    email: 'demo@midesk.io',
    phone: '09121234567',
    avatar_url: null,
    role: 'OWNER'
  },
  {
    id: 'u2',
    name: 'Sara Johnson',
    email: 'sara@midesk.io',
    phone: null,
    avatar_url: null,
    role: 'MEMBER'
  },
  {
    id: 'u3',
    name: 'محمد کریمی',
    email: 'mohammad@midesk.io',
    phone: '09129876543',
    avatar_url: null,
    role: 'MANAGER'
  }
]

let tenants: Tenant[] = [
  {
    id: 't1',
    name: 'شرکت نمونه',
    region: 'IR',
    locale: 'fa-IR',
    timezone: 'Asia/Tehran',
    default_currency: 'IRR',
    calendar_type: 'jalali'
  }
]

const labels: Label[] = [
  { id: 'l1', name: 'فرانت', color: '#ff5c00' },
  { id: 'l2', name: 'بک‌اند', color: '#22c55e' },
  { id: 'l3', name: 'باگ', color: '#ef4444' },
  { id: 'l4', name: 'UI', color: '#f59e0b' }
]

let projects: Project[] = [
  {
    id: 'p1',
    name: 'وب‌سایت Midesk',
    description: 'بازطراحی و توسعه پلتفرم',
    status: 'active',
    members_count: 3,
    tasks_count: 6,
    progress: 35,
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'p2',
    name: 'اپ موبایل',
    description: 'نسخه PWA پیشرفته',
    status: 'active',
    members_count: 2,
    tasks_count: 2,
    progress: 10,
    created_at: '2026-02-01T08:00:00Z'
  }
]

let tasks: Task[] = [
  {
    id: 'task1',
    project_id: 'p1',
    title: 'طراحی صفحه فرود',
    description: 'طراحی و پیاده‌سازی landing page',
    status: 'done',
    priority: 'high',
    assignee: { id: 'u1', name: 'علی محمدآبادی', avatar_url: null },
    labels: [labels[3]!],
    due_date: '2026-03-01T00:00:00Z',
    order_index: 1000,
    checklist: [
      { id: 'c1', title: 'Hero section', is_done: true, order_index: 1 },
      { id: 'c2', title: 'Features', is_done: true, order_index: 2 }
    ],
    comments_count: 2,
    story_points: null,
    sprint_id: null,
    created_at: '2026-02-10T08:00:00Z',
    updated_at: '2026-03-05T10:00:00Z'
  },
  {
    id: 'task2',
    project_id: 'p1',
    title: 'پیاده‌سازی کانبان',
    description: 'Drag & Drop با optimistic UI',
    status: 'in_progress',
    priority: 'critical',
    assignee: { id: 'u1', name: 'علی محمدآبادی', avatar_url: null },
    labels: [labels[0]!],
    due_date: '2026-06-15T00:00:00Z',
    order_index: 2000,
    checklist: [
      { id: 'c3', title: 'Board component', is_done: true, order_index: 1 },
      { id: 'c4', title: 'Move API', is_done: false, order_index: 2 },
      { id: 'c5', title: 'Filters', is_done: false, order_index: 3 }
    ],
    comments_count: 5,
    story_points: null,
    sprint_id: null,
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-06-20T14:00:00Z'
  },
  {
    id: 'task3',
    project_id: 'p1',
    title: 'اتصال API احراز هویت',
    description: null,
    status: 'todo',
    priority: 'medium',
    assignee: { id: 'u3', name: 'محمد کریمی', avatar_url: null },
    labels: [labels[1]!],
    due_date: '2026-06-25T00:00:00Z',
    order_index: 1500,
    checklist: [],
    comments_count: 0,
    story_points: null,
    sprint_id: null,
    created_at: '2026-03-10T08:00:00Z',
    updated_at: '2026-03-10T08:00:00Z'
  },
  {
    id: 'task4',
    project_id: 'p1',
    title: 'رفع باگ RTL در sidebar',
    description: null,
    status: 'review',
    priority: 'low',
    assignee: { id: 'u2', name: 'Sara Johnson', avatar_url: null },
    labels: [labels[2]!, labels[0]!],
    due_date: '2026-05-01T00:00:00Z',
    order_index: 1200,
    checklist: [{ id: 'c6', title: 'Test RTL', is_done: true, order_index: 1 }],
    comments_count: 1,
    story_points: null,
    sprint_id: null,
    created_at: '2026-04-01T08:00:00Z',
    updated_at: '2026-05-20T08:00:00Z'
  },
  {
    id: 'task5',
    project_id: 'p1',
    title: 'مستندسازی API',
    description: null,
    status: 'backlog',
    priority: 'low',
    assignee: null,
    labels: [],
    due_date: null,
    order_index: 500,
    checklist: [],
    comments_count: 0,
    story_points: null,
    sprint_id: null,
    created_at: '2026-04-15T08:00:00Z',
    updated_at: '2026-04-15T08:00:00Z'
  },
  {
    id: 'task6',
    project_id: 'p1',
    title: 'تست E2E فاز صفر',
    description: null,
    status: 'backlog',
    priority: 'medium',
    assignee: { id: 'u1', name: 'علی محمدآبادی', avatar_url: null },
    labels: [labels[1]!],
    due_date: '2026-04-01T00:00:00Z',
    order_index: 800,
    checklist: [],
    comments_count: 0,
    story_points: null,
    sprint_id: null,
    created_at: '2026-03-20T08:00:00Z',
    updated_at: '2026-03-20T08:00:00Z'
  },
  {
    id: 'task7',
    project_id: 'p2',
    title: 'طراحی splash screen',
    description: null,
    status: 'todo',
    priority: 'medium',
    assignee: { id: 'u2', name: 'Sara Johnson', avatar_url: null },
    labels: [labels[3]!],
    due_date: null,
    order_index: 1000,
    checklist: [],
    comments_count: 0,
    story_points: null,
    sprint_id: null,
    created_at: '2026-05-01T08:00:00Z',
    updated_at: '2026-05-01T08:00:00Z'
  }
]

initPhase1Tasks(tasks)

const comments = new Map<string, Comment[]>([
  ['task1', [
    {
      id: 'cm1',
      body: 'طراحی تایید شد @علی',
      user: { id: 'u3', name: 'محمد کریمی', avatar_url: null },
      created_at: '2026-03-01T10:00:00Z',
      mentions: ['u1']
    }
  ]],
  ['task2', [
    {
      id: 'cm2',
      body: 'Optimistic UI پیاده شد',
      user: { id: 'u1', name: 'علی محمدآبادی', avatar_url: null },
      created_at: '2026-06-18T10:00:00Z'
    }
  ]]
])

let notifications: Notification[] = [
  {
    id: 'n1',
    type: 'task_assigned',
    title: 'تسک جدید',
    body: 'تسک «پیاده‌سازی کانبان» به شما اختصاص یافت',
    read_at: null,
    action_url: '/projects/p1',
    created_at: '2026-06-19T08:00:00Z'
  },
  {
    id: 'n2',
    type: 'comment',
    title: 'نظر جدید',
    body: 'محمد کریمی روی تسک شما نظر گذاشت',
    read_at: '2026-06-18T12:00:00Z',
    action_url: '/projects/p1',
    created_at: '2026-06-18T11:00:00Z'
  }
]

const teams: Team[] = [
  { id: 'team1', name: 'توسعه فرانت', description: 'تیم UI/UX', members_count: 2 },
  { id: 'team2', name: 'توسعه بک‌اند', description: 'تیم API', members_count: 2 }
]

const projectMembers: ProjectMember[] = [
  { id: 'pm1', user: { id: 'u1', name: 'علی محمدآبادی', email: 'demo@midesk.io', avatar_url: null }, role: 'OWNER', joined_at: '2026-01-15T08:00:00Z' },
  { id: 'pm2', user: { id: 'u2', name: 'Sara Johnson', email: 'sara@midesk.io', avatar_url: null }, role: 'MEMBER', joined_at: '2026-01-20T08:00:00Z' },
  { id: 'pm3', user: { id: 'u3', name: 'محمد کریمی', email: 'mohammad@midesk.io', avatar_url: null }, role: 'MANAGER', joined_at: '2026-02-01T08:00:00Z' }
]

function getAuth(event: H3Event) {
  const auth = getHeader(event, 'authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  return sessions.get(token) ?? null
}

function requireAuth(event: H3Event) {
  const session = getAuth(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const user = users.find(u => u.id === session.userId)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })
  return { session, user }
}

function getTenantId(event: H3Event, session: Session) {
  return getHeader(event, 'x-tenant-id') || session.tenantId
}

export function useMockDb() {
  const phase1 = usePhase1Db()
  const phase2 = usePhase2Db()
  const phase3 = usePhase3Db()
  const phase4 = usePhase4Db()
  const phase5 = usePhase5Db()
  return {
    sessions,
    otpCodes,
    users,
    tenants,
    labels,
    projects,
    tasks,
    comments,
    notifications,
    teams,
    projectMembers,
    phase1,
    phase2,
    phase3,
    phase4,
    phase5,
    getAuth,
    requireAuth,
    getTenantId,
    createToken(userId: string, tenantId: string | null) {
      const token = randomUUID()
      sessions.set(token, { token, userId, tenantId })
      return token
    },
    getUser(id: string) {
      return users.find(u => u.id === id)
    },
    getTenant(id: string | null | undefined) {
      if (!id) return null
      return tenants.find(t => t.id === id) ?? null
    },
    getProjectTasks(projectId: string) {
      return tasks
        .filter(t => t.project_id === projectId)
        .sort((a, b) => a.order_index - b.order_index)
    },
    getBoard(projectId: string) {
      const board = phase1.getBoardWithColumns(projectId, tasks, 'none')
      return board.lanes[0]?.columns ?? []
    },
    checklistProgress(task: Task) {
      if (!task.checklist.length) return 0
      const done = task.checklist.filter(c => c.is_done).length
      return Math.round((done / task.checklist.length) * 100)
    }
  }
}

export type MockDb = ReturnType<typeof useMockDb>

import { randomUUID } from 'node:crypto'
import type { UserBrief } from '../../app/types/phase1'
import type {
  AttendanceRecord,
  AttendanceReportRow,
  AttendanceTodaySummary,
  Candidate,
  CandidateStatus,
  ClockStatus,
  Contract,
  CreateContractPayload,
  CreateLeavePolicyPayload,
  CreateMissionPayload,
  CreatePersonnelPayload,
  CreateRequisitionPayload,
  HrDashboardSummary,
  HrDocument,
  HrSettings,
  Interview,
  LeavePolicy,
  LeaveReportItem,
  Mission,
  OnboardingProgress,
  OnboardingTemplate,
  Personnel,
  PersonnelDetail,
  PersonnelFilters,
  Requisition
} from '../../app/types/phase2'

const users: UserBrief[] = [
  { id: 'u1', name: 'علی محمدآبادی', avatar_url: null },
  { id: 'u2', name: 'Sara Johnson', avatar_url: null },
  { id: 'u3', name: 'محمد کریمی', avatar_url: null },
  { id: 'u4', name: 'فاطمه احمدی', avatar_url: null }
]

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function nowIso() {
  return new Date().toISOString()
}

let personnel: Personnel[] = [
  {
    id: 'per1',
    user: users[0]!,
    employee_code: 'EMP-001',
    hire_date: '2024-03-15',
    employment_type: 'full_time',
    status: 'active',
    job_title: 'Tech Lead',
    department: 'فناوری',
    national_id: '0012345678',
    birth_date: '1990-05-20',
    address: 'تهران، ونک',
    emergency_contact: '09121111111',
    phone: '09121234567',
    email: 'demo@midesk.io'
  },
  {
    id: 'per2',
    user: users[1]!,
    employee_code: 'EMP-002',
    hire_date: '2024-06-01',
    employment_type: 'full_time',
    status: 'active',
    job_title: 'Frontend Developer',
    department: 'فناوری',
    email: 'sara@midesk.io'
  },
  {
    id: 'per3',
    user: users[2]!,
    employee_code: 'EMP-003',
    hire_date: '2023-11-10',
    employment_type: 'full_time',
    status: 'active',
    job_title: 'Project Manager',
    department: 'مدیریت',
    email: 'mohammad@midesk.io'
  },
  {
    id: 'per4',
    user: users[3]!,
    employee_code: 'EMP-004',
    hire_date: '2025-01-20',
    employment_type: 'contract',
    status: 'on_leave',
    job_title: 'HR Specialist',
    department: 'منابع انسانی',
    email: 'fatemeh@midesk.io'
  }
]

let contracts: Contract[] = [
  {
    id: 'con1',
    personnel_id: 'per1',
    user: users[0]!,
    type: 'permanent',
    start_date: '2024-03-15',
    base_salary: 85000000,
    currency: 'IRR',
    status: 'active'
  },
  {
    id: 'con2',
    personnel_id: 'per2',
    user: users[1]!,
    type: 'fixed_term',
    start_date: '2024-06-01',
    end_date: '2026-06-30',
    base_salary: 65000000,
    currency: 'IRR',
    status: 'active'
  },
  {
    id: 'con3',
    personnel_id: 'per4',
    user: users[3]!,
    type: 'fixed_term',
    start_date: '2025-01-20',
    end_date: '2026-07-15',
    base_salary: 45000000,
    currency: 'IRR',
    status: 'active'
  }
]

let documents: HrDocument[] = [
  {
    id: 'doc1',
    personnel_id: 'per1',
    user: users[0]!,
    category: 'id',
    filename: 'national-id.pdf',
    size_bytes: 245000,
    mime_type: 'application/pdf',
    uploaded_at: '2024-03-10T10:00:00Z'
  },
  {
    id: 'doc2',
    personnel_id: 'per1',
    user: users[0]!,
    category: 'contract',
    filename: 'employment-contract.pdf',
    size_bytes: 512000,
    mime_type: 'application/pdf',
    uploaded_at: '2024-03-15T09:00:00Z'
  }
]

let attendance: AttendanceRecord[] = [
  {
    id: 'att1',
    user_id: 'u1',
    user: users[0],
    date: todayStr(),
    check_in_at: `${todayStr()}T06:30:00.000Z`,
    status: 'present',
    effective_minutes: 180,
    overtime_minutes: 0
  },
  {
    id: 'att2',
    user_id: 'u2',
    user: users[1],
    date: todayStr(),
    check_in_at: `${todayStr()}T07:15:00.000Z`,
    status: 'late',
    effective_minutes: 150,
    overtime_minutes: 0
  },
  {
    id: 'att3',
    user_id: 'u3',
    user: users[2],
    date: todayStr(),
    status: 'on_leave',
    effective_minutes: 0,
    overtime_minutes: 0
  }
]

let missions: Mission[] = [
  {
    id: 'mis1',
    user: users[0]!,
    destination: 'اصفهان',
    start_date: '2026-07-01',
    end_date: '2026-07-03',
    transport: 'قطار',
    description: 'جلسه با مشتری',
    status: 'approved',
    created_at: '2026-06-25T08:00:00Z'
  },
  {
    id: 'mis2',
    user: users[2]!,
    destination: 'شیراز',
    start_date: '2026-07-10',
    end_date: '2026-07-12',
    transport: 'هواپیما',
    status: 'pending',
    created_at: '2026-06-28T10:00:00Z'
  }
]

let requisitions: Requisition[] = [
  {
    id: 'req1',
    title: 'توسعه‌دهنده Vue.js',
    department: 'فناوری',
    positions_count: 2,
    priority: 'high',
    status: 'open',
    candidates_count: 3,
    created_at: '2026-06-01T08:00:00Z'
  },
  {
    id: 'req2',
    title: 'کارشناس HR',
    department: 'منابع انسانی',
    positions_count: 1,
    priority: 'medium',
    status: 'open',
    candidates_count: 2,
    created_at: '2026-06-10T08:00:00Z'
  }
]

let candidates: Candidate[] = [
  {
    id: 'cand1',
    requisition_id: 'req1',
    full_name: 'رضا محمدی',
    email: 'reza@example.com',
    status: 'interview',
    source: 'LinkedIn',
    resume_filename: 'reza-cv.pdf',
    average_score: 4,
    interviews: [],
    created_at: '2026-06-05T08:00:00Z'
  },
  {
    id: 'cand2',
    requisition_id: 'req1',
    full_name: 'مریم حسینی',
    email: 'maryam@example.com',
    status: 'screening',
    source: 'Referral',
    resume_filename: 'maryam-cv.pdf',
    interviews: [],
    created_at: '2026-06-08T08:00:00Z'
  },
  {
    id: 'cand3',
    requisition_id: 'req1',
    full_name: 'امیر نوری',
    email: 'amir@example.com',
    status: 'new',
    source: 'Website',
    interviews: [],
    created_at: '2026-06-28T08:00:00Z'
  },
  {
    id: 'cand4',
    requisition_id: 'req2',
    full_name: 'زهرا اکبری',
    email: 'zahra@example.com',
    status: 'offer',
    source: 'JobBoard',
    average_score: 5,
    interviews: [],
    created_at: '2026-06-12T08:00:00Z'
  }
]

let interviews: Interview[] = [
  {
    id: 'int1',
    candidate_id: 'cand1',
    interviewer: users[0]!,
    scheduled_at: '2026-06-20T10:00:00Z',
    type: 'technical',
    score: 4,
    feedback: 'مهارت Vue خوب، تجربه Nuxt متوسط',
    status: 'completed'
  },
  {
    id: 'int2',
    candidate_id: 'cand1',
    interviewer: users[2]!,
    scheduled_at: '2026-06-25T14:00:00Z',
    type: 'in_person',
    status: 'scheduled'
  }
]

candidates = candidates.map(c => ({
  ...c,
  interviews: interviews.filter(i => i.candidate_id === c.id)
}))

let onboardingTemplates: OnboardingTemplate[] = [
  {
    id: 'tpl1',
    name: 'آنبوردینگ استاندارد',
    steps: [
      { id: 'st1', title: 'تجهیزات IT', description: 'تحویل لپ‌تاپ و حساب‌ها', assignee_role: 'IT', deadline_days: 1, order_index: 0 },
      { id: 'st2', title: 'آشنایی با تیم', description: 'جلسه معارفه', assignee_role: 'MANAGER', deadline_days: 3, order_index: 1 },
      { id: 'st3', title: 'آموزش سیستم‌ها', description: 'آموزش Midesk و ابزارها', assignee_role: 'HR', deadline_days: 7, order_index: 2 },
      { id: 'st4', title: 'تکمیل مدارک', description: 'بارگذاری اسناد', assignee_role: 'HR', deadline_days: 5, order_index: 3 }
    ]
  }
]

let onboardingProgress: OnboardingProgress[] = [
  {
    id: 'onb1',
    user: users[1]!,
    template_name: 'آنبوردینگ استاندارد',
    template_id: 'tpl1',
    current_step: 2,
    total_steps: 4,
    completed_steps: ['st1', 'st2'],
    status: 'in_progress',
    started_at: '2024-06-05T08:00:00Z'
  }
]

let leavePolicies: LeavePolicy[] = [
  {
    id: 'lp1',
    leave_type: { id: 'lt1', name: 'استحقاقی', default_balance_days: 26, unit: 'day', is_paid: true },
    auto_approve: false,
    approval_chain: ['manager', 'hr'],
    min_notice_days: 3,
    allow_negative_balance: false
  },
  {
    id: 'lp2',
    leave_type: { id: 'lt2', name: 'استعلاجی', default_balance_days: 14, unit: 'day', is_paid: true },
    auto_approve: false,
    approval_chain: ['manager', 'hr'],
    min_notice_days: 0,
    allow_negative_balance: false
  }
]

let hrSettings: HrSettings = {
  work_start_time: '08:00',
  work_end_time: '17:00',
  late_threshold_minutes: 15,
  overtime_enabled: true,
  contract_expiry_alert_days: 30
}

function getClockStatus(record: AttendanceRecord | undefined): ClockStatus {
  if (!record?.check_in_at) return 'not_started'
  if (record.check_out_at) return 'checked_out'
  if (record.break_start_at && !record.break_end_at) return 'on_break'
  return 'checked_in'
}

export function usePhase2Db() {
  function listPersonnel(filters: PersonnelFilters = {}) {
    let list = [...personnel]
    if (filters.status) list = list.filter(p => p.status === filters.status)
    if (filters.department) list = list.filter(p => p.department === filters.department)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(p =>
        p.user.name.toLowerCase().includes(q)
        || p.employee_code.toLowerCase().includes(q)
        || p.job_title?.toLowerCase().includes(q)
      )
    }
    return list
  }

  function getPersonnel(id: string): PersonnelDetail | null {
    const p = personnel.find(x => x.id === id)
    if (!p) return null
    return {
      ...p,
      contracts: contracts.filter(c => c.personnel_id === id),
      documents: documents.filter(d => d.personnel_id === id),
      recent_attendance: attendance
        .filter(a => a.user_id === p.user.id)
        .slice(0, 30),
      leave_balances: [
        { leave_type: { id: 'lt1', name: 'استحقاقی', default_balance_days: 26, unit: 'day', is_paid: true }, remaining: 18 },
        { leave_type: { id: 'lt2', name: 'استعلاجی', default_balance_days: 14, unit: 'day', is_paid: true }, remaining: 10 }
      ]
    }
  }

  function createPersonnel(payload: CreatePersonnelPayload) {
    const user = users.find(u => u.id === payload.user_id)
    if (!user) throw createError({ statusCode: 422, message: 'User not found' })
    const item: Personnel = {
      id: randomUUID(),
      user,
      employee_code: payload.employee_code,
      hire_date: payload.hire_date,
      employment_type: payload.employment_type,
      status: 'active',
      job_title: payload.job_title,
      department: payload.department,
      national_id: payload.national_id,
      birth_date: payload.birth_date,
      address: payload.address,
      emergency_contact: payload.emergency_contact
    }
    personnel.push(item)
    return item
  }

  function updatePersonnel(id: string, payload: Partial<CreatePersonnelPayload> & { status?: Personnel['status'] }) {
    const idx = personnel.findIndex(p => p.id === id)
    if (idx < 0) throw createError({ statusCode: 404, message: 'Not found' })
    personnel[idx] = { ...personnel[idx]!, ...payload }
    return personnel[idx]!
  }

  function deletePersonnel(id: string) {
    personnel = personnel.filter(p => p.id !== id)
  }

  function getTodayAttendance(): AttendanceTodaySummary {
    const today = todayStr()
    const records = attendance.filter(a => a.date === today)
    return {
      present: records.filter(r => r.status === 'present' || r.status === 'late').length,
      absent: records.filter(r => r.status === 'absent').length,
      on_leave: records.filter(r => r.status === 'on_leave').length,
      on_mission: records.filter(r => r.status === 'mission').length,
      records
    }
  }

  function getUserTodayRecord(userId: string) {
    return attendance.find(a => a.user_id === userId && a.date === todayStr())
  }

  function clockAction(userId: string, action: 'check_in' | 'check_out' | 'break_start' | 'break_end') {
    const user = users.find(u => u.id === userId)
    if (!user) throw createError({ statusCode: 404, message: 'User not found' })
    let record = getUserTodayRecord(userId)
    const now = nowIso()

    if (!record && action === 'check_in') {
      record = {
        id: randomUUID(),
        user_id: userId,
        user,
        date: todayStr(),
        check_in_at: now,
        status: 'present',
        effective_minutes: 0,
        overtime_minutes: 0
      }
      attendance.push(record)
      return { record, clock_status: 'checked_in' as ClockStatus }
    }

    if (!record) throw createError({ statusCode: 422, message: 'No attendance record for today' })

    switch (action) {
      case 'check_in':
        record.check_in_at = now
        record.status = 'present'
        break
      case 'check_out':
        record.check_out_at = now
        break
      case 'break_start':
        record.break_start_at = now
        break
      case 'break_end':
        record.break_end_at = now
        break
    }

    return { record, clock_status: getClockStatus(record) }
  }

  function getMyAttendance(userId: string, from?: string, to?: string) {
    return attendance
      .filter(a => a.user_id === userId)
      .filter(a => (!from || a.date >= from) && (!to || a.date <= to))
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  function getAttendanceReport(month: string): AttendanceReportRow[] {
    return personnel.filter(p => p.status === 'active').map(p => {
      const userRecords = attendance.filter(a => a.user_id === p.user.id && a.date.startsWith(month))
      const days: Record<string, AttendanceRecord['status']> = {}
      for (const r of userRecords) days[r.date.slice(8)] = r.status
      return {
        user: p.user,
        days,
        summary: {
          present: userRecords.filter(r => r.status === 'present').length,
          late: userRecords.filter(r => r.status === 'late').length,
          absent: userRecords.filter(r => r.status === 'absent').length,
          overtime_minutes: userRecords.reduce((s, r) => s + r.overtime_minutes, 0)
        }
      }
    })
  }

  function listContracts() {
    return contracts
  }

  function getExpiringContracts(days = 30) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() + days)
    const cutoffStr = cutoff.toISOString().slice(0, 10)
    return contracts.filter(c =>
      c.status === 'active'
      && c.end_date
      && c.end_date <= cutoffStr
    )
  }

  function createContract(payload: CreateContractPayload) {
    const p = personnel.find(x => x.id === payload.personnel_id)
    if (!p) throw createError({ statusCode: 422, message: 'Personnel not found' })
    const item: Contract = {
      id: randomUUID(),
      personnel_id: payload.personnel_id,
      user: p.user,
      type: payload.type,
      start_date: payload.start_date,
      end_date: payload.end_date,
      base_salary: payload.base_salary,
      currency: payload.currency ?? 'IRR',
      status: 'active'
    }
    contracts.push(item)
    return item
  }

  function renewContract(id: string, payload: { end_date: string, base_salary?: number }) {
    const idx = contracts.findIndex(c => c.id === id)
    if (idx < 0) throw createError({ statusCode: 404, message: 'Not found' })
    const old = contracts[idx]!
    old.status = 'renewed'
    return createContract({
      personnel_id: old.personnel_id,
      type: old.type,
      start_date: todayStr(),
      end_date: payload.end_date,
      base_salary: payload.base_salary ?? old.base_salary,
      currency: old.currency
    })
  }

  function listDocuments(filters: { personnel_id?: string, category?: string } = {}) {
    let list = [...documents]
    if (filters.personnel_id) list = list.filter(d => d.personnel_id === filters.personnel_id)
    if (filters.category) list = list.filter(d => d.category === filters.category)
    return list
  }

  function uploadDocument(payload: {
    personnel_id: string
    category: HrDocument['category']
    filename: string
    size_bytes: number
    mime_type: string
  }) {
    const p = personnel.find(x => x.id === payload.personnel_id)
    if (!p) throw createError({ statusCode: 422, message: 'Personnel not found' })
    const item: HrDocument = {
      id: randomUUID(),
      personnel_id: payload.personnel_id,
      user: p.user,
      category: payload.category,
      filename: payload.filename,
      size_bytes: payload.size_bytes,
      mime_type: payload.mime_type,
      uploaded_at: nowIso()
    }
    documents.push(item)
    return item
  }

  function getDocument(id: string) {
    return documents.find(d => d.id === id) ?? null
  }

  function listMissions() {
    return missions
  }

  function listMyMissions(userId: string) {
    return missions.filter(m => m.user.id === userId)
  }

  function createMission(userId: string, userName: string, payload: CreateMissionPayload) {
    const item: Mission = {
      id: randomUUID(),
      user: { id: userId, name: userName, avatar_url: null },
      ...payload,
      status: 'pending',
      created_at: nowIso()
    }
    missions.unshift(item)
    return item
  }

  function approveMission(id: string) {
    const m = missions.find(x => x.id === id)
    if (!m) throw createError({ statusCode: 404, message: 'Not found' })
    m.status = 'approved'
    return m
  }

  function rejectMission(id: string) {
    const m = missions.find(x => x.id === id)
    if (!m) throw createError({ statusCode: 404, message: 'Not found' })
    m.status = 'rejected'
    return m
  }

  function listRequisitions() {
    return requisitions
  }

  function createRequisition(payload: CreateRequisitionPayload) {
    const item: Requisition = {
      id: randomUUID(),
      ...payload,
      status: 'open',
      candidates_count: 0,
      created_at: nowIso()
    }
    requisitions.unshift(item)
    return item
  }

  function getRequisition(id: string) {
    return requisitions.find(r => r.id === id) ?? null
  }

  function listCandidates(requisitionId?: string) {
    if (requisitionId) return candidates.filter(c => c.requisition_id === requisitionId)
    return candidates
  }

  function moveCandidateStatus(id: string, status: CandidateStatus) {
    const c = candidates.find(x => x.id === id)
    if (!c) throw createError({ statusCode: 404, message: 'Not found' })
    c.status = status
    return c
  }

  function hireCandidate(id: string) {
    const c = candidates.find(x => x.id === id)
    if (!c) throw createError({ statusCode: 404, message: 'Not found' })
    c.status = 'hired'
    const newPersonnel = createPersonnel({
      user_id: randomUUID(),
      employee_code: `EMP-${String(personnel.length + 1).padStart(3, '0')}`,
      hire_date: todayStr(),
      employment_type: 'full_time',
      job_title: requisitions.find(r => r.id === c.requisition_id)?.title
    })
    newPersonnel.user = { id: newPersonnel.user.id, name: c.full_name, avatar_url: null }
    onboardingProgress.unshift({
      id: randomUUID(),
      user: newPersonnel.user,
      template_name: onboardingTemplates[0]!.name,
      template_id: onboardingTemplates[0]!.id,
      current_step: 0,
      total_steps: onboardingTemplates[0]!.steps.length,
      completed_steps: [],
      status: 'in_progress',
      started_at: nowIso()
    })
    return { candidate: c, personnel: newPersonnel }
  }

  function createInterview(payload: Omit<Interview, 'id'>) {
    const item: Interview = { id: randomUUID(), ...payload }
    interviews.push(item)
    const c = candidates.find(x => x.id === payload.candidate_id)
    if (c) {
      c.interviews.push(item)
      const completed = c.interviews.filter(i => i.score).map(i => i.score!)
      if (completed.length) c.average_score = completed.reduce((a, b) => a + b, 0) / completed.length
    }
    return item
  }

  function updateInterview(id: string, payload: Partial<Pick<Interview, 'score' | 'feedback' | 'status'>>) {
    const idx = interviews.findIndex(i => i.id === id)
    if (idx < 0) throw createError({ statusCode: 404, message: 'Not found' })
    interviews[idx] = { ...interviews[idx]!, ...payload }
    const c = candidates.find(x => x.id === interviews[idx]!.candidate_id)
    if (c) {
      c.interviews = interviews.filter(i => i.candidate_id === c.id)
      const scores = c.interviews.filter(i => i.score).map(i => i.score!)
      if (scores.length) c.average_score = scores.reduce((a, b) => a + b, 0) / scores.length
    }
    return interviews[idx]!
  }

  function listOnboardingTemplates() {
    return onboardingTemplates
  }

  function updateOnboardingTemplate(id: string, steps: OnboardingTemplate['steps']) {
    const tpl = onboardingTemplates.find(t => t.id === id)
    if (!tpl) throw createError({ statusCode: 404, message: 'Not found' })
    tpl.steps = steps
    return tpl
  }

  function listOnboardingProgress() {
    return onboardingProgress.filter(o => o.status === 'in_progress')
  }

  function completeOnboardingStep(progressId: string, stepId: string) {
    const p = onboardingProgress.find(o => o.id === progressId)
    if (!p) throw createError({ statusCode: 404, message: 'Not found' })
    if (!p.completed_steps.includes(stepId)) p.completed_steps.push(stepId)
    p.current_step = p.completed_steps.length
    if (p.current_step >= p.total_steps) p.status = 'completed'
    return p
  }

  function listLeavePolicies() {
    return leavePolicies
  }

  function createLeavePolicy(payload: CreateLeavePolicyPayload) {
    const lt = leavePolicies.find(p => p.leave_type.id === payload.leave_type_id)?.leave_type
      ?? { id: payload.leave_type_id, name: 'مرخصی', default_balance_days: 0, unit: 'day' as const, is_paid: true }
    const item: LeavePolicy = {
      id: randomUUID(),
      leave_type: lt,
      auto_approve: payload.auto_approve,
      approval_chain: payload.approval_chain,
      min_notice_days: payload.min_notice_days,
      allow_negative_balance: payload.allow_negative_balance
    }
    leavePolicies.push(item)
    return item
  }

  function updateLeavePolicy(id: string, payload: Partial<CreateLeavePolicyPayload>) {
    const idx = leavePolicies.findIndex(p => p.id === id)
    if (idx < 0) throw createError({ statusCode: 404, message: 'Not found' })
    leavePolicies[idx] = { ...leavePolicies[idx]!, ...payload }
    return leavePolicies[idx]!
  }

  function getLeaveReport() {
    const items: LeaveReportItem[] = personnel.filter(p => p.status !== 'terminated').map(p => ({
      user: p.user,
      by_type: { استحقاقی: 5, استعلاجی: 2 },
      by_month: { '2026-01': 2, '2026-02': 1, '2026-03': 4 },
      total_days: 7
    }))
    return items
  }

  function getDashboardSummary(): HrDashboardSummary {
    return {
      active_personnel_count: personnel.filter(p => p.status === 'active').length,
      attendance_today: getTodayAttendance(),
      expiring_contracts: getExpiringContracts(),
      active_onboarding: listOnboardingProgress(),
      new_candidates_count: candidates.filter(c => c.status === 'new').length
    }
  }

  function getSettings() {
    return hrSettings
  }

  function updateSettings(payload: Partial<HrSettings>) {
    hrSettings = { ...hrSettings, ...payload }
    return hrSettings
  }

  function getAvailableUsers() {
    const linked = new Set(personnel.map(p => p.user.id))
    return users.filter(u => !linked.has(u.id))
  }

  return {
    listPersonnel,
    getPersonnel,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    getTodayAttendance,
    getUserTodayRecord,
    getClockStatus,
    clockAction,
    getMyAttendance,
    getAttendanceReport,
    listContracts,
    getExpiringContracts,
    createContract,
    renewContract,
    listDocuments,
    uploadDocument,
    getDocument,
    listMissions,
    listMyMissions,
    createMission,
    approveMission,
    rejectMission,
    listRequisitions,
    createRequisition,
    getRequisition,
    listCandidates,
    moveCandidateStatus,
    hireCandidate,
    createInterview,
    updateInterview,
    listOnboardingTemplates,
    updateOnboardingTemplate,
    listOnboardingProgress,
    completeOnboardingStep,
    listLeavePolicies,
    createLeavePolicy,
    updateLeavePolicy,
    getLeaveReport,
    getDashboardSummary,
    getSettings,
    updateSettings,
    getAvailableUsers,
    users
  }
}

export type Phase2Db = ReturnType<typeof usePhase2Db>

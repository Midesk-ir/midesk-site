import type { UserBrief } from './phase1'
import type { LeaveType } from './phase1'

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern'
export type PersonnelStatus = 'active' | 'on_leave' | 'terminated'
export type AttendanceStatus = 'present' | 'late' | 'absent' | 'half_day' | 'on_leave' | 'mission' | 'holiday'
export type ClockStatus = 'not_started' | 'checked_in' | 'on_break' | 'checked_out'
export type ContractType = 'permanent' | 'fixed_term' | 'trial' | 'intern'
export type ContractStatus = 'active' | 'expired' | 'terminated' | 'renewed'
export type MissionStatus = 'pending' | 'approved' | 'rejected' | 'completed'
export type RequisitionPriority = 'low' | 'medium' | 'high' | 'urgent'
export type RequisitionStatus = 'open' | 'filled' | 'cancelled'
export type CandidateStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
export type InterviewType = 'phone' | 'video' | 'in_person' | 'technical'
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'
export type OnboardingStatus = 'in_progress' | 'completed' | 'cancelled'
export type DocumentCategory = 'contract' | 'id' | 'certificate' | 'other'

export interface Personnel {
  id: string
  user: UserBrief
  employee_code: string
  hire_date: string
  employment_type: EmploymentType
  status: PersonnelStatus
  job_title?: string
  department?: string
  national_id?: string
  birth_date?: string
  address?: string
  emergency_contact?: string
  phone?: string
  email?: string
}

export interface PersonnelDetail extends Personnel {
  contracts: Contract[]
  documents: HrDocument[]
  recent_attendance: AttendanceRecord[]
  leave_balances?: Array<{ leave_type: LeaveType, remaining: number }>
  leave_requests?: import('./phase1').LeaveRequest[]
}

export interface PersonnelFilters {
  status?: PersonnelStatus
  department?: string
  search?: string
}

export interface AttendanceRecord {
  id: string
  user_id: string
  user?: UserBrief
  date: string
  check_in_at?: string
  check_out_at?: string
  break_start_at?: string
  break_end_at?: string
  status: AttendanceStatus
  effective_minutes: number
  overtime_minutes: number
}

export interface AttendanceTodaySummary {
  present: number
  absent: number
  on_leave: number
  on_mission: number
  records: AttendanceRecord[]
}

export interface AttendanceReportRow {
  user: UserBrief
  days: Record<string, AttendanceStatus>
  summary: {
    present: number
    late: number
    absent: number
    overtime_minutes: number
  }
}

export interface Contract {
  id: string
  personnel_id: string
  user: UserBrief
  type: ContractType
  start_date: string
  end_date?: string
  base_salary: number
  currency: string
  status: ContractStatus
}

export interface HrDocument {
  id: string
  personnel_id: string
  user: UserBrief
  category: DocumentCategory
  filename: string
  size_bytes: number
  mime_type: string
  uploaded_at: string
}

export interface Mission {
  id: string
  user: UserBrief
  destination: string
  start_date: string
  end_date: string
  transport?: string
  description?: string
  status: MissionStatus
  created_at: string
}

export interface Requisition {
  id: string
  title: string
  department?: string
  positions_count: number
  priority: RequisitionPriority
  status: RequisitionStatus
  candidates_count: number
  created_at: string
}

export interface Candidate {
  id: string
  requisition_id: string
  full_name: string
  email?: string
  phone?: string
  status: CandidateStatus
  source?: string
  resume_filename?: string
  average_score?: number
  interviews: Interview[]
  created_at: string
}

export interface Interview {
  id: string
  candidate_id: string
  interviewer: UserBrief
  scheduled_at: string
  type: InterviewType
  score?: number
  feedback?: string
  status: InterviewStatus
}

export interface OnboardingTemplate {
  id: string
  name: string
  steps: OnboardingStep[]
}

export interface OnboardingStep {
  id: string
  title: string
  description?: string
  assignee_role?: string
  deadline_days?: number
  order_index: number
}

export interface OnboardingProgress {
  id: string
  user: UserBrief
  template_name: string
  template_id: string
  current_step: number
  total_steps: number
  completed_steps: string[]
  status: OnboardingStatus
  started_at: string
}

export interface LeavePolicy {
  id: string
  leave_type: LeaveType
  auto_approve: boolean
  approval_chain: string[]
  min_notice_days: number
  allow_negative_balance: boolean
}

export interface LeaveReportItem {
  user: UserBrief
  by_type: Record<string, number>
  by_month: Record<string, number>
  total_days: number
}

export interface HrDashboardSummary {
  active_personnel_count: number
  attendance_today: AttendanceTodaySummary
  expiring_contracts: Contract[]
  active_onboarding: OnboardingProgress[]
  new_candidates_count: number
}

export interface HrSettings {
  work_start_time: string
  work_end_time: string
  late_threshold_minutes: number
  overtime_enabled: boolean
  contract_expiry_alert_days: number
}

export interface DateRange {
  from: string
  to: string
}

export interface CreatePersonnelPayload {
  user_id: string
  employee_code: string
  hire_date: string
  employment_type: EmploymentType
  job_title?: string
  department?: string
  national_id?: string
  birth_date?: string
  address?: string
  emergency_contact?: string
}

export interface CreateContractPayload {
  personnel_id: string
  type: ContractType
  start_date: string
  end_date?: string
  base_salary: number
  currency?: string
}

export interface CreateMissionPayload {
  destination: string
  start_date: string
  end_date: string
  transport?: string
  description?: string
}

export interface CreateRequisitionPayload {
  title: string
  department?: string
  positions_count: number
  priority: RequisitionPriority
}

export interface CreateLeavePolicyPayload {
  leave_type_id: string
  auto_approve: boolean
  approval_chain: string[]
  min_notice_days: number
  allow_negative_balance: boolean
}

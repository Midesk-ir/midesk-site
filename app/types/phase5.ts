import type { UserBrief } from './phase1'

// ── Correspondence ──
export type CorrespondenceType = 'incoming' | 'outgoing' | 'internal'
export type CorrespondencePriority = 'normal' | 'urgent' | 'confidential'
export type CorrespondenceStatus = 'draft' | 'sent' | 'received' | 'archived'
export type RoutingAction = 'review' | 'approve' | 'sign' | 'for_info' | 'execute'
export type RoutingStatus = 'pending' | 'seen' | 'completed'

export interface CorrespondenceRouting {
  id: string
  from: UserBrief
  to: UserBrief
  action: RoutingAction
  status: RoutingStatus
  note?: string
  due_date?: string
  created_at: string
}

export interface Correspondence {
  id: string
  number: string
  type: CorrespondenceType
  subject: string
  body: string
  priority: CorrespondencePriority
  status: CorrespondenceStatus
  signed_by?: UserBrief
  parent_id?: string
  routing: CorrespondenceRouting[]
  created_at: string
  updated_at: string
}

export interface CreateCorrespondencePayload {
  type: CorrespondenceType
  subject: string
  body: string
  priority?: CorrespondencePriority
  parent_id?: string
}

export interface RouteCorrespondencePayload {
  to_user_id: string
  action: RoutingAction
  note?: string
  due_date?: string
}

// ── Surveys ──
export type SurveyType = 'survey' | 'quiz' | 'form'
export type SurveyStatus = 'draft' | 'active' | 'closed'
export type SurveyQuestionType =
  | 'text' | 'textarea' | 'single_choice' | 'multiple_choice'
  | 'rating' | 'number' | 'date'

export interface SurveyQuestion {
  id: string
  title: string
  type: SurveyQuestionType
  options?: string[]
  is_required: boolean
  order_index: number
}

export interface Survey {
  id: string
  title: string
  type: SurveyType
  status: SurveyStatus
  responses_count: number
  questions: SurveyQuestion[]
  created_at: string
}

export interface CreateSurveyPayload {
  title: string
  type?: SurveyType
  questions?: SurveyQuestion[]
}

export interface SurveyResponsePayload {
  answers: Record<string, string | string[] | number>
}

export interface SurveyReportItem {
  question_id: string
  question_title: string
  type: SurveyQuestionType
  data: Record<string, number> | { average: number, count: number } | string[]
}

// ── CRM ──
export type CrmContactType = 'customer' | 'lead' | 'partner' | 'vendor'
export type CrmOpportunityStage =
  | 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type CrmActivityType = 'call' | 'email' | 'meeting' | 'note'

export interface CrmContact {
  id: string
  name: string
  company?: string
  email?: string
  phone?: string
  type: CrmContactType
  assigned_to?: UserBrief
  tags: string[]
  created_at: string
}

export interface CrmOpportunity {
  id: string
  title: string
  contact: CrmContact
  value: number
  currency: string
  stage: CrmOpportunityStage
  probability: number
  expected_close_date?: string
  created_at: string
}

export interface CrmActivity {
  id: string
  contact_id: string
  type: CrmActivityType
  subject: string
  notes?: string
  performed_by: UserBrief
  performed_at: string
}

export interface CrmDashboard {
  funnel: Record<CrmOpportunityStage, number>
  hot_opportunities: CrmOpportunity[]
  recent_activities: CrmActivity[]
}

export interface CreateCrmContactPayload {
  name: string
  company?: string
  email?: string
  phone?: string
  type: CrmContactType
  assigned_to_id?: string
  tags?: string[]
}

export interface CreateCrmOpportunityPayload {
  title: string
  contact_id: string
  value: number
  currency?: string
  stage?: CrmOpportunityStage
  probability?: number
  expected_close_date?: string
}

export interface CreateCrmActivityPayload {
  contact_id: string
  type: CrmActivityType
  subject: string
  notes?: string
}

// ── Custom Reports ──
export type ReportChartType = 'table' | 'bar' | 'line' | 'pie'

export interface ReportFilter {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains'
  value: string
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly'
  recipients: string[]
}

export interface CustomReport {
  id: string
  name: string
  data_source: string
  filters: ReportFilter[]
  columns: string[]
  chart_type: ReportChartType
  schedule?: ReportSchedule
  created_at: string
}

export interface DataSourceInfo {
  id: string
  label: string
  columns: string[]
}

export interface ReportPreviewResult {
  columns: string[]
  rows: Record<string, string | number>[]
  chart_data?: Record<string, number>
}

export interface CreateReportPayload {
  name: string
  data_source: string
  filters?: ReportFilter[]
  columns: string[]
  chart_type?: ReportChartType
  schedule?: ReportSchedule
}

// ── Project Files ──
export interface ProjectFile {
  id: string
  project_id: string
  folder_id: string | null
  name: string
  file_path: string
  file_size: number
  mime_type: string
  version: number
  uploaded_by: UserBrief
  created_at: string
}

export interface ProjectFolder {
  id: string
  project_id: string
  parent_id: string | null
  name: string
}

// ── Guest Access ──
export type GuestRole = 'viewer' | 'commenter'

export interface GuestAccess {
  id: string
  email: string
  name: string
  role: GuestRole
  project_ids: string[]
  expires_at: string
  created_at: string
}

export interface InviteGuestPayload {
  email: string
  name: string
  role: GuestRole
  project_ids: string[]
  expires_at: string
}

// ── Custom Roles ──
export interface CustomRole {
  id: string
  name: string
  permissions: string[]
  created_at: string
}

export interface CreateCustomRolePayload {
  name: string
  permissions: string[]
}

// ── Subscription ──
export type SubscriptionPlanCode = 'bronze' | 'silver' | 'gold' | 'diamond'
export type SubscriptionInvoiceStatus = 'pending' | 'paid' | 'failed'

export interface SubscriptionPlan {
  id: string
  code: SubscriptionPlanCode
  name: string
  features: string[]
  price_monthly: Record<'IR' | 'INTL', number>
  price_yearly: Record<'IR' | 'INTL', number>
  max_users: number
  max_projects: number
}

export interface CurrentSubscription {
  plan: SubscriptionPlan
  status: 'active' | 'expired' | 'trial'
  expires_at: string
  usage: { users: number, projects: number }
}

export interface SubscriptionInvoice {
  id: string
  amount: number
  currency: string
  status: SubscriptionInvoiceStatus
  due_date: string
  paid_at?: string
  plan_name: string
}

export interface CheckoutPayload {
  plan_code: SubscriptionPlanCode
  cycle: 'monthly' | 'quarterly' | 'semiannual' | 'yearly'
}

// ── Super Admin ──
export interface SaTenant {
  id: string
  name: string
  plan_code: SubscriptionPlanCode
  status: 'active' | 'suspended' | 'trial'
  users_count: number
  created_at: string
  mrr: number
}

export interface SaDashboardStats {
  tenants_count: number
  active_subscriptions: number
  new_this_month: number
  mrr: number
  arr: number
  revenue_by_month: { month: string, amount: number }[]
  revenue_by_plan: Record<string, number>
}

export interface SaConsultation {
  id: string
  name: string
  email: string
  company?: string
  message: string
  status: 'pending' | 'contacted' | 'closed'
  created_at: string
}

export interface SaFinancialStats {
  mrr: number
  arr: number
  revenue_by_plan: Record<string, number>
  revenue_by_cycle: { monthly: number, yearly: number }
  cancellations_this_month: number
}

export interface SaPlatformSettings {
  platform_name: string
  support_email: string
  default_trial_days: number
  maintenance_mode: boolean
}

// ── Performance ──
export type ObjectiveStatus = 'on_track' | 'at_risk' | 'off_track' | 'completed'
export type ReviewStatus = 'scheduled' | 'in_progress' | 'completed'

export interface PerformanceIndicator {
  id: string
  name: string
  description?: string
  unit: string
  target: number
  current: number
  owner: UserBrief
}

export interface PerformanceObjective {
  id: string
  title: string
  description?: string
  status: ObjectiveStatus
  progress: number
  owner: UserBrief
  due_date: string
  key_results: { id: string, title: string, progress: number }[]
}

export interface PerformanceReview {
  id: string
  employee: UserBrief
  reviewer: UserBrief
  period: string
  status: ReviewStatus
  score?: number
  scheduled_at: string
}

export interface PerformanceDashboard {
  indicators: PerformanceIndicator[]
  objectives_summary: { on_track: number, at_risk: number, off_track: number, completed: number }
  upcoming_reviews: PerformanceReview[]
}

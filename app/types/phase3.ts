import type { UserBrief } from './phase1'

export type ExpenseCategory = 'travel' | 'office' | 'software' | 'meals' | 'equipment' | 'other'
export type ExpenseStatus =
  | 'draft'
  | 'submitted'
  | 'manager_review'
  | 'finance_review'
  | 'approved'
  | 'ready_to_pay'
  | 'paid'
  | 'rejected'

export interface CostCenter {
  id: string
  name: string
  code: string
  parent_id?: string
  children?: CostCenter[]
}

export interface Budget {
  id: string
  cost_center: CostCenter
  year: number
  amount: number
  spent: number
  remaining: number
  utilization_percent: number
}

export interface BudgetOverviewItem {
  cost_center: CostCenter
  budget: number
  spent: number
  remaining: number
  utilization_percent: number
}

export interface Expense {
  id: string
  user: UserBrief
  category: ExpenseCategory
  cost_center_id?: string
  cost_center?: CostCenter
  budget_id?: string
  amount: number
  currency: string
  description: string
  expense_date: string
  status: ExpenseStatus
  receipt_path?: string
  rejection_reason?: string
  created_at: string
}

export interface ExpenseSummary {
  pending_count: number
  pending_amount: number
  currency: string
}

export interface FinanceDashboardSummary {
  budget_overview: BudgetOverviewItem[]
  expense_summary: ExpenseSummary
  overdue_invoices_count: number
  overdue_invoices_amount: number
  payroll_status: 'not_calculated' | 'calculated' | 'approved' | 'paid'
  currency: string
}

export interface CreateExpensePayload {
  category: ExpenseCategory
  cost_center_id?: string
  budget_id?: string
  amount: number
  currency?: string
  description: string
  expense_date: string
  receipt_path?: string
}

export interface PayslipDetail {
  id: string
  period: string
  base_salary: number
  overtime_amount: number
  allowances: { name: string, amount: number }[]
  deductions: { name: string, amount: number }[]
  gross_amount: number
  net_amount: number
  currency: string
  status: 'calculated' | 'approved' | 'paid'
}

export interface CreateBudgetPayload {
  cost_center_id: string
  year: number
  amount: number
}

export interface ExpenseFilters {
  status?: ExpenseStatus
  category?: ExpenseCategory
  user_id?: string
  from_date?: string
  to_date?: string
}

export interface MyPayslipBrief {
  id: string
  period: string
  net_amount: number
  currency: string
  status: 'calculated' | 'approved' | 'paid'
}

export interface MyReceipt {
  id: string
  title: string
  amount: number
  currency: string
  paid_at: string
  reference?: string
}

// --- Phase 3B: invoices, purchase, vendors, payroll ---

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'

export interface Vendor {
  id: string
  name: string
  code?: string
  contact_name?: string
  email?: string
  phone?: string
  tax_id?: string
  is_active: boolean
}

export interface Invoice {
  id: string
  vendor: Vendor
  invoice_number: string
  issue_date: string
  due_date: string
  amount: number
  currency: string
  status: InvoiceStatus
  description?: string
  paid_at?: string
}

export interface CreateInvoicePayload {
  vendor_id: string
  invoice_number: string
  issue_date: string
  due_date: string
  amount: number
  currency?: string
  description?: string
}

export interface CreateVendorPayload {
  name: string
  code?: string
  contact_name?: string
  email?: string
  phone?: string
  tax_id?: string
}

export interface InvoiceFilters {
  status?: InvoiceStatus | 'overdue'
}

export interface PurchaseRequestItem {
  name: string
  qty: number
  unit_price: number
  total: number
}

export type PurchaseRequestStatus =
  | 'draft'
  | 'submitted'
  | 'owner_review'
  | 'finance_review'
  | 'approved'
  | 'rejected'
  | 'converted'

export interface PurchaseRequest {
  id: string
  user: UserBrief
  title: string
  items: PurchaseRequestItem[]
  total_amount: number
  currency: string
  status: PurchaseRequestStatus
  description?: string
  purchase_order_id?: string
  rejection_reason?: string
  created_at: string
}

export interface CreatePurchaseRequestPayload {
  title: string
  items: Omit<PurchaseRequestItem, 'total'>[]
  currency?: string
  description?: string
}

export type PurchaseOrderStatus = 'draft' | 'issued' | 'received' | 'cancelled'

export interface PurchaseOrder {
  id: string
  purchase_request_id?: string
  vendor?: Vendor
  title: string
  items: PurchaseRequestItem[]
  total_amount: number
  currency: string
  status: PurchaseOrderStatus
  created_at: string
}

export type PayrollStatus = 'draft' | 'calculated' | 'approved' | 'paid'

export interface PayrollRecord {
  id: string
  user: UserBrief
  period: string
  base_salary: number
  overtime_amount: number
  allowances: { name: string, amount: number }[]
  deductions: { name: string, amount: number }[]
  gross_amount: number
  net_amount: number
  currency: string
  status: PayrollStatus
}

import { randomUUID } from 'node:crypto'
import type { UserBrief } from '../../app/types/phase1'
import type {
  Budget,
  BudgetOverviewItem,
  CostCenter,
  CreateBudgetPayload,
  CreateExpensePayload,
  CreateInvoicePayload,
  CreatePurchaseRequestPayload,
  CreateVendorPayload,
  Expense,
  ExpenseFilters,
  ExpenseSummary,
  FinanceDashboardSummary,
  Invoice,
  InvoiceFilters,
  MyPayslipBrief,
  MyReceipt,
  PayrollRecord,
  PayslipDetail,
  PurchaseOrder,
  PurchaseRequest,
  PurchaseRequestItem,
  Vendor
} from '../../app/types/phase3'

const users: UserBrief[] = [
  { id: 'u1', name: 'علی محمدآبادی', avatar_url: null },
  { id: 'u2', name: 'Sara Johnson', avatar_url: null },
  { id: 'u3', name: 'محمد کریمی', avatar_url: null },
  { id: 'u4', name: 'فاطمه احمدی', avatar_url: null }
]

const costCenters: CostCenter[] = [
  { id: 'cc1', name: 'فناوری', code: 'ENG', parent_id: undefined },
  { id: 'cc2', name: 'فرانت‌اند', code: 'ENG-FE', parent_id: 'cc1' },
  { id: 'cc3', name: 'بک‌اند', code: 'ENG-BE', parent_id: 'cc1' },
  { id: 'cc4', name: 'عملیات', code: 'OPS', parent_id: undefined },
  { id: 'cc5', name: 'منابع انسانی', code: 'HR', parent_id: undefined }
]

let budgets: Budget[] = [
  {
    id: 'bud1',
    cost_center: costCenters[0]!,
    year: 2026,
    amount: 500_000_000,
    spent: 320_000_000,
    remaining: 180_000_000,
    utilization_percent: 64
  },
  {
    id: 'bud2',
    cost_center: costCenters[3]!,
    year: 2026,
    amount: 200_000_000,
    spent: 145_000_000,
    remaining: 55_000_000,
    utilization_percent: 72.5
  },
  {
    id: 'bud3',
    cost_center: costCenters[4]!,
    year: 2026,
    amount: 150_000_000,
    spent: 48_000_000,
    remaining: 102_000_000,
    utilization_percent: 32
  }
]

let expenses: Expense[] = [
  {
    id: 'exp1',
    user: users[1]!,
    category: 'software',
    cost_center_id: 'cc2',
    cost_center: costCenters[1],
    budget_id: 'bud1',
    amount: 4_500_000,
    currency: 'IRR',
    description: 'لایسنس Figma Team',
    expense_date: '2026-06-10',
    status: 'finance_review',
    created_at: '2026-06-10T09:00:00Z'
  },
  {
    id: 'exp2',
    user: users[2]!,
    category: 'travel',
    cost_center_id: 'cc4',
    cost_center: costCenters[3],
    budget_id: 'bud2',
    amount: 12_000_000,
    currency: 'IRR',
    description: 'سفر کاری مشهد — جلسه با مشتری',
    expense_date: '2026-06-15',
    status: 'manager_review',
    created_at: '2026-06-15T11:30:00Z'
  },
  {
    id: 'exp3',
    user: users[0]!,
    category: 'office',
    cost_center_id: 'cc1',
    cost_center: costCenters[0],
    budget_id: 'bud1',
    amount: 2_800_000,
    currency: 'IRR',
    description: 'لوازم اداری',
    expense_date: '2026-06-18',
    status: 'submitted',
    created_at: '2026-06-18T14:00:00Z'
  },
  {
    id: 'exp4',
    user: users[1]!,
    category: 'meals',
    cost_center_id: 'cc2',
    cost_center: costCenters[1],
    amount: 850_000,
    currency: 'IRR',
    description: 'ناهار تیم',
    expense_date: '2026-06-20',
    status: 'paid',
    created_at: '2026-06-20T12:00:00Z'
  },
  {
    id: 'exp5',
    user: users[2]!,
    category: 'equipment',
    cost_center_id: 'cc4',
    cost_center: costCenters[3],
    amount: 18_500_000,
    currency: 'IRR',
    description: 'پرینتر لیزری',
    expense_date: '2026-06-22',
    status: 'rejected',
    rejection_reason: 'خارج از بودجه فصلی',
    created_at: '2026-06-22T10:00:00Z'
  }
]

const myPayslips: MyPayslipBrief[] = [
  { id: 'ps1', period: '2026-05', net_amount: 23_200_000, currency: 'IRR', status: 'paid' },
  { id: 'ps2', period: '2026-06', net_amount: 24_100_000, currency: 'IRR', status: 'approved' }
]

const payslipDetails: Record<string, PayslipDetail> = {
  ps1: {
    id: 'ps1',
    period: '2026-05',
    base_salary: 20_000_000,
    overtime_amount: 2_800_000,
    allowances: [
      { name: 'حق مسکن', amount: 3_000_000 }
    ],
    deductions: [
      { name: 'بیمه (۷٪)', amount: 1_400_000 },
      { name: 'مالیات', amount: 1_200_000 }
    ],
    gross_amount: 25_800_000,
    net_amount: 23_200_000,
    currency: 'IRR',
    status: 'paid'
  },
  ps2: {
    id: 'ps2',
    period: '2026-06',
    base_salary: 20_500_000,
    overtime_amount: 3_100_000,
    allowances: [
      { name: 'حق مسکن', amount: 3_000_000 }
    ],
    deductions: [
      { name: 'بیمه (۷٪)', amount: 1_450_000 },
      { name: 'مالیات', amount: 1_050_000 }
    ],
    gross_amount: 26_600_000,
    net_amount: 24_100_000,
    currency: 'IRR',
    status: 'approved'
  }
}

const myReceipts: MyReceipt[] = [
  {
    id: 'rc1',
    title: 'پرداخت هزینه ناهار تیم',
    amount: 850_000,
    currency: 'IRR',
    paid_at: '2026-06-25T10:00:00Z',
    reference: 'EXP-exp4'
  }
]

let vendors: Vendor[] = [
  { id: 'v1', name: 'شرکت فناوری ابری', code: 'V-001', contact_name: 'رضا نوری', email: 'sales@cloud.ir', phone: '021-12345678', tax_id: '1234567890', is_active: true },
  { id: 'v2', name: 'تأمین تجهیزات اداری', code: 'V-002', contact_name: 'مریم صادقی', email: 'info@office.ir', is_active: true },
  { id: 'v3', name: 'Global Software Inc.', code: 'V-003', contact_name: 'John Smith', email: 'billing@globalsoft.com', is_active: true }
]

function findVendor(id: string): Vendor | undefined {
  return vendors.find(v => v.id === id)
}

function invoiceStatus(invoice: Invoice): Invoice['status'] {
  if (invoice.status === 'paid' || invoice.status === 'cancelled') return invoice.status
  if (invoice.due_date < new Date().toISOString().slice(0, 10)) return 'overdue'
  return invoice.status
}

let invoices: Invoice[] = [
  {
    id: 'inv1',
    vendor: vendors[0]!,
    invoice_number: 'INV-2026-0142',
    issue_date: '2026-05-01',
    due_date: '2026-05-31',
    amount: 18_000_000,
    currency: 'IRR',
    status: 'overdue',
    description: 'سرویس میزبانی ابری — اردیبهشت'
  },
  {
    id: 'inv2',
    vendor: vendors[1]!,
    invoice_number: 'INV-2026-0158',
    issue_date: '2026-06-01',
    due_date: '2026-06-15',
    amount: 17_000_000,
    currency: 'IRR',
    status: 'overdue',
    description: 'خرید تجهیزات اداری'
  },
  {
    id: 'inv3',
    vendor: vendors[2]!,
    invoice_number: 'GS-8842',
    issue_date: '2026-06-10',
    due_date: '2026-07-10',
    amount: 4_500_000,
    currency: 'IRR',
    status: 'sent',
    description: 'لایسنس سالانه'
  },
  {
    id: 'inv4',
    vendor: vendors[0]!,
    invoice_number: 'INV-2026-0160',
    issue_date: '2026-04-01',
    due_date: '2026-04-30',
    amount: 18_000_000,
    currency: 'IRR',
    status: 'paid',
    description: 'سرویس میزبانی — فروردین',
    paid_at: '2026-04-28T10:00:00Z'
  }
]

let purchaseRequests: PurchaseRequest[] = [
  {
    id: 'pr1',
    user: users[2]!,
    title: 'خرید لپ‌تاپ توسعه‌دهنده',
    items: [{ name: 'MacBook Pro 14', qty: 1, unit_price: 85_000_000, total: 85_000_000 }],
    total_amount: 85_000_000,
    currency: 'IRR',
    status: 'finance_review',
    description: 'جایگزینی دستگاه قدیمی',
    created_at: '2026-06-12T09:00:00Z'
  },
  {
    id: 'pr2',
    user: users[1]!,
    title: 'لوازم مصرفی دفتر',
    items: [
      { name: 'کاغذ A4', qty: 20, unit_price: 120_000, total: 2_400_000 },
      { name: 'ماژیک', qty: 10, unit_price: 45_000, total: 450_000 }
    ],
    total_amount: 2_850_000,
    currency: 'IRR',
    status: 'approved',
    created_at: '2026-06-18T11:00:00Z'
  },
  {
    id: 'pr3',
    user: users[0]!,
    title: 'مانیتور 27 اینچ',
    items: [{ name: 'Dell U2723QE', qty: 2, unit_price: 22_000_000, total: 44_000_000 }],
    total_amount: 44_000_000,
    currency: 'IRR',
    status: 'draft',
    created_at: '2026-06-25T14:00:00Z'
  }
]

let purchaseOrders: PurchaseOrder[] = [
  {
    id: 'po1',
    purchase_request_id: 'pr2',
    vendor: vendors[1],
    title: 'لوازم مصرفی دفتر',
    items: purchaseRequests[1]!.items,
    total_amount: 2_850_000,
    currency: 'IRR',
    status: 'issued',
    created_at: '2026-06-20T10:00:00Z'
  }
]

let payrollRecords: PayrollRecord[] = [
  {
    id: 'pay1',
    user: users[0]!,
    period: '2026-06',
    base_salary: 20_500_000,
    overtime_amount: 3_100_000,
    allowances: [{ name: 'حق مسکن', amount: 3_000_000 }],
    deductions: [{ name: 'بیمه (۷٪)', amount: 1_450_000 }, { name: 'مالیات', amount: 1_050_000 }],
    gross_amount: 26_600_000,
    net_amount: 24_100_000,
    currency: 'IRR',
    status: 'calculated'
  },
  {
    id: 'pay2',
    user: users[1]!,
    period: '2026-06',
    base_salary: 18_000_000,
    overtime_amount: 1_200_000,
    allowances: [{ name: 'حق مسکن', amount: 3_000_000 }],
    deductions: [{ name: 'بیمه (۷٪)', amount: 1_260_000 }, { name: 'مالیات', amount: 940_000 }],
    gross_amount: 22_200_000,
    net_amount: 20_000_000,
    currency: 'IRR',
    status: 'calculated'
  },
  {
    id: 'pay3',
    user: users[2]!,
    period: '2026-06',
    base_salary: 16_000_000,
    overtime_amount: 800_000,
    allowances: [{ name: 'حق مسکن', amount: 2_500_000 }],
    deductions: [{ name: 'بیمه (۷٪)', amount: 1_120_000 }, { name: 'مالیات', amount: 680_000 }],
    gross_amount: 19_300_000,
    net_amount: 17_500_000,
    currency: 'IRR',
    status: 'calculated'
  },
  {
    id: 'pay4',
    user: users[3]!,
    period: '2026-05',
    base_salary: 15_000_000,
    overtime_amount: 0,
    allowances: [{ name: 'حق مسکن', amount: 2_500_000 }],
    deductions: [{ name: 'بیمه (۷٪)', amount: 1_050_000 }, { name: 'مالیات', amount: 450_000 }],
    gross_amount: 17_500_000,
    net_amount: 16_000_000,
    currency: 'IRR',
    status: 'paid'
  }
]

function calcItemTotal(item: { qty: number, unit_price: number }): number {
  return item.qty * item.unit_price
}

function normalizeItems(items: Omit<PurchaseRequestItem, 'total'>[]): PurchaseRequestItem[] {
  return items.map(i => ({ ...i, total: calcItemTotal(i) }))
}

function payrollToPayslip(record: PayrollRecord): PayslipDetail {
  return {
    id: record.id,
    period: record.period,
    base_salary: record.base_salary,
    overtime_amount: record.overtime_amount,
    allowances: record.allowances,
    deductions: record.deductions,
    gross_amount: record.gross_amount,
    net_amount: record.net_amount,
    currency: record.currency,
    status: record.status === 'draft' ? 'calculated' : record.status as PayslipDetail['status']
  }
}

function getPayrollDashboardStatus(): FinanceDashboardSummary['payroll_status'] {
  const current = payrollRecords.filter(r => r.period === '2026-06')
  if (!current.length) return 'not_calculated'
  if (current.every(r => r.status === 'paid')) return 'paid'
  if (current.every(r => r.status === 'approved' || r.status === 'paid')) return 'approved'
  if (current.some(r => r.status === 'calculated' || r.status === 'approved')) return 'calculated'
  return 'not_calculated'
}

function findCostCenter(id: string): CostCenter | undefined {
  return costCenters.find(c => c.id === id)
}

function buildCostCenterTree(): CostCenter[] {
  const map = new Map<string, CostCenter>()
  for (const cc of costCenters) {
    map.set(cc.id, { ...cc, children: [] })
  }
  const roots: CostCenter[] = []
  for (const cc of map.values()) {
    if (cc.parent_id && map.has(cc.parent_id)) {
      map.get(cc.parent_id)!.children!.push(cc)
    } else {
      roots.push(cc)
    }
  }
  return roots
}

function recalcBudget(budgetId: string) {
  const budget = budgets.find(b => b.id === budgetId)
  if (!budget) return
  const spent = expenses
    .filter(e => e.budget_id === budgetId && !['draft', 'rejected'].includes(e.status))
    .reduce((sum, e) => sum + e.amount, 0)
  budget.spent = spent
  budget.remaining = budget.amount - spent
  budget.utilization_percent = budget.amount > 0 ? Math.round((spent / budget.amount) * 1000) / 10 : 0
}

function enrichExpense(e: Expense): Expense {
  const cc = e.cost_center_id ? findCostCenter(e.cost_center_id) : undefined
  return { ...e, cost_center: cc ?? e.cost_center }
}

function userBriefFromId(userId: string): UserBrief {
  return users.find(u => u.id === userId) ?? { id: userId, name: userId, avatar_url: null }
}

export function usePhase3Db() {
  return {
    listCostCenters() {
      return buildCostCenterTree()
    },

    listBudgets(year?: number) {
      return budgets.filter(b => !year || b.year === year)
    },

    getBudgetOverview(): BudgetOverviewItem[] {
      return budgets.map(b => ({
        cost_center: b.cost_center,
        budget: b.amount,
        spent: b.spent,
        remaining: b.remaining,
        utilization_percent: b.utilization_percent
      }))
    },

    createBudget(payload: CreateBudgetPayload) {
      const cc = findCostCenter(payload.cost_center_id)
      if (!cc) throw createError({ statusCode: 400, message: 'Cost center not found' })
      const existing = budgets.find(b => b.cost_center.id === payload.cost_center_id && b.year === payload.year)
      if (existing) throw createError({ statusCode: 409, message: 'Budget already exists' })
      const budget: Budget = {
        id: randomUUID(),
        cost_center: cc,
        year: payload.year,
        amount: payload.amount,
        spent: 0,
        remaining: payload.amount,
        utilization_percent: 0
      }
      budgets.push(budget)
      return budget
    },

    listExpenses(filters: ExpenseFilters = {}) {
      let result = expenses.map(enrichExpense)
      if (filters.status) result = result.filter(e => e.status === filters.status)
      if (filters.category) result = result.filter(e => e.category === filters.category)
      if (filters.user_id) result = result.filter(e => e.user.id === filters.user_id)
      if (filters.from_date) result = result.filter(e => e.expense_date >= filters.from_date!)
      if (filters.to_date) result = result.filter(e => e.expense_date <= filters.to_date!)
      return result.sort((a, b) => b.expense_date.localeCompare(a.expense_date))
    },

    getExpense(id: string) {
      const e = expenses.find(x => x.id === id)
      if (!e) throw createError({ statusCode: 404, message: 'Expense not found' })
      return enrichExpense(e)
    },

    createExpense(userId: string, payload: CreateExpensePayload) {
      const cc = payload.cost_center_id ? findCostCenter(payload.cost_center_id) : undefined
      const expense: Expense = {
        id: randomUUID(),
        user: userBriefFromId(userId),
        category: payload.category,
        cost_center_id: payload.cost_center_id,
        cost_center: cc,
        budget_id: payload.budget_id,
        amount: payload.amount,
        currency: payload.currency ?? 'IRR',
        description: payload.description,
        expense_date: payload.expense_date,
        receipt_path: payload.receipt_path,
        status: 'draft',
        created_at: new Date().toISOString()
      }
      expenses.unshift(expense)
      return enrichExpense(expense)
    },

    submitExpense(id: string, userId: string) {
      const e = expenses.find(x => x.id === id)
      if (!e) throw createError({ statusCode: 404, message: 'Expense not found' })
      if (e.user.id !== userId) throw createError({ statusCode: 403, message: 'Forbidden' })
      if (e.status !== 'draft') throw createError({ statusCode: 400, message: 'Invalid status' })
      e.status = 'manager_review'
      return enrichExpense(e)
    },

    approveExpense(id: string, asFinance = false) {
      const e = expenses.find(x => x.id === id)
      if (!e) throw createError({ statusCode: 404, message: 'Expense not found' })
      if (asFinance) {
        if (e.status !== 'finance_review') throw createError({ statusCode: 400, message: 'Invalid status' })
        e.status = 'ready_to_pay'
      } else {
        if (e.status !== 'manager_review') throw createError({ statusCode: 400, message: 'Invalid status' })
        e.status = 'finance_review'
      }
      if (e.budget_id) recalcBudget(e.budget_id)
      return enrichExpense(e)
    },

    rejectExpense(id: string, reason?: string) {
      const e = expenses.find(x => x.id === id)
      if (!e) throw createError({ statusCode: 404, message: 'Expense not found' })
      if (!['manager_review', 'finance_review', 'submitted'].includes(e.status)) {
        throw createError({ statusCode: 400, message: 'Invalid status' })
      }
      e.status = 'rejected'
      e.rejection_reason = reason
      return enrichExpense(e)
    },

    payExpense(id: string) {
      const e = expenses.find(x => x.id === id)
      if (!e) throw createError({ statusCode: 404, message: 'Expense not found' })
      if (e.status !== 'ready_to_pay') throw createError({ statusCode: 400, message: 'Invalid status' })
      e.status = 'paid'
      return enrichExpense(e)
    },

    getExpenseSummary(): ExpenseSummary {
      const pending = expenses.filter(e =>
        ['submitted', 'manager_review', 'finance_review', 'approved', 'ready_to_pay'].includes(e.status)
      )
      return {
        pending_count: pending.length,
        pending_amount: pending.reduce((s, e) => s + e.amount, 0),
        currency: 'IRR'
      }
    },

    getFinanceDashboard(): FinanceDashboardSummary {
      const overdue = invoices.filter(i => invoiceStatus(i) === 'overdue')
      return {
        budget_overview: this.getBudgetOverview(),
        expense_summary: this.getExpenseSummary(),
        overdue_invoices_count: overdue.length,
        overdue_invoices_amount: overdue.reduce((s, i) => s + i.amount, 0),
        payroll_status: getPayrollDashboardStatus(),
        currency: 'IRR'
      }
    },

    listVendors() {
      return vendors.filter(v => v.is_active)
    },

    createVendor(payload: CreateVendorPayload) {
      const vendor: Vendor = {
        id: randomUUID(),
        name: payload.name,
        code: payload.code,
        contact_name: payload.contact_name,
        email: payload.email,
        phone: payload.phone,
        tax_id: payload.tax_id,
        is_active: true
      }
      vendors.push(vendor)
      return vendor
    },

    updateVendor(id: string, payload: Partial<CreateVendorPayload & { is_active: boolean }>) {
      const vendor = vendors.find(v => v.id === id)
      if (!vendor) throw createError({ statusCode: 404, message: 'Vendor not found' })
      Object.assign(vendor, payload)
      return vendor
    },

    listInvoices(filters: InvoiceFilters = {}) {
      let result = invoices.map(i => ({ ...i, status: invoiceStatus(i) }))
      if (filters.status === 'overdue') {
        result = result.filter(i => i.status === 'overdue')
      } else if (filters.status) {
        result = result.filter(i => i.status === filters.status)
      }
      return result.sort((a, b) => b.due_date.localeCompare(a.due_date))
    },

    createInvoice(payload: CreateInvoicePayload) {
      const vendor = findVendor(payload.vendor_id)
      if (!vendor) throw createError({ statusCode: 400, message: 'Vendor not found' })
      const invoice: Invoice = {
        id: randomUUID(),
        vendor,
        invoice_number: payload.invoice_number,
        issue_date: payload.issue_date,
        due_date: payload.due_date,
        amount: payload.amount,
        currency: payload.currency ?? 'IRR',
        status: 'sent',
        description: payload.description
      }
      invoices.unshift(invoice)
      return { ...invoice, status: invoiceStatus(invoice) }
    },

    payInvoice(id: string) {
      const invoice = invoices.find(i => i.id === id)
      if (!invoice) throw createError({ statusCode: 404, message: 'Invoice not found' })
      if (invoiceStatus(invoice) === 'paid') throw createError({ statusCode: 400, message: 'Already paid' })
      invoice.status = 'paid'
      invoice.paid_at = new Date().toISOString()
      return { ...invoice, status: invoiceStatus(invoice) }
    },

    listPurchaseRequests(userId?: string, canViewAll = false) {
      let result = [...purchaseRequests]
      if (!canViewAll && userId) result = result.filter(pr => pr.user.id === userId)
      return result.sort((a, b) => b.created_at.localeCompare(a.created_at))
    },

    createPurchaseRequest(userId: string, payload: CreatePurchaseRequestPayload) {
      const items = normalizeItems(payload.items)
      const pr: PurchaseRequest = {
        id: randomUUID(),
        user: userBriefFromId(userId),
        title: payload.title,
        items,
        total_amount: items.reduce((s, i) => s + i.total, 0),
        currency: payload.currency ?? 'IRR',
        status: 'draft',
        description: payload.description,
        created_at: new Date().toISOString()
      }
      purchaseRequests.unshift(pr)
      return pr
    },

    submitPurchaseRequest(id: string, userId: string) {
      const pr = purchaseRequests.find(x => x.id === id)
      if (!pr) throw createError({ statusCode: 404, message: 'Purchase request not found' })
      if (pr.user.id !== userId) throw createError({ statusCode: 403, message: 'Forbidden' })
      if (pr.status !== 'draft') throw createError({ statusCode: 400, message: 'Invalid status' })
      pr.status = 'owner_review'
      return pr
    },

    ownerReviewPurchaseRequest(id: string, approved: boolean, reason?: string) {
      const pr = purchaseRequests.find(x => x.id === id)
      if (!pr) throw createError({ statusCode: 404, message: 'Purchase request not found' })
      if (!['submitted', 'owner_review'].includes(pr.status)) {
        throw createError({ statusCode: 400, message: 'Invalid status' })
      }
      if (approved) {
        pr.status = 'finance_review'
      } else {
        pr.status = 'rejected'
        pr.rejection_reason = reason
      }
      return pr
    },

    financeReviewPurchaseRequest(id: string, approved: boolean, reason?: string) {
      const pr = purchaseRequests.find(x => x.id === id)
      if (!pr) throw createError({ statusCode: 404, message: 'Purchase request not found' })
      if (pr.status !== 'finance_review') throw createError({ statusCode: 400, message: 'Invalid status' })
      if (approved) {
        pr.status = 'approved'
      } else {
        pr.status = 'rejected'
        pr.rejection_reason = reason
      }
      return pr
    },

    convertPurchaseRequestToOrder(id: string) {
      const pr = purchaseRequests.find(x => x.id === id)
      if (!pr) throw createError({ statusCode: 404, message: 'Purchase request not found' })
      if (pr.status !== 'approved') throw createError({ statusCode: 400, message: 'Invalid status' })
      const po: PurchaseOrder = {
        id: randomUUID(),
        purchase_request_id: pr.id,
        vendor: vendors[1],
        title: pr.title,
        items: pr.items,
        total_amount: pr.total_amount,
        currency: pr.currency,
        status: 'issued',
        created_at: new Date().toISOString()
      }
      purchaseOrders.unshift(po)
      pr.status = 'converted'
      pr.purchase_order_id = po.id
      return po
    },

    listPurchaseOrders() {
      return purchaseOrders.sort((a, b) => b.created_at.localeCompare(a.created_at))
    },

    listPayroll(period?: string) {
      let result = [...payrollRecords]
      if (period) result = result.filter(r => r.period === period)
      return result.sort((a, b) => b.period.localeCompare(a.period))
    },

    getPayrollRecord(id: string) {
      const record = payrollRecords.find(r => r.id === id)
      if (!record) throw createError({ statusCode: 404, message: 'Payroll record not found' })
      return record
    },

    getPayrollDetail(id: string) {
      return payrollToPayslip(this.getPayrollRecord(id))
    },

    calculatePayroll(period: string) {
      const existing = payrollRecords.filter(r => r.period === period)
      if (existing.length) {
        for (const r of existing) {
          if (r.status === 'draft') r.status = 'calculated'
        }
        return payrollRecords.filter(r => r.period === period)
      }
      const templates = [
        { base: 20_500_000, overtime: 3_100_000, housing: 3_000_000 },
        { base: 18_000_000, overtime: 1_200_000, housing: 3_000_000 },
        { base: 16_000_000, overtime: 800_000, housing: 2_500_000 },
        { base: 15_000_000, overtime: 0, housing: 2_500_000 }
      ]
      const created: PayrollRecord[] = []
      users.forEach((u, idx) => {
        const tpl = templates[idx] ?? templates[0]!
        const gross = tpl.base + tpl.overtime + tpl.housing
        const insurance = Math.round(tpl.base * 0.07)
        const tax = Math.round(tpl.base * 0.05)
        const net = gross - insurance - tax
        const record: PayrollRecord = {
          id: randomUUID(),
          user: u,
          period,
          base_salary: tpl.base,
          overtime_amount: tpl.overtime,
          allowances: [{ name: 'حق مسکن', amount: tpl.housing }],
          deductions: [{ name: 'بیمه (۷٪)', amount: insurance }, { name: 'مالیات', amount: tax }],
          gross_amount: gross,
          net_amount: net,
          currency: 'IRR',
          status: 'calculated'
        }
        payrollRecords.push(record)
        created.push(record)
      })
      return created
    },

    approvePayroll(id: string) {
      const record = payrollRecords.find(r => r.id === id)
      if (!record) throw createError({ statusCode: 404, message: 'Payroll record not found' })
      if (record.status !== 'calculated') throw createError({ statusCode: 400, message: 'Invalid status' })
      record.status = 'approved'
      return record
    },

    bulkPayPayroll(ids: string[]) {
      const paid: PayrollRecord[] = []
      for (const id of ids) {
        const record = payrollRecords.find(r => r.id === id)
        if (!record) continue
        if (record.status !== 'approved') continue
        record.status = 'paid'
        paid.push(record)
      }
      return paid
    },

    listMyPayslips(userId: string) {
      if (userId === 'u1' || userId === 'u2') return myPayslips
      return []
    },

    getPayslipDetail(id: string, userId: string) {
      const detail = payslipDetails[id]
      if (!detail) throw createError({ statusCode: 404, message: 'Payslip not found' })
      const allowed = userId === 'u1' || userId === 'u2'
      if (!allowed) throw createError({ statusCode: 403, message: 'Forbidden' })
      return detail
    },

    listMyExpenses(userId: string) {
      return this.listExpenses({ user_id: userId })
    },

    listMyReceipts(userId: string) {
      if (userId === 'u1' || userId === 'u2') return myReceipts
      return []
    }
  }
}

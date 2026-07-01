import { defineStore } from 'pinia'
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
  FinanceDashboardSummary,
  Invoice,
  InvoiceFilters,
  PayrollRecord,
  PurchaseOrder,
  PurchaseRequest,
  Vendor
} from '~/types/phase3'
import { storeApi } from '~/utils/api-client'

export const useFinanceStore = defineStore('finance', () => {
  const dashboard = ref<FinanceDashboardSummary | null>(null)
  const expenses = ref<Expense[]>([])
  const budgets = ref<Budget[]>([])
  const budgetOverview = ref<BudgetOverviewItem[]>([])
  const costCenters = ref<CostCenter[]>([])
  const invoices = ref<Invoice[]>([])
  const vendors = ref<Vendor[]>([])
  const purchaseRequests = ref<PurchaseRequest[]>([])
  const purchaseOrders = ref<PurchaseOrder[]>([])
  const payroll = ref<PayrollRecord[]>([])
  const loading = ref(false)

  async function fetchDashboard() {
    const res = await storeApi<{ data: FinanceDashboardSummary }>('/finance/dashboard')
    dashboard.value = res.data
    return res.data
  }

  async function fetchExpenses(filters: ExpenseFilters = {}) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      if (filters.category) params.set('category', filters.category)
      if (filters.user_id) params.set('user_id', filters.user_id)
      if (filters.from_date) params.set('from_date', filters.from_date)
      if (filters.to_date) params.set('to_date', filters.to_date)
      const qs = params.toString()
      const res = await storeApi<{ data: Expense[] }>(`/finance/expenses${qs ? `?${qs}` : ''}`)
      expenses.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function createExpense(payload: CreateExpensePayload) {
    const res = await storeApi<{ data: Expense }>('/finance/expenses', { method: 'POST', body: payload })
    expenses.value.unshift(res.data)
    return res.data
  }

  async function submitExpense(id: string) {
    const res = await storeApi<{ data: Expense }>(`/finance/expenses/${id}/submit`, { method: 'POST' })
    updateExpenseInList(res.data)
    return res.data
  }

  async function approveExpense(id: string) {
    const res = await storeApi<{ data: Expense }>(`/finance/expenses/${id}/approve`, { method: 'POST' })
    updateExpenseInList(res.data)
    return res.data
  }

  async function rejectExpense(id: string, reason?: string) {
    const res = await storeApi<{ data: Expense }>(`/finance/expenses/${id}/reject`, {
      method: 'POST',
      body: { reason }
    })
    updateExpenseInList(res.data)
    return res.data
  }

  async function payExpense(id: string) {
    const res = await storeApi<{ data: Expense }>(`/finance/expenses/${id}/pay`, { method: 'POST' })
    updateExpenseInList(res.data)
    return res.data
  }

  function updateExpenseInList(expense: Expense) {
    const idx = expenses.value.findIndex(e => e.id === expense.id)
    if (idx >= 0) expenses.value[idx] = expense
  }

  async function fetchBudgets(year?: number) {
    loading.value = true
    try {
      const qs = year ? `?year=${year}` : ''
      const res = await storeApi<{ data: Budget[] }>(`/finance/budgets${qs}`)
      budgets.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchBudgetOverview() {
    const res = await storeApi<{ data: BudgetOverviewItem[] }>('/finance/budgets/overview')
    budgetOverview.value = res.data
    return res.data
  }

  async function createBudget(payload: CreateBudgetPayload) {
    const res = await storeApi<{ data: Budget }>('/finance/budgets', { method: 'POST', body: payload })
    budgets.value.push(res.data)
    return res.data
  }

  async function fetchCostCenters() {
    const res = await storeApi<{ data: CostCenter[] }>('/finance/cost-centers')
    costCenters.value = res.data
    return res.data
  }

  async function fetchInvoices(filters: InvoiceFilters = {}) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      const qs = params.toString()
      const res = await storeApi<{ data: Invoice[] }>(`/finance/invoices${qs ? `?${qs}` : ''}`)
      invoices.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function createInvoice(payload: CreateInvoicePayload) {
    const res = await storeApi<{ data: Invoice }>('/finance/invoices', { method: 'POST', body: payload })
    invoices.value.unshift(res.data)
    return res.data
  }

  async function payInvoice(id: string) {
    const res = await storeApi<{ data: Invoice }>(`/finance/invoices/${id}/pay`, { method: 'POST' })
    const idx = invoices.value.findIndex(i => i.id === id)
    if (idx >= 0) invoices.value[idx] = res.data
    return res.data
  }

  async function fetchVendors() {
    const res = await storeApi<{ data: Vendor[] }>('/finance/vendors')
    vendors.value = res.data
    return res.data
  }

  async function createVendor(payload: CreateVendorPayload) {
    const res = await storeApi<{ data: Vendor }>('/finance/vendors', { method: 'POST', body: payload })
    vendors.value.push(res.data)
    return res.data
  }

  async function fetchPurchaseRequests() {
    loading.value = true
    try {
      const res = await storeApi<{ data: PurchaseRequest[] }>('/finance/purchase-requests')
      purchaseRequests.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function createPurchaseRequest(payload: CreatePurchaseRequestPayload) {
    const res = await storeApi<{ data: PurchaseRequest }>('/finance/purchase-requests', { method: 'POST', body: payload })
    purchaseRequests.value.unshift(res.data)
    return res.data
  }

  async function submitPurchaseRequest(id: string) {
    const res = await storeApi<{ data: PurchaseRequest }>(`/finance/purchase-requests/${id}/submit`, { method: 'POST' })
    updatePurchaseRequestInList(res.data)
    return res.data
  }

  async function ownerReviewPurchaseRequest(id: string, approved: boolean, reason?: string) {
    const res = await storeApi<{ data: PurchaseRequest }>(`/finance/purchase-requests/${id}/owner-review`, {
      method: 'POST',
      body: { approved, reason }
    })
    updatePurchaseRequestInList(res.data)
    return res.data
  }

  async function financeReviewPurchaseRequest(id: string, approved: boolean, reason?: string) {
    const res = await storeApi<{ data: PurchaseRequest }>(`/finance/purchase-requests/${id}/finance-review`, {
      method: 'POST',
      body: { approved, reason }
    })
    updatePurchaseRequestInList(res.data)
    return res.data
  }

  async function convertPurchaseRequest(id: string) {
    const res = await storeApi<{ data: PurchaseOrder }>(`/finance/purchase-requests/${id}/convert-to-po`, { method: 'POST' })
    purchaseOrders.value.unshift(res.data)
    await fetchPurchaseRequests()
    return res.data
  }

  function updatePurchaseRequestInList(pr: PurchaseRequest) {
    const idx = purchaseRequests.value.findIndex(p => p.id === pr.id)
    if (idx >= 0) purchaseRequests.value[idx] = pr
  }

  async function fetchPurchaseOrders() {
    loading.value = true
    try {
      const res = await storeApi<{ data: PurchaseOrder[] }>('/finance/purchase-orders')
      purchaseOrders.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchPayroll(period?: string) {
    loading.value = true
    try {
      const qs = period ? `?period=${period}` : ''
      const res = await storeApi<{ data: PayrollRecord[] }>(`/finance/payroll${qs}`)
      payroll.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function calculatePayroll(period: string) {
    const res = await storeApi<{ data: PayrollRecord[] }>('/finance/payroll/calculate', {
      method: 'POST',
      body: { period }
    })
    payroll.value = res.data
    return res.data
  }

  async function approvePayroll(id: string) {
    const res = await storeApi<{ data: PayrollRecord }>(`/finance/payroll/${id}/approve`, { method: 'POST' })
    updatePayrollInList(res.data)
    return res.data
  }

  async function bulkPayPayroll(ids: string[]) {
    const res = await storeApi<{ data: PayrollRecord[] }>('/finance/payroll/bulk-pay', {
      method: 'POST',
      body: { ids }
    })
    for (const record of res.data) updatePayrollInList(record)
    return res.data
  }

  function updatePayrollInList(record: PayrollRecord) {
    const idx = payroll.value.findIndex(r => r.id === record.id)
    if (idx >= 0) payroll.value[idx] = record
  }

  return {
    dashboard,
    expenses,
    budgets,
    budgetOverview,
    costCenters,
    invoices,
    vendors,
    purchaseRequests,
    purchaseOrders,
    payroll,
    loading,
    fetchDashboard,
    fetchExpenses,
    createExpense,
    submitExpense,
    approveExpense,
    rejectExpense,
    payExpense,
    fetchBudgets,
    fetchBudgetOverview,
    createBudget,
    fetchCostCenters,
    fetchInvoices,
    createInvoice,
    payInvoice,
    fetchVendors,
    createVendor,
    fetchPurchaseRequests,
    createPurchaseRequest,
    submitPurchaseRequest,
    ownerReviewPurchaseRequest,
    financeReviewPurchaseRequest,
    convertPurchaseRequest,
    fetchPurchaseOrders,
    fetchPayroll,
    calculatePayroll,
    approvePayroll,
    bulkPayPayroll
  }
})

<script setup lang="ts">
import type { SaTenant } from '~/types/phase5'

definePageMeta({ layout: 'super-admin', middleware: ['super-admin'] })

const { t } = useI18n()
const toast = useToast()
const saStore = useSuperAdminStore()

const tenants = ref<SaTenant[]>([])
const loading = ref(true)
const search = ref('')
const suspendingId = ref<string | null>(null)

let searchTimer: ReturnType<typeof setTimeout> | null = null

async function load() {
  loading.value = true
  try {
    const query = search.value ? `?search=${encodeURIComponent(search.value)}` : ''
    const res = await saStore.api<{ data: SaTenant[] }>(`/super-admin/tenants${query}`)
    tenants.value = res.data
  } finally {
    loading.value = false
  }
}

function onSearch(value: string) {
  search.value = value
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(load, 300)
}

async function onSuspend(id: string) {
  suspendingId.value = id
  try {
    await saStore.api(`/super-admin/tenants/${id}/suspend`, { method: 'POST' })
    toast.add({ title: t('superAdmin.tenants.suspended'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    suspendingId.value = null
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader
      :title="t('superAdmin.tenants.title')"
      :subtitle="t('superAdmin.tenants.subtitle')"
    />

    <div class="mt-6">
      <SuperAdminSaTenantList
        :tenants="tenants"
        :loading="loading"
        :suspending-id="suspendingId"
        @suspend="onSuspend"
        @update:search="onSearch"
      />
    </div>
  </div>
</template>

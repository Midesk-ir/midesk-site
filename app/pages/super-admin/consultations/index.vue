<script setup lang="ts">
import type { SaConsultation } from '~/types/phase5'

definePageMeta({ layout: 'super-admin', middleware: ['super-admin'] })

const { t } = useI18n()
const toast = useToast()
const saStore = useSuperAdminStore()

const consultations = ref<SaConsultation[]>([])
const loading = ref(true)
const updatingId = ref<string | null>(null)

async function load() {
  loading.value = true
  try {
    const res = await saStore.api<{ data: SaConsultation[] }>('/super-admin/consultations')
    consultations.value = res.data
  } finally {
    loading.value = false
  }
}

async function onStatusUpdate(id: string, status: SaConsultation['status']) {
  updatingId.value = id
  try {
    await saStore.api(`/super-admin/consultations/${id}`, {
      method: 'PATCH',
      body: { status }
    })
    toast.add({ title: t('superAdmin.consultations.statusUpdated'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    updatingId.value = null
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader
      :title="t('superAdmin.consultations.title')"
      :subtitle="t('superAdmin.consultations.subtitle')"
    />

    <div class="mt-6">
      <SuperAdminSaConsultationList
        :consultations="consultations"
        :loading="loading"
        :updating-id="updatingId"
        @update:status="onStatusUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SubscriptionPlan } from '~/types/phase5'

definePageMeta({ layout: 'super-admin', middleware: ['super-admin'] })

const { t } = useI18n()
const toast = useToast()
const saStore = useSuperAdminStore()

const plans = ref<SubscriptionPlan[]>([])
const loading = ref(true)
const saving = ref(false)
const editing = ref<SubscriptionPlan | null>(null)
const showForm = ref(false)

const showModal = computed({
  get: () => showForm.value || editing.value !== null,
  set: (open) => {
    if (!open) {
      showForm.value = false
      editing.value = null
    }
  }
})

async function load() {
  loading.value = true
  try {
    const res = await saStore.api<{ data: SubscriptionPlan[] }>('/super-admin/plans')
    plans.value = res.data
  } finally {
    loading.value = false
  }
}

function onCreate() {
  editing.value = null
  showForm.value = true
}

function onEdit(plan: SubscriptionPlan) {
  editing.value = plan
  showForm.value = false
}

async function onSubmit(payload: Omit<SubscriptionPlan, 'id'> & { id?: string }) {
  saving.value = true
  try {
    if (payload.id) {
      const { id, ...body } = payload
      await saStore.api(`/super-admin/plans/${id}`, { method: 'PATCH', body })
    } else {
      await saStore.api('/super-admin/plans', { method: 'POST', body: payload })
    }
    toast.add({ title: t('superAdmin.plans.saved'), color: 'success' })
    showForm.value = false
    editing.value = null
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}

async function onDelete(id: string) {
  try {
    await saStore.api(`/super-admin/plans/${id}`, { method: 'DELETE' })
    toast.add({ title: t('superAdmin.plans.deleted'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader
      :title="t('superAdmin.plans.title')"
      :subtitle="t('superAdmin.plans.subtitle')"
    />

    <div class="mt-6">
      <SuperAdminSaPlanList
        :plans="plans"
        :loading="loading"
        @create="onCreate"
        @edit="onEdit"
        @delete="onDelete"
      />
    </div>

    <MideskModal
      v-model:open="showModal"
      :title="editing ? t('superAdmin.plans.edit') : t('superAdmin.plans.create')"
    >
      <SuperAdminSaPlanForm
        :initial="editing"
        :saving="saving"
        @submit="onSubmit"
        @cancel="showModal = false"
      />
    </MideskModal>
  </div>
</template>

<script setup lang="ts">
import type { CreatePersonnelPayload, PersonnelDetail } from '~/types/phase2'
import type { User } from '~/types'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const hrStore = useHrStore()
const { api } = useApi()
const { can } = usePermissions()

const detail = ref<PersonnelDetail | null>(null)
const loading = ref(true)
const error = ref(false)
const showEdit = ref(false)
const saving = ref(false)
const users = ref<User[]>([])

const id = computed(() => route.params.id as string)

async function load() {
  loading.value = true
  error.value = false
  try {
    detail.value = await hrStore.fetchPersonnelDetail(id.value)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function loadUsers() {
  if (!can('hr:personnel:update')) return
  try {
    const res = await api<{ data: User[] }>('/members')
    users.value = res.data
  } catch {
    users.value = []
  }
}

async function onUpdate(payload: CreatePersonnelPayload) {
  saving.value = true
  try {
    await hrStore.updatePersonnel(id.value, payload)
    detail.value = await hrStore.fetchPersonnelDetail(id.value)
    showEdit.value = false
    toast.add({ title: t('common.save'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}

watch(id, load)
onMounted(async () => {
  await Promise.all([load(), loadUsers()])
})
</script>

<template>
  <div>
    <LayoutMideskPageHeader
      back-to="/hr/personnel"
      :back-label="t('nav.hr.personnel')"
    >
      <template #title>
        <h1 v-if="detail" class="midesk-page-title">{{ detail.user.name }}</h1>
        <h1 v-else class="midesk-page-title">{{ t('nav.hr.personnel') }}</h1>
      </template>
      <template #actions>
        <LayoutMideskPageHeaderButton
          v-if="detail && can('hr:personnel:update')"
          variant="soft-primary"
          icon="i-lucide-pencil"
          @click="showEdit = true"
        >
          {{ t('common.edit') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="midesk-skeleton-card h-32" />
      <USkeleton class="midesk-skeleton-card h-64" />
    </div>

    <UiEmptyState
      v-else-if="error || !detail"
      :title="t('common.error')"
      icon="i-lucide-circle-alert"
    >
      <template #action>
        <UButton color="primary" @click="load">{{ t('common.retry') }}</UButton>
      </template>
    </UiEmptyState>

    <HrPersonnelProfile v-else :detail="detail" />

    <MideskModal v-model:open="showEdit" :title="t('common.edit')">
      <HrPersonnelForm
        v-if="detail"
        :initial="detail"
        :users="users"
        :loading="saving"
        @submit="onUpdate"
      />
    </MideskModal>
  </div>
</template>

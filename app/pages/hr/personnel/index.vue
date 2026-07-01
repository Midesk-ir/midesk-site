<script setup lang="ts">
import type { CreatePersonnelPayload, Personnel, PersonnelFilters } from '~/types/phase2'
import type { User } from '~/types'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const { api } = useApi()
const toast = useToast()
const hrStore = useHrStore()
const { can } = usePermissions()

const showCreate = ref(false)
const creating = ref(false)
const showDeleteConfirm = ref(false)
const deleteTargetId = ref<string | null>(null)
const users = ref<User[]>([])
const filters = ref<PersonnelFilters>({})

async function loadUsers() {
  if (!can('hr:personnel:create')) return
  try {
    const res = await api<{ data: User[] }>('/members')
    users.value = res.data
  } catch {
    users.value = []
  }
}

async function loadPersonnel() {
  await hrStore.fetchPersonnel(filters.value)
}

watch(filters, loadPersonnel, { deep: true })

async function onCreate(payload: CreatePersonnelPayload) {
  creating.value = true
  try {
    await hrStore.createPersonnel(payload)
    showCreate.value = false
    toast.add({ title: t('common.create'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    creating.value = false
  }
}

function onEdit(person: Personnel) {
  navigateTo(`/hr/personnel/${person.id}`)
}

function onDelete(id: string) {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (!deleteTargetId.value) return
  try {
    await hrStore.deletePersonnel(deleteTargetId.value)
    toast.add({ title: t('common.delete'), color: 'success' })
    showDeleteConfirm.value = false
    deleteTargetId.value = null
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(async () => {
  await Promise.all([loadPersonnel(), loadUsers()])
})
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <h1 class="midesk-page-title">{{ t('nav.hr.personnel') }}</h1>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton
          v-if="can('hr:personnel:create')"
          variant="primary"
          icon="i-lucide-user-plus"
          @click="showCreate = true"
        >
          {{ t('common.create') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <HrPersonnelList
      :personnel="hrStore.personnel"
      :loading="hrStore.loading"
      @edit="onEdit"
      @delete="onDelete"
      @update:filters="filters = $event"
    />

    <MideskModal v-model:open="showCreate" :title="t('hr.personnel.title')">
      <HrPersonnelForm :users="users" :loading="creating" @submit="onCreate" />
    </MideskModal>

    <MideskModal v-model:open="showDeleteConfirm" :title="t('common.delete')">
      <p class="text-sm text-[var(--color-midesk-muted)]">{{ t('hr.personnel.deleteConfirm') }}</p>
      <template #footer>
        <UButton variant="ghost" @click="showDeleteConfirm = false">{{ t('common.cancel') }}</UButton>
        <UButton color="error" @click="confirmDelete">{{ t('common.delete') }}</UButton>
      </template>
    </MideskModal>
  </div>
</template>

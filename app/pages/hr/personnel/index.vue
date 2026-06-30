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
  try {
    await hrStore.createPersonnel(payload)
    showCreate.value = false
    toast.add({ title: t('common.create'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

function onEdit(person: Personnel) {
  navigateTo(`/hr/personnel/${person.id}`)
}

async function onDelete(id: string) {
  try {
    await hrStore.deletePersonnel(id)
    toast.add({ title: t('common.delete'), color: 'success' })
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
      <UButton
        v-if="can('hr:personnel:create')"
        icon="i-lucide-user-plus"
        color="primary"
        class="shrink-0"
        @click="showCreate = true"
      >
        {{ t('common.create') }}
      </UButton>
    </div>

    <HrPersonnelList
      :personnel="hrStore.personnel"
      :loading="hrStore.loading"
      @edit="onEdit"
      @delete="onDelete"
      @update:filters="filters = $event"
    />

    <MideskModal v-model:open="showCreate" :title="t('hr.personnel.title')">
      <HrPersonnelForm :users="users" @submit="onCreate" />
    </MideskModal>
  </div>
</template>

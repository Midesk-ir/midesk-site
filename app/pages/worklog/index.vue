<script setup lang="ts">
import type { Worklog } from '~/types/phase1'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const authStore = useAuthStore()
const worklogStore = useWorklogStore()
const toast = useToast()

const editing = ref<Worklog | null>(null)
const deletingId = ref<string | null>(null)

const monthMinutes = computed(() => {
  const prefix = new Date().toISOString().slice(0, 7)
  return worklogStore.myWorklogs
    .filter(w => w.logged_date.startsWith(prefix))
    .reduce((sum, w) => sum + w.duration_minutes, 0)
})

async function load() {
  await Promise.all([
    worklogStore.fetchMy(),
    worklogStore.fetchWeekSummary()
  ])
}

function onEdit(worklog: Worklog) {
  editing.value = worklog
}

function onSaved() {
  editing.value = null
}

async function onDelete(id: string) {
  deletingId.value = id
  try {
    await worklogStore.remove(id)
    await worklogStore.fetchWeekSummary()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    deletingId.value = null
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('worklog.title')">
      <template #actions>
        <LayoutMideskPageHeaderButton
          v-if="['OWNER', 'ADMIN', 'MANAGER'].includes(authStore.user?.role ?? '')"
          to="/worklog/team"
          variant="soft-primary"
          icon="i-lucide-users"
        >
          {{ t('worklog.team.title') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="space-y-6">
        <WorklogForm
          :worklog="editing"
          @saved="onSaved"
          @cancel="editing = null"
        />
        <WorklogTable
          :worklogs="worklogStore.myWorklogs"
          :loading="worklogStore.loading"
          @edit="onEdit"
          @delete="onDelete"
        />
      </div>
      <WorklogSummary
        :week-summary="worklogStore.weekSummary"
        :month-minutes="monthMinutes"
      />
    </div>
  </div>
</template>

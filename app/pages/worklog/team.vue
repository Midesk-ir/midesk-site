<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'manager'] })

const { t } = useI18n()
const worklogStore = useWorklogStore()

async function load() {
  await worklogStore.fetchTeam()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <div>
        <h1 class="midesk-page-title">{{ t('worklog.team.title') }}</h1>
      </div>
      <UButton to="/worklog" variant="ghost" icon="i-lucide-arrow-right" class="shrink-0">
        {{ t('worklog.title') }}
      </UButton>
    </div>

    <WorklogTable
      :worklogs="worklogStore.teamWorklogs"
      :loading="worklogStore.loading"
      show-member
    />
  </div>
</template>

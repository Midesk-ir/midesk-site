<script setup lang="ts">
import type { CreateMissionPayload, Mission } from '~/types/phase2'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const { api } = useApi()
const toast = useToast()
const { can } = usePermissions()

const myMissions = ref<Mission[]>([])
const allMissions = ref<Mission[]>([])
const loading = ref(true)

const showAll = computed(() => can('hr:missions:approve') || can('hr:missions:view'))

async function load() {
  loading.value = true
  try {
    const tasks: Promise<unknown>[] = [
      api<{ data: Mission[] }>('/hr/missions/my').then(r => { myMissions.value = r.data })
    ]
    if (showAll.value) {
      tasks.push(
        api<{ data: Mission[] }>('/hr/missions').then(r => { allMissions.value = r.data })
      )
    }
    await Promise.all(tasks)
  } finally {
    loading.value = false
  }
}

async function onSubmit(payload: CreateMissionPayload) {
  try {
    await api('/hr/missions', { method: 'POST', body: payload })
    toast.add({ title: t('hr.missions.submit'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onApprove(id: string) {
  try {
    await api(`/hr/missions/${id}/approve`, { method: 'PATCH' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onReject(id: string) {
  try {
    await api(`/hr/missions/${id}/reject`, { method: 'PATCH' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(load)
</script>

<template>
  <div>
    <h1 class="midesk-page-title mb-6">{{ t('nav.hr.missions') }}</h1>

    <div class="space-y-6">
      <section
        v-if="can('hr:missions:request')"
        class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5"
      >
        <h2 class="midesk-card-header">{{ t('hr.missions.newRequest') }}</h2>
        <HrMissionForm @submit="onSubmit" />
      </section>

      <section>
        <h2 class="midesk-card-header">{{ t('hr.missions.myMissions') }}</h2>
        <HrMissionList :missions="myMissions" :loading="loading" />
      </section>

      <section v-if="showAll">
        <h2 class="midesk-card-header">{{ t('hr.missions.allMissions') }}</h2>
        <HrMissionList
          :missions="allMissions"
          :loading="loading"
          @approve="onApprove"
          @reject="onReject"
        />
      </section>
    </div>
  </div>
</template>

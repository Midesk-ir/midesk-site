<script setup lang="ts">
import type { BurndownData, CfdReport, Sprint, VelocityReport } from '~/types/phase1'

definePageMeta({ middleware: ['auth', 'tenant'] })

const route = useRoute()
const { t } = useI18n()
const { api } = useApi()
const sprintStore = useSprintStore()

const projectId = inject<ComputedRef<string>>('projectId', computed(() => route.params.id as string))
const tab = ref('burndown')
const pageLoading = ref(true)

const sprints = ref<Sprint[]>([])
const selectedSprintId = ref<string | undefined>(undefined)

const burndown = ref<BurndownData | null>(null)
const velocity = ref<VelocityReport | null>(null)
const cfd = ref<CfdReport | null>(null)

const burndownLoading = ref(false)
const velocityLoading = ref(false)
const cfdLoading = ref(false)

const tabItems = computed(() => [
  { label: t('reports.tabs.burndown'), value: 'burndown' },
  { label: t('reports.tabs.velocity'), value: 'velocity' },
  { label: t('reports.tabs.cfd'), value: 'cfd' }
])

const sprintOptions = computed(() =>
  sprints.value
    .filter(s => s.status !== 'planning')
    .map(s => ({ label: s.name, value: s.id }))
)

async function loadProject() {
  pageLoading.value = true
  try {
    await sprintStore.fetchSprints(projectId.value)
    sprints.value = sprintStore.sprints
    selectedSprintId.value =
      sprintStore.activeSprint?.id
      ?? sprints.value.find(s => s.status !== 'planning')?.id
      ?? undefined
  } finally {
    pageLoading.value = false
  }
}

async function loadBurndown() {
  if (!selectedSprintId.value) {
    burndown.value = null
    return
  }
  burndownLoading.value = true
  try {
    const data = await api<{ data: BurndownData }>(
      `/sprints/${selectedSprintId.value}/report/burndown`
    )
    burndown.value = data.data
  } catch {
    burndown.value = null
  } finally {
    burndownLoading.value = false
  }
}

async function loadVelocity() {
  velocityLoading.value = true
  try {
    const data = await api<{ data: VelocityReport }>(
      `/projects/${projectId.value}/report/velocity`
    )
    velocity.value = data.data
  } catch {
    velocity.value = null
  } finally {
    velocityLoading.value = false
  }
}

async function loadCfd() {
  cfdLoading.value = true
  try {
    const data = await api<{ data: CfdReport }>(
      `/projects/${projectId.value}/report/cfd`
    )
    cfd.value = data.data
  } catch {
    cfd.value = null
  } finally {
    cfdLoading.value = false
  }
}

watch(tab, (v) => {
  if (v === 'burndown') loadBurndown()
  else if (v === 'velocity') loadVelocity()
  else if (v === 'cfd') loadCfd()
}, { immediate: false })

watch(selectedSprintId, () => {
  if (tab.value === 'burndown') loadBurndown()
})

onMounted(async () => {
  await loadProject()
  await Promise.all([loadBurndown(), loadVelocity(), loadCfd()])
})
</script>

<template>
  <div>
    <div v-if="pageLoading">
      <USkeleton class="mb-4 h-10 w-1/3" />
      <USkeleton class="h-96 w-full" />
    </div>

    <template v-else>
      <LayoutMideskPageHeader :title="t('reports.title')" />

      <UTabs v-model="tab" :items="tabItems" :content="false" class="mb-6" />

      <section class="midesk-card p-5">
        <div v-if="tab === 'burndown'" class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="midesk-card-header mb-0">{{ t('reports.burndown') }}</h2>
            <USelect
              v-if="sprintOptions.length"
              v-model="selectedSprintId"
              :items="sprintOptions"
              :placeholder="t('sprint.selectSprint')"
              class="w-full sm:w-56"
            />
          </div>
          <ReportsBurndownChart :data="burndown" :loading="burndownLoading" />
        </div>

        <div v-else-if="tab === 'velocity'">
          <h2 class="midesk-card-header">{{ t('reports.velocity') }}</h2>
          <ReportsVelocityChart :data="velocity" :loading="velocityLoading" />
        </div>

        <div v-else>
          <h2 class="midesk-card-header">{{ t('reports.cfd') }}</h2>
          <ReportsCfdChart :data="cfd" :loading="cfdLoading" />
        </div>
      </section>
    </template>
  </div>
</template>

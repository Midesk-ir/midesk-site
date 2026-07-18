<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import type {
  SystemCheckCatalog,
  SystemCheckFlowRunResult,
  SystemCheckHealth,
  SystemCheckModuleRunResult,
  SystemCheckProbeResult
} from '~/types/system-check'

const { t } = useI18n()
const saStore = useSuperAdminStore()
const toast = useToast()

const tab = ref<'overview' | 'modules' | 'flows' | 'explorer'>('overview')
const loading = ref(true)
const running = ref(false)

const catalog = ref<SystemCheckCatalog | null>(null)
const health = ref<SystemCheckHealth | null>(null)
const selectedModule = ref<string | null>(null)
const moduleResult = ref<SystemCheckModuleRunResult | null>(null)
const flowResults = ref<SystemCheckFlowRunResult[]>([])
const probeResults = ref<SystemCheckProbeResult[]>([])
const search = ref('')
const explorerMethod = ref('GET')
const explorerPath = ref('/dashboard/summary')

const credentials = useLocalStorage('midesk_sa_system_check_creds', {
  email: 'admin@midesk.io',
  password: 'password'
})

const groupedModules = computed(() => {
  if (!catalog.value) return []
  const groups = new Map<string, typeof catalog.value.modules>()
  for (const mod of catalog.value.modules) {
    const list = groups.get(mod.group) ?? []
    list.push(mod)
    groups.set(mod.group, list)
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
})

const filteredEndpoints = computed(() => {
  if (!catalog.value) return []
  const q = search.value.trim().toLowerCase()
  return catalog.value.endpoints.filter((endpoint) => {
    if (!q) return true
    return endpoint.path.toLowerCase().includes(q)
      || endpoint.method.toLowerCase().includes(q)
      || endpoint.module.toLowerCase().includes(q)
  })
})

const flowStats = computed(() => {
  const total = flowResults.value.length
  const passed = flowResults.value.filter(flow => flow.status === 'pass').length
  return { total, passed, failed: total - passed }
})

function groupLabel(group: string) {
  return t(`superAdmin.systemCheck.groups.${group}`, group)
}

function statusColor(status: string) {
  if (status === 'pass') return 'success'
  if (status === 'fail') return 'error'
  if (status === 'skip') return 'neutral'
  return 'warning'
}

function methodColor(method: string) {
  const map: Record<string, string> = {
    GET: 'info',
    POST: 'success',
    PATCH: 'warning',
    PUT: 'warning',
    DELETE: 'error'
  }
  return map[method] ?? 'neutral'
}

async function loadCatalog() {
  loading.value = true
  try {
    const [catalogRes, healthRes] = await Promise.all([
      saStore.api<{ data: SystemCheckCatalog }>('/super-admin/system-check/catalog'),
      saStore.api<SystemCheckHealth>('/super-admin/system-check/health')
    ])
    catalog.value = catalogRes.data
    health.value = healthRes
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

async function runModule(moduleId: string) {
  selectedModule.value = moduleId
  running.value = true
  moduleResult.value = null
  try {
    const res = await saStore.api<{ data: SystemCheckModuleRunResult }>('/super-admin/system-check/run-module', {
      method: 'POST',
      body: { module: moduleId, credentials: credentials.value }
    })
    moduleResult.value = res.data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    running.value = false
  }
}

async function runFlow(flowId: string) {
  running.value = true
  try {
    const res = await saStore.api<{ data: SystemCheckFlowRunResult }>('/super-admin/system-check/run-flow', {
      method: 'POST',
      body: { flowId, credentials: credentials.value }
    })
    flowResults.value = [
      res.data,
      ...flowResults.value.filter(item => item.flowId !== flowId)
    ]
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    running.value = false
  }
}

async function runAllFlows() {
  running.value = true
  try {
    const res = await saStore.api<{ data: SystemCheckFlowRunResult[] }>('/super-admin/system-check/run-all-flows', {
      method: 'POST',
      body: { credentials: credentials.value }
    })
    flowResults.value = res.data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    running.value = false
  }
}

async function runExplorerProbe() {
  running.value = true
  try {
    const res = await saStore.api<{ data: SystemCheckProbeResult }>('/super-admin/system-check/probe', {
      method: 'POST',
      body: {
        method: explorerMethod.value,
        path: explorerPath.value,
        auth: explorerPath.value.startsWith('/super-admin') ? 'super-admin' : 'tenant',
        credentials: credentials.value
      }
    })
    probeResults.value = [res.data, ...probeResults.value].slice(0, 30)
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    running.value = false
  }
}

onMounted(loadCatalog)
</script>

<template>
  <div class="space-y-6 pb-6">
    <div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
      <div class="midesk-sa-check-credentials rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p class="text-sm font-semibold text-[var(--color-midesk-text)]">
          {{ t('superAdmin.systemCheck.credentials.title') }}
        </p>
        <p class="mt-1 text-xs text-[var(--color-midesk-muted)]">
          {{ t('superAdmin.systemCheck.credentials.hint') }}
        </p>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <UInput v-model="credentials.email" :placeholder="t('superAdmin.systemCheck.credentials.email')" icon="i-lucide-mail" />
          <UInput v-model="credentials.password" type="password" :placeholder="t('superAdmin.systemCheck.credentials.password')" icon="i-lucide-lock" />
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton color="neutral" variant="outline" icon="i-lucide-refresh-cw" :loading="loading" @click="loadCatalog">
          {{ t('superAdmin.systemCheck.actions.refresh') }}
        </UButton>
        <UButton color="primary" icon="i-lucide-play" :loading="running" @click="runAllFlows">
          {{ t('superAdmin.systemCheck.actions.runAllFlows') }}
        </UButton>
      </div>
    </div>

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <USkeleton v-for="i in 4" :key="i" class="h-24 rounded-2xl" />
    </div>

    <div v-else-if="health" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <div class="midesk-sa-check-stat">
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('superAdmin.systemCheck.health.backend') }}</p>
        <div class="mt-2 flex items-center gap-2">
          <UBadge :color="health.backend.ok ? 'success' : 'error'" variant="subtle">
            {{ health.backend.ok ? t('superAdmin.systemCheck.health.up') : t('superAdmin.systemCheck.health.down') }}
          </UBadge>
          <span class="text-xs text-[var(--color-midesk-muted)]">{{ t('superAdmin.systemCheck.health.latency', { ms: health.backend.latencyMs }) }}</span>
        </div>
      </div>
      <div class="midesk-sa-check-stat">
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('superAdmin.systemCheck.health.siteApi') }}</p>
        <div class="mt-2 flex items-center gap-2">
          <UBadge :color="health.site.ok ? 'success' : 'error'" variant="subtle">
            {{ health.site.ok ? t('superAdmin.systemCheck.health.up') : t('superAdmin.systemCheck.health.down') }}
          </UBadge>
          <span class="text-xs text-[var(--color-midesk-muted)]">{{ t('superAdmin.systemCheck.health.latency', { ms: health.site.latencyMs }) }}</span>
        </div>
      </div>
      <div class="midesk-sa-check-stat">
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('superAdmin.systemCheck.health.endpoints') }}</p>
        <p class="mt-2 text-2xl font-bold">{{ health.catalog.endpointCount }}</p>
      </div>
      <div class="midesk-sa-check-stat">
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('superAdmin.systemCheck.health.flows') }}</p>
        <p class="mt-2 text-2xl font-bold">{{ health.catalog.flowCount }}</p>
      </div>
      <div class="midesk-sa-check-stat">
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('superAdmin.systemCheck.health.modules') }}</p>
        <p class="mt-2 text-2xl font-bold">{{ health.catalog.moduleCount }}</p>
      </div>
    </div>

    <UTabs
      v-model="tab"
      :content="false"
      :items="[
        { label: t('superAdmin.systemCheck.tabs.overview'), value: 'overview' },
        { label: t('superAdmin.systemCheck.tabs.modules'), value: 'modules' },
        { label: t('superAdmin.systemCheck.tabs.flows'), value: 'flows' },
        { label: t('superAdmin.systemCheck.tabs.explorer'), value: 'explorer' }
      ]"
    />

    <div v-if="tab === 'overview' && catalog" class="space-y-4">
      <div v-if="flowResults.length" class="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div class="mb-3 flex items-center justify-between gap-3">
          <h3 class="font-semibold">{{ t('superAdmin.systemCheck.tabs.flows') }}</h3>
          <UBadge :color="flowStats.failed ? 'warning' : 'success'" variant="subtle">
            {{ flowStats.passed }}/{{ flowStats.total }}
          </UBadge>
        </div>
        <div class="space-y-2">
          <div
            v-for="flow in flowResults"
            :key="flow.flowId"
            class="flex items-center justify-between gap-3 rounded-xl border border-white/6 bg-black/20 px-3 py-2"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium">{{ flow.label }}</p>
              <p class="text-xs text-[var(--color-midesk-muted)]">{{ flow.module }} · {{ flow.durationMs }}ms</p>
            </div>
            <UBadge :color="statusColor(flow.status)" variant="subtle">{{ flow.status }}</UBadge>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-[var(--color-midesk-muted)]">{{ t('superAdmin.systemCheck.results.empty') }}</p>
    </div>

    <div v-else-if="tab === 'modules' && catalog" class="space-y-6">
      <section v-for="[group, modules] in groupedModules" :key="group">
        <h3 class="mb-3 text-sm font-semibold text-[var(--color-midesk-muted)]">{{ groupLabel(group) }}</h3>
        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="mod in modules"
            :key="mod.id"
            class="midesk-sa-check-module rounded-2xl border border-white/10 bg-white/[0.02] p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <UIcon :name="mod.icon" class="size-5" />
                </div>
                <div>
                  <h4 class="font-semibold">{{ mod.label }}</h4>
                  <p class="text-xs text-[var(--color-midesk-muted)]">
                    {{ t('superAdmin.systemCheck.modules.endpoints', { count: mod.endpointCount }) }}
                    ·
                    {{ t('superAdmin.systemCheck.modules.flows', { count: mod.flowCount }) }}
                  </p>
                </div>
              </div>
              <UButton
                size="xs"
                color="primary"
                variant="soft"
                icon="i-lucide-play"
                :loading="running && selectedModule === mod.id"
                @click="runModule(mod.id)"
              >
                {{ t('superAdmin.systemCheck.actions.runModule') }}
              </UButton>
            </div>
            <div v-if="mod.pages.length" class="mt-3 flex flex-wrap gap-1.5">
              <NuxtLink
                v-for="page in mod.pages"
                :key="page"
                :to="page"
                class="rounded-md bg-white/5 px-2 py-1 text-[11px] text-[var(--color-midesk-muted)] hover:text-[var(--color-midesk-text)]"
              >
                {{ page }}
              </NuxtLink>
            </div>
          </article>
        </div>
      </section>

      <div v-if="moduleResult" class="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <h3 class="font-semibold">{{ moduleResult.label }}</h3>
          <UBadge color="success" variant="subtle">{{ t('superAdmin.systemCheck.modules.passed') }}: {{ moduleResult.passed }}</UBadge>
          <UBadge color="error" variant="subtle">{{ t('superAdmin.systemCheck.modules.failed') }}: {{ moduleResult.failed }}</UBadge>
          <UBadge color="neutral" variant="subtle">{{ t('superAdmin.systemCheck.modules.skipped') }}: {{ moduleResult.skipped }}</UBadge>
        </div>
        <div class="space-y-2">
          <div
            v-for="(probe, index) in moduleResult.probes"
            :key="`${probe.method}-${probe.path}-${index}`"
            class="flex items-center justify-between gap-3 rounded-lg bg-black/20 px-3 py-2 text-sm"
          >
            <div class="flex min-w-0 items-center gap-2">
              <UBadge :color="methodColor(probe.method)" variant="subtle" class="shrink-0">{{ probe.method }}</UBadge>
              <code class="truncate text-xs">{{ probe.path }}</code>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <span class="text-xs text-[var(--color-midesk-muted)]">{{ probe.durationMs }}ms</span>
              <UBadge :color="statusColor(probe.status)" variant="subtle">{{ probe.status }}</UBadge>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="tab === 'flows' && catalog" class="space-y-3">
      <article
        v-for="flow in catalog.flows"
        :key="flow.id"
        class="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 class="font-semibold">{{ flow.label }}</h4>
            <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">{{ flow.description }}</p>
            <p class="mt-2 text-xs text-[var(--color-midesk-muted)]">
              {{ flow.module }} · {{ t('superAdmin.systemCheck.flows.steps', { count: flow.steps.length }) }}
            </p>
            <div v-if="flow.pages.length" class="mt-2 flex flex-wrap gap-1.5">
              <span class="text-[11px] text-[var(--color-midesk-muted)]">{{ t('superAdmin.systemCheck.flows.relatedPages') }}:</span>
              <NuxtLink
                v-for="page in flow.pages"
                :key="page"
                :to="page"
                class="rounded-md bg-white/5 px-2 py-0.5 text-[11px] hover:text-[var(--color-midesk-text)]"
              >
                {{ page }}
              </NuxtLink>
            </div>
          </div>
          <UButton
            size="sm"
            color="primary"
            icon="i-lucide-play"
            :loading="running"
            @click="runFlow(flow.id)"
          >
            {{ t('superAdmin.systemCheck.actions.runFlow') }}
          </UButton>
        </div>

        <div
          v-if="flowResults.find(item => item.flowId === flow.id)"
          class="mt-4 space-y-2 border-t border-white/6 pt-4"
        >
          <div
            v-for="step in flowResults.find(item => item.flowId === flow.id)?.steps ?? []"
            :key="step.stepId"
            class="flex items-center justify-between gap-3 rounded-lg bg-black/20 px-3 py-2 text-sm"
          >
            <div class="min-w-0">
              <p class="font-medium">{{ step.label }}</p>
              <p class="truncate text-xs text-[var(--color-midesk-muted)]">{{ step.method }} {{ step.path }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="step.httpStatus" class="text-xs text-[var(--color-midesk-muted)]">{{ step.httpStatus }}</span>
              <UBadge :color="statusColor(step.status)" variant="subtle">{{ step.status }}</UBadge>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div v-else-if="tab === 'explorer' && catalog" class="space-y-4">
      <div class="grid gap-3 md:grid-cols-[120px_1fr_auto]">
        <USelect
          v-model="explorerMethod"
          :items="['GET', 'POST', 'PATCH', 'PUT', 'DELETE']"
        />
        <UInput v-model="explorerPath" placeholder="/dashboard/summary" />
        <UButton color="primary" icon="i-lucide-send" :loading="running" @click="runExplorerProbe">
          {{ t('superAdmin.systemCheck.actions.runProbe') }}
        </UButton>
      </div>

      <UInput v-model="search" :placeholder="t('superAdmin.systemCheck.explorer.search')" icon="i-lucide-search" />

      <div class="overflow-x-auto rounded-2xl border border-white/10">
        <table class="w-full min-w-[48rem] text-sm">
          <thead class="bg-[var(--color-midesk-surface)] text-[var(--color-midesk-muted)]">
            <tr>
              <th class="px-3 py-2 text-start">{{ t('superAdmin.systemCheck.explorer.method') }}</th>
              <th class="px-3 py-2 text-start">{{ t('superAdmin.systemCheck.explorer.path') }}</th>
              <th class="px-3 py-2 text-start">{{ t('superAdmin.systemCheck.explorer.module') }}</th>
              <th class="px-3 py-2 text-end" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="endpoint in filteredEndpoints"
              :key="`${endpoint.method}-${endpoint.path}`"
              class="border-t border-white/5 hover:bg-white/[0.03]"
            >
              <td class="px-3 py-2">
                <UBadge :color="methodColor(endpoint.method)" variant="subtle">{{ endpoint.method }}</UBadge>
              </td>
              <td class="px-3 py-2">
                <button
                  type="button"
                  class="text-start font-mono text-xs hover:text-red-400"
                  @click="explorerMethod = endpoint.method; explorerPath = endpoint.path"
                >
                  {{ endpoint.path }}
                </button>
              </td>
              <td class="px-3 py-2 text-[var(--color-midesk-muted)]">{{ endpoint.module }}</td>
              <td class="px-3 py-2 text-end">
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-play"
                  :loading="running"
                  @click="explorerMethod = endpoint.method; explorerPath = endpoint.path; runExplorerProbe()"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="probeResults.length" class="space-y-2">
        <div
          v-for="(probe, index) in probeResults"
          :key="`${probe.method}-${probe.path}-${index}`"
          class="rounded-xl border border-white/8 bg-black/20 p-3"
        >
          <div class="flex flex-wrap items-center gap-2">
            <UBadge :color="methodColor(probe.method)" variant="subtle">{{ probe.method }}</UBadge>
            <code class="text-xs">{{ probe.path }}</code>
            <UBadge :color="statusColor(probe.status)" variant="subtle">{{ probe.status }}</UBadge>
            <span class="text-xs text-[var(--color-midesk-muted)]">{{ probe.durationMs }}ms</span>
          </div>
          <p v-if="probe.message" class="mt-2 text-xs text-red-400">{{ probe.message }}</p>
          <pre v-if="probe.preview" class="mt-2 max-h-32 overflow-auto rounded-lg bg-black/30 p-2 text-[11px] text-[var(--color-midesk-muted)]">{{ probe.preview }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.midesk-sa-check-stat,
.midesk-sa-check-module {
  backdrop-filter: blur(12px);
}
.midesk-sa-check-stat {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
}
</style>

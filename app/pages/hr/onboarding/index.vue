<script setup lang="ts">
import type { OnboardingProgress, OnboardingStep, OnboardingTemplate } from '~/types/phase2'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const { api } = useApi()
const { can } = usePermissions()
const route = useRoute()

const canManageTemplate = computed(() => can('hr:onboarding:manage'))
const canViewProgress = computed(() => can('hr:onboarding:view'))

const templates = ref<OnboardingTemplate[]>([])
const onboardings = ref<OnboardingProgress[]>([])
const selectedTemplate = ref<OnboardingTemplate | null>(null)
const selectedProgress = ref<OnboardingProgress | null>(null)
const progressSteps = ref<OnboardingStep[]>([])
const loading = ref(true)

const activeInProgressCount = computed(() =>
  onboardings.value.filter(o => o.status === 'in_progress').length
)

const tabItems = computed(() => {
  const items: { label: string, value: string, icon: string, badge?: number }[] = []
  if (canManageTemplate.value) {
    items.push({
      label: t('onboarding.hrTabs.template'),
      value: 'template',
      icon: 'i-lucide-list-tree'
    })
  }
  if (canViewProgress.value) {
    items.push({
      label: t('onboarding.hrTabs.employees'),
      value: 'employees',
      icon: 'i-lucide-users',
      badge: activeInProgressCount.value || undefined
    })
  }
  return items
})

const activeTab = ref('template')

watch(tabItems, (items) => {
  const fromQuery = route.query.tab as string | undefined
  if (fromQuery && items.some(i => i.value === fromQuery)) {
    activeTab.value = fromQuery
    return
  }
  if (!items.some(i => i.value === activeTab.value)) {
    activeTab.value = items[0]?.value ?? 'employees'
  }
}, { immediate: true })

async function load() {
  loading.value = true
  try {
    const tasks: Promise<unknown>[] = []
    if (canViewProgress.value) {
      tasks.push(
        api<{ data: OnboardingProgress[] }>('/hr/onboarding/progress').then(r => {
          onboardings.value = r.data
          if (selectedProgress.value) {
            selectedProgress.value = r.data.find(o => o.id === selectedProgress.value!.id) ?? null
          }
        }),
        api<{ data: OnboardingTemplate[] }>('/hr/onboarding/templates').then(r => {
          templates.value = r.data
          if (!selectedTemplate.value && templates.value.length) {
            selectedTemplate.value = templates.value[0]!
          }
        })
      )
    }
    await Promise.all(tasks)
  } finally {
    loading.value = false
  }
}

function onSelectProgress(item: OnboardingProgress) {
  selectedProgress.value = item
  const template = templates.value.find(tpl => tpl.id === item.template_id)
  progressSteps.value = template
    ? [...template.steps].sort((a, b) => a.order_index - b.order_index)
    : []
}

function onCompleteStep(stepId: string) {
  if (!selectedProgress.value) return
  if (!selectedProgress.value.completed_steps.includes(stepId)) {
    selectedProgress.value.completed_steps.push(stepId)
  }
  if (selectedProgress.value.completed_steps.length >= selectedProgress.value.total_steps) {
    selectedProgress.value.status = 'completed'
  }
  void load()
}

function onTemplateSaved(template: OnboardingTemplate) {
  const idx = templates.value.findIndex(tpl => tpl.id === template.id)
  if (idx >= 0) templates.value[idx] = template
  if (selectedTemplate.value?.id === template.id) {
    selectedTemplate.value = template
  }
  if (selectedProgress.value?.template_id === template.id) {
    progressSteps.value = [...template.steps].sort((a, b) => a.order_index - b.order_index)
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('nav.hr.onboarding')" />

    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-10 w-64 rounded-lg" />
      <USkeleton class="midesk-skeleton-card h-48" />
      <USkeleton class="midesk-skeleton-card h-64" />
    </div>

    <UiEmptyState
      v-else-if="!tabItems.length"
      :title="t('common.error')"
      icon="i-lucide-shield-alert"
    />

    <div v-else class="space-y-6">
      <UTabs v-model="activeTab" :items="tabItems" :content="false" class="w-full" />

      <div v-if="activeTab === 'template' && canManageTemplate">
        <div v-if="templates.length > 1" class="mb-4 flex flex-wrap gap-2">
          <UButton
            v-for="tpl in templates"
            :key="tpl.id"
            size="sm"
            :variant="selectedTemplate?.id === tpl.id ? 'solid' : 'soft'"
            color="primary"
            @click="selectedTemplate = tpl"
          >
            {{ tpl.name }}
          </UButton>
        </div>

        <OnboardingTemplateEditor
          v-if="selectedTemplate"
          :template="selectedTemplate"
          @saved="onTemplateSaved"
        />

        <UiEmptyState
          v-else
          :title="t('onboarding.template.emptySteps')"
          icon="i-lucide-list"
        />
      </div>

      <div v-else-if="activeTab === 'employees' && canViewProgress" class="grid gap-6 lg:grid-cols-5">
        <div class="lg:col-span-2">
          <OnboardingList
            :onboardings="onboardings"
            :selected-id="selectedProgress?.id ?? null"
            hide-header
            @select="onSelectProgress"
          />
        </div>

        <div class="lg:col-span-3">
          <OnboardingProgress
            v-if="selectedProgress"
            :progress="selectedProgress"
            :steps="progressSteps"
            @complete-step="onCompleteStep"
          />

          <UiEmptyState
            v-else
            :title="t('onboarding.hrTabs.selectEmployee')"
            :description="t('onboarding.hrTabs.selectEmployeeDesc')"
            icon="i-lucide-mouse-pointer-click"
            class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] py-16"
          />
        </div>
      </div>
    </div>
  </div>
</template>

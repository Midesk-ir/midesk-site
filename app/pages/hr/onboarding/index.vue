<script setup lang="ts">
import type { OnboardingProgress, OnboardingStep, OnboardingTemplate } from '~/types/phase2'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const { api } = useApi()

const templates = ref<OnboardingTemplate[]>([])
const onboardings = ref<OnboardingProgress[]>([])
const selectedTemplate = ref<OnboardingTemplate | null>(null)
const selectedProgress = ref<OnboardingProgress | null>(null)
const progressSteps = ref<OnboardingStep[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const [templatesRes, progressRes] = await Promise.all([
      api<{ data: OnboardingTemplate[] }>('/hr/onboarding/templates'),
      api<{ data: OnboardingProgress[] }>('/hr/onboarding/progress')
    ])
    templates.value = templatesRes.data
    onboardings.value = progressRes.data
    if (!selectedTemplate.value && templates.value.length) {
      selectedTemplate.value = templates.value[0]!
    }
  } finally {
    loading.value = false
  }
}

function onSelectProgress(item: OnboardingProgress) {
  selectedProgress.value = item
  const template = templates.value.find(tpl => tpl.id === item.template_id)
  progressSteps.value = template ? [...template.steps].sort((a, b) => a.order_index - b.order_index) : []
}

function onCompleteStep(stepId: string) {
  if (!selectedProgress.value) return
  if (!selectedProgress.value.completed_steps.includes(stepId)) {
    selectedProgress.value.completed_steps.push(stepId)
  }
}

function onTemplateSaved(template: OnboardingTemplate) {
  const idx = templates.value.findIndex(tpl => tpl.id === template.id)
  if (idx >= 0) templates.value[idx] = template
  if (selectedTemplate.value?.id === template.id) {
    selectedTemplate.value = template
  }
}

onMounted(load)
</script>

<template>
  <div>
    <h1 class="midesk-page-title mb-6">{{ t('nav.hr.onboarding') }}</h1>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="midesk-skeleton-card h-48" />
      <USkeleton class="midesk-skeleton-card h-64" />
    </div>

    <div v-else class="space-y-6">
      <div v-if="templates.length > 1" class="flex flex-wrap gap-2">
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

      <OnboardingList
        :onboardings="onboardings"
        @select="onSelectProgress"
      />

      <OnboardingProgress
        v-if="selectedProgress"
        :progress="selectedProgress"
        :steps="progressSteps"
        @complete-step="onCompleteStep"
      />
    </div>
  </div>
</template>

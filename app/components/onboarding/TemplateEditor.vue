<script setup lang="ts">
import draggable from 'vuedraggable'
import type { OnboardingStep, OnboardingTemplate } from '~/types/phase2'

const props = defineProps<{
  template: OnboardingTemplate
}>()

const emit = defineEmits<{
  saved: [template: OnboardingTemplate]
}>()

const { t } = useI18n()
const { api } = useApi()
const toast = useToast()

const saving = ref(false)
const name = ref(props.template.name)
const steps = ref<OnboardingStep[]>([])

watch(
  () => props.template,
  (tpl) => {
    name.value = tpl.name
    steps.value = [...tpl.steps].sort((a, b) => a.order_index - b.order_index)
  },
  { immediate: true, deep: true }
)

function addStep() {
  const nextIndex = steps.value.length
  steps.value.push({
    id: `step-${Date.now()}`,
    title: t('onboarding.template.newStep'),
    description: '',
    assignee_role: '',
    deadline_days: 7,
    order_index: nextIndex
  })
}

function removeStep(index: number) {
  steps.value.splice(index, 1)
  steps.value.forEach((s, i) => { s.order_index = i })
}

async function save() {
  saving.value = true
  try {
    const ordered = steps.value.map((s, i) => ({ ...s, order_index: i }))
    const res = await api<{ data: OnboardingTemplate }>(
      `/hr/onboarding/templates/${props.template.id}`,
      { method: 'PATCH', body: { steps: ordered } }
    )
    emit('saved', res.data)
    toast.add({ title: t('onboarding.template.saved'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 class="midesk-card-header mb-0">{{ name }}</h2>
      <div class="flex gap-2">
        <UButton size="sm" variant="soft" icon="i-lucide-plus" @click="addStep">
          {{ t('onboarding.template.addStep') }}
        </UButton>
        <UButton size="sm" color="primary" icon="i-lucide-save" :loading="saving" @click="save">
          {{ t('common.save') }}
        </UButton>
      </div>
    </div>

    <ClientOnly>
      <draggable
        v-model="steps"
        item-key="id"
        handle=".step-drag-handle"
        class="space-y-3"
        ghost-class="opacity-40"
        :animation="200"
        @end="steps.forEach((s, i) => { s.order_index = i })"
      >
        <template #item="{ element, index }">
          <div class="rounded-lg border border-[var(--color-midesk-border)] bg-white/[0.02] p-4">
            <div class="mb-3 flex items-center gap-2">
              <UButton
                class="step-drag-handle cursor-grab"
                icon="i-lucide-grip-vertical"
                size="xs"
                variant="ghost"
                color="neutral"
              />
              <span class="text-xs font-medium text-[var(--color-midesk-muted)]">
                {{ t('onboarding.template.step') }} {{ index + 1 }}
              </span>
              <UButton
                class="ms-auto"
                icon="i-lucide-trash-2"
                size="xs"
                variant="ghost"
                color="error"
                @click="removeStep(index)"
              />
            </div>

            <div class="midesk-form-fields">
              <MideskFormField :label="t('onboarding.template.fields.title')" :model-value="element.title">
                <UInput v-model="element.title" />
              </MideskFormField>
              <MideskFormField :label="t('onboarding.template.fields.description')" :model-value="element.description">
                <UTextarea v-model="element.description" :rows="2" placeholder=" " />
              </MideskFormField>
              <div class="grid gap-4 sm:grid-cols-2">
                <MideskFormField :label="t('onboarding.template.fields.assigneeRole')" :model-value="element.assignee_role">
                  <UInput v-model="element.assignee_role" />
                </MideskFormField>
                <MideskFormField :label="t('onboarding.template.fields.deadlineDays')" :model-value="element.deadline_days">
                  <UInput v-model.number="element.deadline_days" type="number" min="1" />
                </MideskFormField>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </ClientOnly>

    <UiEmptyState
      v-if="!steps.length"
      :title="t('onboarding.template.emptySteps')"
      icon="i-lucide-list"
      class="py-8"
    />
  </div>
</template>

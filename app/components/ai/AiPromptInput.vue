<script setup lang="ts">
import type { AiContextType, AiQueryPayload } from '~/types/phase4'

const emit = defineEmits<{ submit: [payload: AiQueryPayload] }>()

const { t } = useI18n()

const prompt = ref('')
const contextType = ref<AiContextType>('general')
const contextId = ref('')
const submitting = ref(false)

const contextItems = computed(() => [
  { label: t('ai.context.general'), value: 'general' },
  { label: t('ai.context.project'), value: 'project' },
  { label: t('ai.context.task'), value: 'task' },
  { label: t('ai.context.candidate'), value: 'candidate' }
])

const showContextId = computed(() => contextType.value !== 'general')

const contextIdPlaceholder = computed(() => {
  const map: Record<AiContextType, string> = {
    general: '',
    project: 'p1',
    task: 'task-id',
    candidate: 'candidate-id'
  }
  return map[contextType.value]
})

async function onSubmit() {
  if (!prompt.value.trim() || submitting.value) return
  submitting.value = true
  try {
    emit('submit', {
      prompt: prompt.value.trim(),
      context_type: contextType.value,
      context_id: showContextId.value && contextId.value ? contextId.value : undefined
    })
    prompt.value = ''
  } finally {
    submitting.value = false
  }
}

watch(contextType, (type) => {
  if (type === 'general') contextId.value = ''
})
</script>

<template>
  <section class="midesk-ai-prompt midesk-card">
    <div class="midesk-ai-prompt__head">
      <div class="midesk-ai-prompt__icon">
        <UIcon name="i-lucide-sparkles" class="size-5" />
      </div>
      <div class="min-w-0">
        <h2 class="midesk-card-header">{{ t('ai.formTitle') }}</h2>
        <p class="text-sm text-[var(--color-midesk-muted)]">{{ t('ai.formDesc') }}</p>
      </div>
    </div>

    <form class="midesk-form-fields" @submit.prevent="onSubmit">
      <MideskFormField :label="t('ai.prompt')" :model-value="prompt">
        <UTextarea
          v-model="prompt"
          :rows="4"
          autoresize
          placeholder=" "
          class="midesk-ai-prompt__textarea w-full"
        />
      </MideskFormField>

      <div class="midesk-ai-prompt__context" :class="{ 'is-single': !showContextId }">
        <MideskFormField :label="t('ai.context.label')" :model-value="contextType">
          <USelect v-model="contextType" :items="contextItems" value-key="value" label-key="label" />
        </MideskFormField>
        <MideskFormField
          v-if="showContextId"
          :label="t('ai.context.id')"
          :model-value="contextId"
          field-class="midesk-ltr-field"
        >
          <UInput v-model="contextId" :placeholder="contextIdPlaceholder" dir="ltr" />
        </MideskFormField>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('ai.formHint') }}</p>
        <LayoutMideskPageHeaderButton
          variant="primary"
          icon="i-lucide-send"
          :loading="submitting"
          :disabled="!prompt.trim()"
          @click="onSubmit"
        >
          {{ t('ai.send') }}
        </LayoutMideskPageHeaderButton>
      </div>
    </form>
  </section>
</template>

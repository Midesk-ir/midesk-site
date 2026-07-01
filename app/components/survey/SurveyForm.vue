<script setup lang="ts">
import type { CreateSurveyPayload, SurveyType } from '~/types/phase5'

defineProps<{ saving?: boolean }>()

const emit = defineEmits<{ submit: [payload: CreateSurveyPayload], cancel: [] }>()
const { t } = useI18n()

const form = reactive({
  title: '',
  type: 'survey' as SurveyType
})

const typeOptions = computed(() =>
  (['survey', 'quiz', 'form'] as SurveyType[]).map(v => ({
    label: t(`surveys.types.${v}`),
    value: v
  }))
)

function reset() {
  form.title = ''
  form.type = 'survey'
}

function onSubmit() {
  if (!form.title.trim()) return
  emit('submit', { title: form.title.trim(), type: form.type })
}

defineExpose({ reset })
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('surveys.fields.title')" :model-value="form.title" required>
      <UInput v-model="form.title" placeholder=" " autofocus />
    </MideskFormField>
    <MideskFormField :label="t('surveys.fields.type')" :model-value="form.type">
      <USelect v-model="form.type" :items="typeOptions" />
    </MideskFormField>
    <p class="text-sm text-[var(--color-midesk-muted)]">
      {{ t('surveys.createHint') }}
    </p>
    <div class="flex justify-end gap-2 pt-1">
      <UButton type="button" variant="ghost" color="neutral" :disabled="saving" @click="emit('cancel')">
        {{ t('common.cancel') }}
      </UButton>
      <UButton type="submit" color="primary" :loading="saving" :disabled="!form.title.trim()">
        {{ t('surveys.createAndEdit') }}
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import type { SurveyQuestion, SurveyQuestionType } from '~/types/phase5'

const props = defineProps<{ questions: SurveyQuestion[] }>()
const emit = defineEmits<{ save: [questions: SurveyQuestion[]] }>()
const { t } = useI18n()

const local = ref<SurveyQuestion[]>([])

watch(() => props.questions, (q) => { local.value = [...q] }, { immediate: true })

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `q-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function addQuestion() {
  local.value.push({
    id: newId(),
    title: '',
    type: 'text',
    is_required: false,
    order_index: local.value.length
  })
}

function save() {
  local.value.forEach((q, i) => { q.order_index = i })
  emit('save', local.value)
}

const types: SurveyQuestionType[] = ['text', 'textarea', 'single_choice', 'multiple_choice', 'rating', 'number', 'date']
</script>

<template>
  <div class="space-y-4">
    <draggable v-model="local" item-key="id" handle=".drag-handle" class="space-y-3">
      <template #item="{ element: q }">
        <div class="midesk-card flex gap-3 p-4">
          <UIcon name="i-lucide-grip-vertical" class="drag-handle size-5 shrink-0 cursor-grab text-[var(--color-midesk-muted)]" />
          <div class="flex-1 space-y-2">
            <UInput v-model="q.title" :placeholder="t('surveys.questionTitle')" />
            <USelect v-model="q.type" :items="types.map(v => ({ label: t(`surveys.questionTypes.${v}`), value: v }))" />
            <UCheckbox v-model="q.is_required" :label="t('surveys.required')" />
          </div>
        </div>
      </template>
    </draggable>
    <div class="flex gap-2">
      <UButton variant="outline" icon="i-lucide-plus" @click="addQuestion">{{ t('surveys.addQuestion') }}</UButton>
      <UButton color="primary" @click="save">{{ t('common.save') }}</UButton>
    </div>
  </div>
</template>

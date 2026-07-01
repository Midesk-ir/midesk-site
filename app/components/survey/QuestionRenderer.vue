<script setup lang="ts">
import type { Survey, SurveyQuestionType } from '~/types/phase5'

const props = defineProps<{ question: { id: string, title: string, type: SurveyQuestionType, options?: string[], is_required: boolean } }>()
const model = defineModel<string | string[] | number>('modelValue', { default: '' })
const { t } = useI18n()
</script>

<template>
  <MideskFormField :label="question.title + (question.is_required ? ' *' : '')" :model-value="String(model)">
    <UInput v-if="question.type === 'text'" v-model="model as string" />
    <UTextarea v-else-if="question.type === 'textarea'" v-model="model as string" />
    <UInput v-else-if="question.type === 'number'" v-model.number="model as number" type="number" />
    <MideskDatePicker v-else-if="question.type === 'date'" :model-value="(model as string) || ''" @update:model-value="model = $event ?? ''" />
    <div v-else-if="question.type === 'single_choice'" class="space-y-2">
      <label v-for="opt in question.options" :key="opt" class="flex items-center gap-2">
        <input v-model="model" type="radio" :value="opt" class="accent-[var(--color-midesk-accent)]">
        {{ opt }}
      </label>
    </div>
    <div v-else-if="question.type === 'rating'" class="flex gap-1">
      <button
        v-for="n in 5"
        :key="n"
        type="button"
        class="text-2xl"
        :class="Number(model) >= n ? 'text-amber-400' : 'text-[var(--color-midesk-muted)]'"
        @click="model = n"
      >
        ★
      </button>
    </div>
  </MideskFormField>
</template>

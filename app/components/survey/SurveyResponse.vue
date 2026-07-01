<script setup lang="ts">
import type { Survey, SurveyResponsePayload } from '~/types/phase5'

const props = defineProps<{ survey: Survey }>()
const emit = defineEmits<{ submit: [payload: SurveyResponsePayload] }>()
const { t } = useI18n()

const answers = reactive<Record<string, string | string[] | number>>({})

function submit() {
  emit('submit', { answers: { ...answers } })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="submit">
    <SurveyQuestionRenderer
      v-for="q in survey.questions"
      :key="q.id"
      :question="q"
      v-model="answers[q.id]"
    />
    <UButton type="submit" color="primary">{{ t('surveys.submit') }}</UButton>
  </form>
</template>

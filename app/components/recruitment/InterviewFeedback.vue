<script setup lang="ts">
const props = defineProps<{
  interviewId: string
  initialScore?: number
  initialFeedback?: string
}>()

const emit = defineEmits<{
  submitted: []
}>()

const { t } = useI18n()
const recruitmentStore = useRecruitmentStore()
const toast = useToast()

const submitting = ref(false)
const score = ref(props.initialScore ?? 0)
const feedback = ref(props.initialFeedback ?? '')

watch(
  () => [props.initialScore, props.initialFeedback] as const,
  ([s, f]) => {
    score.value = s ?? 0
    feedback.value = f ?? ''
  }
)

async function submit() {
  if (!score.value) return
  submitting.value = true
  try {
    await recruitmentStore.submitFeedback(props.interviewId, score.value, feedback.value)
    emit('submitted')
    toast.add({ title: t('recruitment.interview.feedbackSuccess'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="submit">
    <MideskFormField :label="t('recruitment.interview.fields.score')" :model-value="score" required>
      <div class="flex gap-1">
        <UButton
          v-for="star in 5"
          :key="star"
          type="button"
          :icon="star <= score ? 'i-lucide-star' : 'i-lucide-star'"
          :color="star <= score ? 'warning' : 'neutral'"
          :variant="star <= score ? 'soft' : 'ghost'"
          size="lg"
          @click="score = star"
        />
      </div>
      <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">
        {{ score }}/5
      </p>
    </MideskFormField>

    <MideskFormField :label="t('recruitment.interview.fields.feedback')" :model-value="feedback">
      <UTextarea v-model="feedback" :rows="4" placeholder=" " />
    </MideskFormField>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="submitting" :disabled="!score">
        {{ t('recruitment.interview.submitFeedback') }}
      </UButton>
    </div>
  </form>
</template>

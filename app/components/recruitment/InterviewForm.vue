<script setup lang="ts">
import type { InterviewType } from '~/types/phase2'
import type { User } from '~/types'

const props = defineProps<{
  candidateId: string
  interviewers?: User[]
}>()

const emit = defineEmits<{
  submitted: []
}>()

const { t } = useI18n()
const recruitmentStore = useRecruitmentStore()
const toast = useToast()

const submitting = ref(false)

const form = reactive({
  interviewer_id: '',
  scheduled_at: '',
  type: 'video' as InterviewType
})

const typeItems = computed(() =>
  (['phone', 'video', 'in_person', 'technical'] as InterviewType[]).map(type => ({
    label: t(`recruitment.interview.type.${type}`),
    value: type
  }))
)

const interviewerItems = computed(() =>
  (props.interviewers ?? []).map(u => ({ label: u.name, value: u.id }))
)

watch(
  () => props.interviewers,
  (list) => {
    if (list?.length && !form.interviewer_id) {
      form.interviewer_id = list[0]!.id
    }
  },
  { immediate: true }
)

async function submit() {
  if (!form.interviewer_id || !form.scheduled_at) return
  submitting.value = true
  try {
    await recruitmentStore.scheduleInterview({
      candidate_id: props.candidateId,
      interviewer_id: form.interviewer_id,
      scheduled_at: form.scheduled_at,
      type: form.type
    })
    form.scheduled_at = ''
    emit('submitted')
    toast.add({ title: t('recruitment.interview.scheduledSuccess'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="submit">
    <MideskFormField :label="t('recruitment.interview.fields.interviewer')" :model-value="form.interviewer_id" required>
      <USelect v-model="form.interviewer_id" :items="interviewerItems" />
    </MideskFormField>

    <MideskFormField :label="t('recruitment.interview.fields.type')" :model-value="form.type" required>
      <USelect v-model="form.type" :items="typeItems" />
    </MideskFormField>

    <MideskFormField :label="t('recruitment.interview.fields.scheduledAt')" :model-value="form.scheduled_at" field-class="midesk-ltr-field" required>
      <UInput v-model="form.scheduled_at" type="datetime-local" />
    </MideskFormField>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="submitting">
        {{ t('recruitment.interview.schedule') }}
      </UButton>
    </div>
  </form>
</template>

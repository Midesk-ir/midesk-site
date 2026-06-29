<script setup lang="ts">
import type { CreateLeaveRequestPayload } from '~/types/phase1'

const emit = defineEmits<{
  submitted: []
}>()

const { t } = useI18n()
const leaveStore = useLeaveStore()
const toast = useToast()

const submitting = ref(false)
const form = reactive<CreateLeaveRequestPayload>({
  leave_type_id: '',
  start_date: '',
  end_date: '',
  note: ''
})

const typeItems = computed(() =>
  leaveStore.types.map(lt => ({ label: lt.name, value: lt.id }))
)

watch(
  () => leaveStore.types,
  (types) => {
    if (types.length && !form.leave_type_id) {
      form.leave_type_id = types[0]!.id
    }
  },
  { immediate: true }
)

function resetForm() {
  form.leave_type_id = leaveStore.types[0]?.id ?? ''
  form.start_date = ''
  form.end_date = ''
  form.note = ''
}

async function submit() {
  if (!form.leave_type_id || !form.start_date || !form.end_date) return
  submitting.value = true
  try {
    await leaveStore.request({
      leave_type_id: form.leave_type_id,
      start_date: form.start_date,
      end_date: form.end_date,
      note: form.note || undefined
    })
    resetForm()
    emit('submitted')
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="midesk-card p-5">
    <h2 class="midesk-card-header">{{ t('leave.request.title') }}</h2>
    <form class="midesk-form-fields" @submit.prevent="submit">
      <MideskFormField :label="t('leave.request.type')" :model-value="form.leave_type_id" required>
        <USelect v-model="form.leave_type_id" :items="typeItems" />
      </MideskFormField>

      <div class="grid gap-4 sm:grid-cols-2">
          <MideskFormField :label="t('leave.request.startDate')" :model-value="form.start_date" field-class="midesk-ltr-field" required>
          <UInput v-model="form.start_date" type="date" />
        </MideskFormField>
        <MideskFormField :label="t('leave.request.endDate')" :model-value="form.end_date" field-class="midesk-ltr-field" required>
          <UInput v-model="form.end_date" type="date" />
        </MideskFormField>
      </div>

      <MideskFormField :label="t('leave.request.note')" :model-value="form.note">
        <UTextarea v-model="form.note" :rows="3" placeholder=" " />
      </MideskFormField>

      <div class="flex justify-end">
        <UButton type="submit" color="primary" :loading="submitting">
          {{ t('leave.request.submit') }}
        </UButton>
      </div>
    </form>
  </div>
</template>

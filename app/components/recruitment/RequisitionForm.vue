<script setup lang="ts">
import type { CreateRequisitionPayload, RequisitionPriority } from '~/types/phase2'

const emit = defineEmits<{
  submit: [payload: CreateRequisitionPayload]
}>()

const { t } = useI18n()

const submitting = ref(false)

const form = reactive<CreateRequisitionPayload>({
  title: '',
  department: '',
  positions_count: 1,
  priority: 'medium'
})

const priorityItems = computed(() =>
  (['low', 'medium', 'high', 'urgent'] as RequisitionPriority[]).map(p => ({
    label: t(`recruitment.priority.${p}`),
    value: p
  }))
)

function onSubmit() {
  if (!form.title || !form.positions_count) return
  submitting.value = true
  emit('submit', {
    title: form.title,
    department: form.department || undefined,
    positions_count: form.positions_count,
    priority: form.priority
  })
  submitting.value = false
}

function reset() {
  form.title = ''
  form.department = ''
  form.positions_count = 1
  form.priority = 'medium'
}

defineExpose({ reset })
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('recruitment.requisitions.fields.title')" :model-value="form.title" required>
      <UInput v-model="form.title" />
    </MideskFormField>

    <MideskFormField :label="t('recruitment.requisitions.fields.department')" :model-value="form.department">
      <UInput v-model="form.department" />
    </MideskFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('recruitment.requisitions.fields.positions')" :model-value="form.positions_count" required>
        <UInput v-model.number="form.positions_count" type="number" min="1" />
      </MideskFormField>
      <MideskFormField :label="t('recruitment.requisitions.fields.priority')" :model-value="form.priority" required>
        <USelect v-model="form.priority" :items="priorityItems" />
      </MideskFormField>
    </div>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="submitting">
        {{ t('recruitment.requisitions.create') }}
      </UButton>
    </div>
  </form>
</template>

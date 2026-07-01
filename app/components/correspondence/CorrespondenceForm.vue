<script setup lang="ts">
import type { CreateCorrespondencePayload } from '~/types/phase5'

const emit = defineEmits<{ submit: [payload: CreateCorrespondencePayload], cancel: [] }>()
const { t } = useI18n()

const form = reactive<CreateCorrespondencePayload>({
  type: 'internal',
  subject: '',
  body: '',
  priority: 'normal'
})
</script>

<template>
  <div class="midesk-form-fields">
    <MideskFormField :label="t('correspondence.type')" :model-value="form.type">
      <USelect v-model="form.type" :items="['incoming','outgoing','internal'].map(v => ({ label: t(`correspondence.types.${v}`), value: v }))" />
    </MideskFormField>
    <MideskFormField :label="t('correspondence.subject')" :model-value="form.subject"><UInput v-model="form.subject" /></MideskFormField>
    <MideskFormField :label="t('correspondence.body')" :model-value="form.body"><UTextarea v-model="form.body" :rows="6" /></MideskFormField>
    <MideskFormField :label="t('correspondence.priority')" :model-value="form.priority">
      <USelect v-model="form.priority" :items="['normal','urgent','confidential'].map(v => ({ label: t(`correspondence.priorities.${v}`), value: v }))" />
    </MideskFormField>
    <div class="flex gap-2">
      <UButton color="primary" @click="emit('submit', { ...form })">{{ t('common.save') }}</UButton>
      <UButton variant="outline" @click="emit('cancel')">{{ t('common.cancel') }}</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouteCorrespondencePayload } from '~/types/phase5'

const emit = defineEmits<{ submit: [payload: RouteCorrespondencePayload], cancel: [] }>()
const { t } = useI18n()

const form = reactive<RouteCorrespondencePayload>({
  to_user_id: 'u2',
  action: 'review',
  note: '',
  due_date: ''
})
</script>

<template>
  <div class="midesk-form-fields">
    <MideskFormField :label="t('correspondence.toUser')" :model-value="form.to_user_id">
      <USelect v-model="form.to_user_id" :items="[{ label: 'Sara Johnson', value: 'u2' }, { label: 'محمد کریمی', value: 'u3' }]" />
    </MideskFormField>
    <MideskFormField :label="t('correspondence.action')" :model-value="form.action">
      <USelect v-model="form.action" :items="['review','approve','sign','for_info','execute'].map(v => ({ label: t(`correspondence.actions.${v}`), value: v }))" />
    </MideskFormField>
    <MideskFormField :label="t('correspondence.note')" :model-value="form.note"><UTextarea v-model="form.note" /></MideskFormField>
    <MideskFormField :label="t('correspondence.dueDate')" :model-value="form.due_date"><UInput v-model="form.due_date" type="date" /></MideskFormField>
    <div class="flex gap-2">
      <UButton color="primary" @click="emit('submit', { ...form })">{{ t('correspondence.route') }}</UButton>
      <UButton variant="outline" @click="emit('cancel')">{{ t('common.cancel') }}</UButton>
    </div>
  </div>
</template>

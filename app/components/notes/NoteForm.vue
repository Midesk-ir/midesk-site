<script setup lang="ts">
import type { CreateNotePayload, Note } from '~/types/phase4'

const props = defineProps<{
  initial?: Note | null
}>()

const emit = defineEmits<{ submit: [payload: CreateNotePayload], cancel: [] }>()

const { t } = useI18n()

const colors = ['#fef08a', '#bfdbfe', '#bbf7d0', '#fecaca', '#e9d5ff', '#e2e8f0']

const form = reactive<CreateNotePayload>({
  title: '',
  body: '',
  color: colors[0],
  visibility: 'private',
  project_id: undefined
})

watch(() => props.initial, (note) => {
  if (note) {
    form.title = note.title
    form.body = note.body
    form.color = note.color ?? colors[0]
    form.visibility = note.visibility
    form.project_id = note.project_id
  }
}, { immediate: true })

function onSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('notes.fields.title')" :model-value="form.title">
      <UInput v-model="form.title" placeholder=" " />
    </MideskFormField>
    <MideskFormField :label="t('notes.fields.body')" :model-value="form.body">
      <UTextarea v-model="form.body" :rows="6" placeholder=" " />
    </MideskFormField>
    <MideskFormField :label="t('notes.fields.visibility')" :model-value="form.visibility">
      <USelect
        v-model="form.visibility"
        :items="[
          { label: t('notes.visibility.private'), value: 'private' },
          { label: t('notes.visibility.team'), value: 'team' },
          { label: t('notes.visibility.project'), value: 'project' }
        ]"
      />
    </MideskFormField>
    <div>
      <p class="mb-2 text-sm text-[var(--color-midesk-muted)]">{{ t('notes.fields.color') }}</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in colors"
          :key="c"
          type="button"
          class="size-8 rounded-full border-2 transition"
          :class="form.color === c ? 'border-[var(--color-midesk-accent)] scale-110' : 'border-transparent'"
          :style="{ backgroundColor: c }"
          @click="form.color = c"
        />
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <UButton type="button" variant="ghost" color="neutral" @click="emit('cancel')">{{ t('common.cancel') }}</UButton>
      <UButton type="submit" color="primary">{{ t('common.save') }}</UButton>
    </div>
  </form>
</template>

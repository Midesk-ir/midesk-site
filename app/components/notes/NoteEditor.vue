<script setup lang="ts">
import type { Note } from '~/types/phase4'

const props = defineProps<{ note: Note }>()
const emit = defineEmits<{ save: [body: string], close: [] }>()

const { t } = useI18n()
const { render } = useMarkdown()

const body = ref(props.note.body)
const preview = ref(false)

watch(() => props.note.body, v => { body.value = v })
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-lg font-semibold text-[var(--color-midesk-text)]">{{ note.title || t('notes.untitled') }}</h2>
      <div class="flex gap-2">
        <UButton size="sm" :variant="preview ? 'solid' : 'soft'" @click="preview = !preview">
          {{ preview ? t('notes.edit') : t('notes.preview') }}
        </UButton>
        <UButton size="sm" variant="ghost" icon="i-lucide-x" @click="emit('close')" />
      </div>
    </div>
    <UTextarea v-if="!preview" v-model="body" :rows="12" class="w-full" />
    <div
      v-else
      class="prose prose-invert max-w-none rounded-xl border border-[var(--color-midesk-border)] p-4 text-sm"
      v-html="render(body)"
    />
    <div class="flex justify-end">
      <UButton color="primary" @click="emit('save', body)">{{ t('common.save') }}</UButton>
    </div>
  </div>
</template>

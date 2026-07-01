<script setup lang="ts">
const emit = defineEmits<{ upload: [payload: { name: string, mime_type?: string, file_size?: number }] }>()
const { t } = useI18n()
const dragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function onDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) emitUpload(file)
}

function onSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emitUpload(file)
}

function emitUpload(file: File) {
  emit('upload', { name: file.name, mime_type: file.type, file_size: file.size })
}
</script>

<template>
  <div
    class="rounded-xl border-2 border-dashed border-[var(--color-midesk-border)] p-8 text-center transition"
    :class="dragging ? 'border-[var(--color-midesk-accent)] bg-[var(--color-midesk-accent-soft)]' : ''"
    @dragover.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="onDrop"
  >
    <UIcon name="i-lucide-upload-cloud" class="mx-auto mb-2 size-8 text-[var(--color-midesk-muted)]" />
    <p class="text-sm text-[var(--color-midesk-muted)]">{{ t('files.dropHint') }}</p>
    <UButton class="mt-3" size="sm" variant="outline" @click="fileInput?.click()">
      {{ t('files.selectFile') }}
    </UButton>
    <input ref="fileInput" type="file" class="hidden" @change="onSelect">
  </div>
</template>

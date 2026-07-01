<script setup lang="ts">
import type { Note } from '~/types/phase4'

defineProps<{
  notes: Note[]
  loading?: boolean
}>()

defineEmits<{ select: [note: Note], pin: [id: string] }>()
</script>

<template>
  <div v-if="loading" class="midesk-notes-grid">
    <USkeleton v-for="i in 6" :key="i" class="h-44 rounded-xl" />
  </div>
  <div v-else class="midesk-notes-grid">
    <NotesNoteCard
      v-for="note in notes"
      :key="note.id"
      :note="note"
      @select="$emit('select', $event)"
      @pin="$emit('pin', $event)"
    />
  </div>
</template>

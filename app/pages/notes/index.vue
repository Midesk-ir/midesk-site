<script setup lang="ts">
import type { CreateNotePayload, Note, NoteVisibility } from '~/types/phase4'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const toast = useToast()
const notesStore = useNotesStore()

const filter = ref<NoteVisibility | 'all'>('all')
const showForm = ref(false)
const editing = ref<Note | null>(null)
const selected = ref<Note | null>(null)

const showEditModal = computed({
  get: () => editing.value !== null,
  set: (open) => { if (!open) editing.value = null }
})

const showSelectedModal = computed({
  get: () => selected.value !== null,
  set: (open) => { if (!open) selected.value = null }
})

const filterItems = computed(() => [
  { label: t('notes.filters.all'), value: 'all' as const, icon: 'i-lucide-layout-grid' },
  { label: t('notes.visibility.private'), value: 'private' as const, icon: 'i-lucide-lock' },
  { label: t('notes.visibility.team'), value: 'team' as const, icon: 'i-lucide-users' },
  { label: t('notes.visibility.project'), value: 'project' as const, icon: 'i-lucide-folder-kanban' }
])

async function load() {
  await notesStore.fetchNotes(filter.value === 'all' ? undefined : filter.value)
}

watch(filter, load)

async function onCreate(payload: CreateNotePayload) {
  try {
    await notesStore.createNote(payload)
    showForm.value = false
    toast.add({ title: t('common.save'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onUpdate(payload: CreateNotePayload) {
  if (!editing.value) return
  try {
    await notesStore.updateNote(editing.value.id, payload)
    editing.value = null
    toast.add({ title: t('common.save'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onSaveBody(body: string) {
  if (!selected.value) return
  try {
    await notesStore.updateNote(selected.value.id, { body })
    selected.value = notesStore.notes.find(n => n.id === selected.value!.id) ?? null
    toast.add({ title: t('common.save'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onPin(id: string) {
  await notesStore.togglePin(id)
}

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="t('nav.notes')" :subtitle="t('notes.pageSubtitle')">
      <template #actions>
        <LayoutMideskPageHeaderButton variant="primary" icon="i-lucide-plus" @click="showForm = true">
          {{ t('notes.create') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <UiSegmentTabs v-model="filter" :items="filterItems" />

    <UiEmptyState
      v-if="!notesStore.loading && !notesStore.notes.length"
      :title="t('notes.emptyTitle')"
      :description="t('notes.emptyDesc')"
      icon="i-lucide-sticky-note"
    />

    <NotesNoteList
      v-else
      :notes="notesStore.notes"
      :loading="notesStore.loading"
      @select="selected = $event"
      @pin="onPin"
    />

    <MideskModal v-model:open="showForm" :title="t('notes.create')">
      <NotesNoteForm @submit="onCreate" @cancel="showForm = false" />
    </MideskModal>

    <MideskModal v-model:open="showEditModal" :title="t('common.edit')">
      <NotesNoteForm v-if="editing" :initial="editing" @submit="onUpdate" @cancel="editing = null" />
    </MideskModal>

    <MideskModal v-model:open="showSelectedModal" :title="selected?.title ?? t('notes.untitled')">
      <NotesNoteEditor v-if="selected" :note="selected" @save="onSaveBody" @close="selected = null" />
    </MideskModal>
  </div>
</template>

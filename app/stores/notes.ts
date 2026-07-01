import { defineStore } from 'pinia'
import type { CreateNotePayload, Note } from '~/types/phase4'
import { storeApi } from '~/utils/api-client'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)

  async function fetchNotes(visibility?: string) {
    loading.value = true
    try {
      const qs = visibility ? `?visibility=${visibility}` : ''
      const res = await storeApi<{ data: Note[] }>(`/notes${qs}`)
      notes.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function createNote(payload: CreateNotePayload) {
    const res = await storeApi<{ data: Note }>('/notes', { method: 'POST', body: payload })
    notes.value.unshift(res.data)
    return res.data
  }

  async function updateNote(id: string, payload: Partial<CreateNotePayload>) {
    const res = await storeApi<{ data: Note }>(`/notes/${id}`, { method: 'PATCH', body: payload })
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx >= 0) notes.value[idx] = res.data
    return res.data
  }

  async function deleteNote(id: string) {
    await storeApi(`/notes/${id}`, { method: 'DELETE' })
    notes.value = notes.value.filter(n => n.id !== id)
  }

  async function togglePin(id: string) {
    const res = await storeApi<{ data: Note }>(`/notes/${id}/pin`, { method: 'POST' })
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx >= 0) notes.value[idx] = res.data
    return res.data
  }

  return { notes, loading, fetchNotes, createNote, updateNote, deleteNote, togglePin }
})

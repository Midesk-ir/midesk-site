<script setup lang="ts">
import type { Note } from '~/types/phase4'

defineProps<{ note: Note }>()
defineEmits<{ select: [note: Note], pin: [id: string] }>()

const { t } = useI18n()
</script>

<template>
  <article
    class="midesk-note-card group relative flex min-h-[148px] cursor-pointer flex-col overflow-hidden transition hover:border-[var(--color-midesk-accent)]/30"
    @click="$emit('select', note)"
  >
    <div
      class="midesk-note-card__accent"
      :style="{ backgroundColor: note.color ?? 'var(--color-midesk-accent)' }"
    />

    <button
      type="button"
      class="absolute end-3 top-3 z-10 rounded-lg p-1.5 opacity-0 transition group-hover:opacity-100"
      :class="note.is_pinned ? 'opacity-100 text-[var(--color-midesk-accent)]' : 'text-[var(--color-midesk-muted)] hover:bg-white/5'"
      :aria-label="t('notes.pin')"
      @click.stop="$emit('pin', note.id)"
    >
      <UIcon :name="note.is_pinned ? 'i-lucide-pin' : 'i-lucide-pin-off'" class="size-4" />
    </button>

    <div class="flex flex-1 flex-col p-4 pt-5">
      <h3 v-if="note.title" class="pe-8 font-semibold text-[var(--color-midesk-text)]">
        {{ note.title }}
      </h3>
      <p class="mt-2 line-clamp-4 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-midesk-muted)]">
        {{ note.body }}
      </p>
      <div class="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
        <UBadge variant="subtle" size="sm" color="neutral">
          {{ t(`notes.visibility.${note.visibility}`) }}
        </UBadge>
        <span v-if="note.is_pinned" class="text-xs text-[var(--color-midesk-accent)]">
          {{ t('notes.pinned') }}
        </span>
      </div>
    </div>
  </article>
</template>

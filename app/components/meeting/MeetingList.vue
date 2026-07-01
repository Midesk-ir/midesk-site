<script setup lang="ts">
import type { Meeting } from '~/types/phase4'

defineProps<{
  meetings: Meeting[]
  loading?: boolean
}>()

defineEmits<{ join: [id: string] }>()
</script>

<template>
  <div v-if="loading" class="midesk-meetings-grid">
    <USkeleton v-for="i in 3" :key="i" class="h-44 rounded-xl" />
  </div>
  <div v-else class="midesk-meetings-grid">
    <MeetingCard
      v-for="meeting in meetings"
      :key="meeting.id"
      :meeting="meeting"
      @join="$emit('join', $event)"
    />
  </div>
</template>

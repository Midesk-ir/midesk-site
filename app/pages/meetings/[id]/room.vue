<script setup lang="ts">
definePageMeta({ layout: 'fullscreen', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const route = useRoute()
const meetingsStore = useMeetingsStore()

const roomUrl = ref('')
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  loading.value = true
  error.value = false
  try {
    const meeting = await meetingsStore.fetchMeeting(route.params.id as string)
    roomUrl.value = meeting.room_url ?? ''
    if (!roomUrl.value) error.value = true
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="flex h-full items-center justify-center bg-black">
    <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-white/70" />
  </div>
  <div v-else-if="error" class="flex h-full flex-col items-center justify-center gap-4 bg-black p-6 text-center">
    <p class="text-white/80">{{ t('common.error') }}</p>
    <UButton color="primary" @click="navigateTo('/meetings')">{{ t('nav.meetings') }}</UButton>
  </div>
  <MeetingRoom v-else :room-url="roomUrl" @leave="navigateTo('/meetings')" />
</template>

<script setup lang="ts">
import type { PersonnelDetail } from '~/types/phase2'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const route = useRoute()
const hrStore = useHrStore()

const detail = ref<PersonnelDetail | null>(null)
const loading = ref(true)
const error = ref(false)

const id = computed(() => route.params.id as string)

async function load() {
  loading.value = true
  error.value = false
  try {
    detail.value = await hrStore.fetchPersonnelDetail(id.value)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

watch(id, load)
onMounted(load)
</script>

<template>
  <div>
    <div class="mb-6">
      <UButton
        to="/hr/personnel"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-right"
        size="sm"
        class="mb-3"
      >
        {{ t('nav.hr.personnel') }}
      </UButton>
      <h1 v-if="detail" class="midesk-page-title">{{ detail.user.name }}</h1>
      <h1 v-else class="midesk-page-title">{{ t('nav.hr.personnel') }}</h1>
    </div>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="midesk-skeleton-card h-32" />
      <USkeleton class="midesk-skeleton-card h-64" />
    </div>

    <UiEmptyState
      v-else-if="error || !detail"
      :title="t('common.error')"
      icon="i-lucide-alert-circle"
    >
      <template #action>
        <UButton color="primary" @click="load">{{ t('common.retry') }}</UButton>
      </template>
    </UiEmptyState>

    <HrPersonnelProfile v-else :detail="detail" />
  </div>
</template>

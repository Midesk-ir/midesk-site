<script setup lang="ts">
import type { Correspondence, CreateCorrespondencePayload } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })
const { t } = useI18n()
const tab = ref('internal')
const items = ref<Correspondence[]>([])
const showForm = ref(false)

const tabs = computed(() => [
  { label: t('correspondence.tabs.outgoing'), value: 'outgoing', icon: 'i-lucide-send' },
  { label: t('correspondence.tabs.incoming'), value: 'incoming', icon: 'i-lucide-inbox' },
  { label: t('correspondence.tabs.internal'), value: 'internal', icon: 'i-lucide-building' },
  { label: t('correspondence.tabs.archive'), value: 'archived', icon: 'i-lucide-archive' }
])

async function load() {
  const status = tab.value === 'archived' ? 'archived' : undefined
  const type = tab.value === 'archived' ? undefined : tab.value
  const qs = new URLSearchParams()
  if (type) qs.set('type', type)
  if (status) qs.set('status', status)
  items.value = (await storeApi<{ data: Correspondence[] }>(`/correspondences?${qs}`)).data
}

watch(tab, load)
onMounted(load)

async function onCreate(payload: CreateCorrespondencePayload) {
  await storeApi('/correspondences', { method: 'POST', body: payload })
  showForm.value = false
  await load()
}
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="t('nav.correspondence')" :subtitle="t('correspondence.pageSubtitle')">
      <template #actions>
        <LayoutMideskPageHeaderButton to="/correspondence/inbox" icon="i-lucide-inbox">{{ t('correspondence.inbox') }}</LayoutMideskPageHeaderButton>
        <LayoutMideskPageHeaderButton variant="primary" icon="i-lucide-plus" @click="showForm = true">{{ t('correspondence.create') }}</LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>
    <UiSegmentTabs v-model="tab" :items="tabs" />
    <CorrespondenceList :items="items" />
    <MideskModal v-model:open="showForm" :title="t('correspondence.create')">
      <CorrespondenceForm @submit="onCreate" @cancel="showForm = false" />
    </MideskModal>
  </div>
</template>

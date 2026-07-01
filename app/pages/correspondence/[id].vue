<script setup lang="ts">
import type { Correspondence, RouteCorrespondencePayload } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })
const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const item = ref<Correspondence | null>(null)
const showRoute = ref(false)

onMounted(async () => {
  item.value = (await storeApi<{ data: Correspondence }>(`/correspondences/${route.params.id}`)).data
})

async function send() {
  item.value = (await storeApi<{ data: Correspondence }>(`/correspondences/${route.params.id}/send`, { method: 'POST' })).data
  toast.add({ title: t('correspondence.sent'), color: 'success' })
}

async function sign() {
  item.value = (await storeApi<{ data: Correspondence }>(`/correspondences/${route.params.id}/sign`, { method: 'POST' })).data
  toast.add({ title: t('correspondence.signed'), color: 'success' })
}

async function onRoute(payload: RouteCorrespondencePayload) {
  item.value = (await storeApi<{ data: Correspondence }>(`/correspondences/${route.params.id}/route`, { method: 'POST', body: payload })).data
  showRoute.value = false
  toast.add({ title: t('correspondence.routed'), color: 'success' })
}
</script>

<template>
  <div v-if="item" class="space-y-6">
    <LayoutMideskPageHeader :title="item.subject" :subtitle="item.number">
      <template #actions>
        <CorrespondenceSignatureButton v-if="!item.signed_by" @sign="sign" />
        <UButton v-if="item.status === 'draft'" color="primary" @click="send">{{ t('correspondence.send') }}</UButton>
        <UButton variant="outline" icon="i-lucide-share-2" @click="showRoute = true">{{ t('correspondence.route') }}</UButton>
      </template>
    </LayoutMideskPageHeader>
    <CorrespondenceDetail :item="item" />
    <MideskModal v-model:open="showRoute" :title="t('correspondence.route')">
      <CorrespondenceRoutingForm @submit="onRoute" @cancel="showRoute = false" />
    </MideskModal>
  </div>
</template>

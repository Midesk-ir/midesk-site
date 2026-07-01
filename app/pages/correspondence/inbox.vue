<script setup lang="ts">
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })
const { t } = useI18n()
const toast = useToast()
const inbox = ref<Array<{ correspondence: import('~/types/phase5').Correspondence, routing: import('~/types/phase5').CorrespondenceRouting }>>([])

onMounted(async () => {
  inbox.value = (await storeApi<{ data: typeof inbox.value }>('/correspondences/inbox')).data
})

async function complete(corrId: string, routingId: string) {
  await storeApi(`/correspondences/${corrId}/routing/${routingId}/complete`, { method: 'POST' })
  toast.add({ title: t('correspondence.completed'), color: 'success' })
  inbox.value = (await storeApi<{ data: typeof inbox.value }>('/correspondences/inbox')).data
}
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="t('correspondence.inbox')" />
    <CorrespondenceInboxList :items="inbox" @complete="complete" />
  </div>
</template>

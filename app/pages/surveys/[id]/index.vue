<script setup lang="ts">
import type { Survey, SurveyResponsePayload } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })
const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const survey = ref<Survey | null>(null)

onMounted(async () => {
  survey.value = (await storeApi<{ data: Survey }>(`/surveys/${route.params.id}`)).data
})

async function onRespond(payload: SurveyResponsePayload) {
  await storeApi(`/surveys/${route.params.id}/respond`, { method: 'POST', body: payload })
  toast.add({ title: t('surveys.submitted'), color: 'success' })
}
</script>

<template>
  <div v-if="survey" class="space-y-6">
    <LayoutMideskPageHeader :title="survey.title">
      <template #actions>
        <LayoutMideskPageHeaderButton :to="`/surveys/${survey.id}/report`" icon="i-lucide-bar-chart-2">{{ t('surveys.report') }}</LayoutMideskPageHeaderButton>
        <LayoutMideskPageHeaderButton v-if="survey.status === 'draft'" :to="`/surveys/${survey.id}/edit`" variant="outline" icon="i-lucide-pencil">{{ t('common.edit') }}</LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>
    <SurveyResponse v-if="survey.status === 'active'" :survey="survey" @submit="onRespond" />
    <p v-else class="text-sm text-[var(--color-midesk-muted)]">{{ t(`surveys.statuses.${survey.status}`) }}</p>
  </div>
</template>

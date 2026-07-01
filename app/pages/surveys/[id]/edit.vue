<script setup lang="ts">
import type { Survey, SurveyQuestion } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'admin'] })
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const survey = ref<Survey | null>(null)

onMounted(async () => {
  survey.value = (await storeApi<{ data: Survey }>(`/surveys/${route.params.id}`)).data
})

async function save(questions: SurveyQuestion[]) {
  await storeApi(`/surveys/${route.params.id}`, { method: 'PATCH', body: { questions } })
  toast.add({ title: t('common.save'), color: 'success' })
}

async function publish() {
  await storeApi(`/surveys/${route.params.id}/publish`, { method: 'POST' })
  toast.add({ title: t('surveys.published'), color: 'success' })
  await router.push(`/surveys/${route.params.id}`)
}
</script>

<template>
  <div v-if="survey" class="space-y-6">
    <LayoutMideskPageHeader :title="t('surveys.editQuestions')">
      <template #actions>
        <LayoutMideskPageHeaderButton variant="primary" icon="i-lucide-send" @click="publish">{{ t('surveys.publish') }}</LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>
    <SurveyQuestionEditor :questions="survey.questions" @save="save" />
  </div>
</template>

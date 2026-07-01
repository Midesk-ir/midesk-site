<script setup lang="ts">
import type { CreateSurveyPayload, Survey } from '~/types/phase5'
import SurveyForm from '~/components/survey/SurveyForm.vue'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const { can } = usePermissions()

const surveys = ref<Survey[]>([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const formRef = ref<InstanceType<typeof SurveyForm> | null>(null)

async function load() {
  loading.value = true
  try {
    surveys.value = (await storeApi<{ data: Survey[] }>('/surveys')).data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

function openForm() {
  showForm.value = true
  nextTick(() => formRef.value?.reset())
}

function closeForm() {
  showForm.value = false
}

async function onCreate(payload: CreateSurveyPayload) {
  saving.value = true
  try {
    const res = await storeApi<{ data: Survey }>('/surveys', { method: 'POST', body: payload })
    closeForm()
    toast.add({ title: t('surveys.created'), color: 'success' })
    await router.push(`/surveys/${res.data.id}/edit`)
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('nav.surveys')" :subtitle="t('surveys.pageSubtitle')">
      <template v-if="can('surveys:manage')" #actions>
        <LayoutMideskPageHeaderButton variant="primary" icon="i-lucide-plus" @click="openForm">
          {{ t('surveys.create') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <div class="mt-6">
      <SurveyList :surveys="surveys" :loading="loading" />
    </div>

    <MideskModal
      v-model:open="showForm"
      :title="t('surveys.create')"
      :description="t('surveys.createModalDesc')"
    >
      <SurveyForm
        v-if="showForm"
        ref="formRef"
        :saving="saving"
        @submit="onCreate"
        @cancel="closeForm"
      />
    </MideskModal>
  </div>
</template>

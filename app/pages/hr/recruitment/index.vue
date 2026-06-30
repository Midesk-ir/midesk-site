<script setup lang="ts">
import type { CreateRequisitionPayload } from '~/types/phase2'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const toast = useToast()
const recruitmentStore = useRecruitmentStore()
const { can } = usePermissions()

const showCreate = ref(false)

async function load() {
  await recruitmentStore.fetchRequisitions()
}

async function onCreate(payload: CreateRequisitionPayload) {
  try {
    await recruitmentStore.createRequisition(payload)
    showCreate.value = false
    toast.add({ title: t('recruitment.requisitions.create'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <h1 class="midesk-page-title">{{ t('nav.hr.recruitment') }}</h1>
      <UButton
        v-if="can('hr:recruitment:manage')"
        icon="i-lucide-plus"
        color="primary"
        class="shrink-0"
        @click="showCreate = true"
      >
        {{ t('recruitment.requisitions.create') }}
      </UButton>
    </div>

    <RecruitmentRequisitionList
      :requisitions="recruitmentStore.requisitions"
      :loading="recruitmentStore.loading"
    />

    <MideskModal v-model:open="showCreate" :title="t('recruitment.requisitions.create')">
      <RecruitmentRequisitionForm @submit="onCreate" />
    </MideskModal>
  </div>
</template>

<script setup lang="ts">
import type { AiQueryPayload } from '~/types/phase4'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const toast = useToast()
const aiStore = useAiStore()
const { listenToAi, emitAiCompleted } = useRealtime()

async function load() {
  await aiStore.fetchRequests()
}

async function runQuery(payload: AiQueryPayload) {
  try {
    const req = await aiStore.submitQuery(payload)
    await aiStore.fetchRequest(req.id)
    setTimeout(async () => {
      const completed = await aiStore.completeRequest(req.id)
      emitAiCompleted(completed)
    }, 1500)
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

function onShortcut(type: string, prompt: string) {
  runQuery({ prompt, type })
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title: t('ai.copied'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(() => {
  load()
  listenToAi?.((req) => {
    aiStore.fetchRequest((req as { id: string }).id)
  })
})
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('nav.ai')" :subtitle="t('ai.subtitle')" />

    <div class="space-y-6">
      <AiPromptInput @submit="runQuery" />

      <div class="midesk-ai-shortcuts">
        <span class="midesk-ai-shortcuts__label">{{ t('ai.shortcuts.label') }}</span>
        <div class="flex flex-wrap gap-2">
          <AiTaskAnalysis @run="onShortcut" />
          <AiDocumentGenerator @run="onShortcut" />
          <AiResumeScreener @run="onShortcut" />
        </div>
      </div>

      <AiDashboard
        :requests="aiStore.requests"
        :loading="aiStore.loading"
        @copy="copyText"
      />
    </div>
  </div>
</template>

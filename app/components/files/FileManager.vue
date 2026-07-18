<script setup lang="ts">
defineProps<{ projectId: string }>()

const { t } = useI18n()
</script>

<template>
  <div class="space-y-4">
    <LayoutMideskPageHeader
      :title="t('files.title')"
      :subtitle="t('files.subtitleComingSoon')"
    />

    <div class="midesk-card files-coming-soon">
      <div class="files-coming-soon__icon">
        <UIcon name="i-lucide-folder-up" class="size-8" />
      </div>
      <p class="files-coming-soon__badge">{{ t('common.comingSoon') }}</p>
      <h3 class="files-coming-soon__title">{{ t('files.title') }}</h3>
      <p class="files-coming-soon__desc">{{ t('files.uploadComingSoon') }}</p>
      <UButton
        size="sm"
        color="primary"
        variant="soft"
        icon="i-lucide-upload-cloud"
        disabled
        class="task-modal-action-btn task-modal-action-btn--primary"
      >
        {{ t('common.comingSoon') }}
      </UButton>
    </div>
  </div>
</template>

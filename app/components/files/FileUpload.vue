<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="files-coming-soon midesk-card">
    <div class="files-coming-soon__icon">
      <UIcon name="i-lucide-upload-cloud" class="size-8" />
    </div>
    <p class="files-coming-soon__badge">{{ t('common.comingSoon') }}</p>
    <p class="files-coming-soon__desc">{{ t('files.uploadComingSoon') }}</p>
    <UButton size="sm" variant="soft" color="primary" disabled>
      {{ t('common.comingSoon') }}
    </UButton>
  </div>
</template>

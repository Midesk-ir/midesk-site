<script setup lang="ts">
definePageMeta({ layout: 'super-admin', middleware: ['super-admin'] })

const { t } = useI18n()
</script>

<template>
  <div>
    <LayoutMideskPageHeader
      :title="t('superAdmin.systemCheck.title')"
      :subtitle="t('superAdmin.systemCheck.subtitle')"
    />

    <div class="mt-6">
      <SuperAdminSaSystemCheck />
    </div>
  </div>
</template>

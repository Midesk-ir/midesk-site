<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })
const { t } = useI18n()
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="t('reports.create')" />
    <ReportsReportBuilder />
  </div>
</template>

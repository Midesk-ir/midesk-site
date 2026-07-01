<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  backTo?: string
  backLabel?: string
}>()
</script>

<template>
  <div class="midesk-page-header-block">
    <LayoutMideskPageHeaderActions
      v-if="backTo"
      class="midesk-page-header-back"
    >
      <LayoutMideskPageHeaderButton :to="backTo" back size="sm">
        <slot name="back">{{ backLabel }}</slot>
      </LayoutMideskPageHeaderButton>
    </LayoutMideskPageHeaderActions>

    <div class="midesk-page-header">
      <div class="min-w-0">
        <slot name="title">
          <h1 v-if="title" class="midesk-page-title">{{ title }}</h1>
          <p v-if="subtitle" class="midesk-page-subtitle">{{ subtitle }}</p>
        </slot>
      </div>
      <LayoutMideskPageHeaderActions v-if="$slots.actions">
        <slot name="actions" />
      </LayoutMideskPageHeaderActions>
    </div>
  </div>
</template>

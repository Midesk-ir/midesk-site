<script setup lang="ts">
export type SegmentTabItem = {
  label: string
  value: string
  icon?: string
}

defineProps<{
  modelValue: string
  items: SegmentTabItem[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="midesk-segment-tabs" role="tablist">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      role="tab"
      class="midesk-segment-tab"
      :class="{ 'is-active': modelValue === item.value }"
      :aria-selected="modelValue === item.value"
      @click="emit('update:modelValue', item.value)"
    >
      <UIcon v-if="item.icon" :name="item.icon" class="size-4 shrink-0" />
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>

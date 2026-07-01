<script setup lang="ts">
defineProps<{ columns: string[], modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]], next: [], back: [] }>()
const { t } = useI18n()

function toggle(col: string, selected: string[]) {
  const set = new Set(selected)
  if (set.has(col)) set.delete(col)
  else set.add(col)
  emit('update:modelValue', [...set])
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="col in columns"
        :key="col"
        size="sm"
        :variant="modelValue.includes(col) ? 'solid' : 'outline'"
        @click="toggle(col, modelValue)"
      >
        {{ col }}
      </UButton>
    </div>
    <div class="flex gap-2">
      <UButton variant="outline" @click="emit('back')">{{ t('common.back') }}</UButton>
      <UButton color="primary" :disabled="!modelValue.length" @click="emit('next')">{{ t('common.next') }}</UButton>
    </div>
  </div>
</template>

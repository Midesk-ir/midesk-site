<script setup lang="ts">
import type { Expense } from '~/types/phase3'

defineProps<{
  expenses: Expense[]
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [expense: Expense]
}>()
</script>

<template>
  <FinanceExpenseList
    :expenses="expenses"
    :loading="loading"
    :show-user="false"
    @select="emit('select', $event)"
  />
</template>

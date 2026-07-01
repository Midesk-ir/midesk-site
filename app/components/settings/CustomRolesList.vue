<script setup lang="ts">
import type { CustomRole } from '~/types/phase5'

defineProps<{
  roles: CustomRole[]
  loading?: boolean
}>()

defineEmits<{ edit: [role: CustomRole], delete: [id: string] }>()

const { t } = useI18n()
const { formatDate } = useCalendar()
</script>

<template>
  <section class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-14" />
    </div>

    <UiEmptyState
      v-else-if="!roles.length"
      :title="t('roles.emptyTitle')"
      :description="t('roles.emptyDesc')"
      icon="i-lucide-shield"
    />

    <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
      <li
        v-for="role in roles"
        :key="role.id"
        class="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
      >
        <div class="min-w-0">
          <p class="font-medium text-[var(--color-midesk-text)]">{{ role.name }}</p>
          <p class="text-sm text-[var(--color-midesk-muted)]">
            {{ t('roles.permissionCount', { count: role.permissions.length }) }}
            · {{ formatDate(role.created_at) }}
          </p>
        </div>
        <div class="flex gap-2">
          <UButton
            size="xs"
            color="neutral"
            variant="soft"
            icon="i-lucide-pencil"
            @click="$emit('edit', role)"
          >
            {{ t('common.edit') }}
          </UButton>
          <UButton
            size="xs"
            color="error"
            variant="soft"
            icon="i-lucide-trash-2"
            @click="$emit('delete', role.id)"
          >
            {{ t('common.delete') }}
          </UButton>
        </div>
      </li>
    </ul>
  </section>
</template>

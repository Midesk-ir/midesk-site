<script setup lang="ts">
import type { NotificationPreference, UpdateNotificationPreferencePayload } from '~/types/phase4'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const toast = useToast()
const { api } = useApi()

const preferences = ref<NotificationPreference[]>([])
const loading = ref(true)

const channelKeys = ['in_app', 'email', 'sms', 'push', 'telegram'] as const

async function load() {
  loading.value = true
  try {
    const res = await api<{ data: NotificationPreference[] }>('/notification-preferences')
    preferences.value = res.data
  } finally {
    loading.value = false
  }
}

async function toggle(eventType: string, channel: typeof channelKeys[number], value: boolean) {
  const payload: UpdateNotificationPreferencePayload = {
    channels: { [channel]: value }
  }
  try {
    const res = await api<{ data: NotificationPreference }>(
      `/notification-preferences/${eventType}`,
      { method: 'PATCH', body: payload }
    )
    const idx = preferences.value.findIndex(p => p.event_type === eventType)
    if (idx >= 0) preferences.value[idx] = res.data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader
      back-to="/settings"
      :back-label="t('nav.settings')"
      :title="t('notifications.settings.title')"
      :subtitle="t('notifications.settings.subtitle')"
    />

    <USkeleton v-if="loading" class="h-64" />

    <div v-else class="midesk-glass overflow-x-auto rounded-xl border border-[var(--color-midesk-border)]">
      <table class="midesk-table w-full min-w-[640px]">
        <thead>
          <tr>
            <th>{{ t('notifications.settings.event') }}</th>
            <th v-for="key in channelKeys" :key="key" class="text-center">{{ t(`notifications.settings.channels.${key}`) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pref in preferences" :key="pref.event_type">
            <td class="font-medium text-[var(--color-midesk-text)]">{{ pref.event_label }}</td>
            <td v-for="key in channelKeys" :key="key" class="text-center">
              <USwitch
                :model-value="pref.channels[key]"
                @update:model-value="toggle(pref.event_type, key, $event as boolean)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

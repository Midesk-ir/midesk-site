<script setup lang="ts">
import type { NotificationPreference, UpdateNotificationPreferencePayload } from '~/types/phase4'

defineProps<{ preferences: NotificationPreference[] }>()
const emit = defineEmits<{ update: [eventType: string, payload: UpdateNotificationPreferencePayload] }>()

const { t } = useI18n()
const channelKeys = ['in_app', 'email', 'sms', 'push', 'telegram'] as const

function onToggle(eventType: string, channel: typeof channelKeys[number], value: boolean) {
  emit('update', eventType, { channels: { [channel]: value } })
}
</script>

<template>
  <div class="midesk-glass overflow-x-auto rounded-xl border border-[var(--color-midesk-border)]">
    <table class="midesk-table w-full min-w-[640px]">
      <thead>
        <tr>
          <th>{{ t('notifications.settings.event') }}</th>
          <th v-for="key in channelKeys" :key="key" class="text-center">{{ t(`notifications.settings.channels.${key}`) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pref in preferences" :key="pref.event_type">
          <td class="font-medium">{{ pref.event_label }}</td>
          <td v-for="key in channelKeys" :key="key" class="text-center">
            <USwitch
              :model-value="pref.channels[key]"
              @update:model-value="onToggle(pref.event_type, key, $event as boolean)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

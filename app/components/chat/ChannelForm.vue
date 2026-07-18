<script setup lang="ts">
import type { CreateChatChannelPayload, ChatChannelType } from '~/types/phase4'
import type { User } from '~/types'

const props = withDefaults(defineProps<{
  members?: User[]
  defaultType?: ChatChannelType
  loading?: boolean
}>(), {
  defaultType: 'group',
  loading: false
})

const emit = defineEmits<{
  submit: [payload: CreateChatChannelPayload]
  cancel: []
  'update:type': [type: ChatChannelType]
}>()

const { t } = useI18n()
const authStore = useAuthStore()

const form = reactive({
  type: props.defaultType,
  name: '',
  description: '',
  member_ids: [] as string[],
  dm_user_id: '' as string
})

watch(() => props.defaultType, (type) => {
  form.type = type
  resetFields()
})

watch(() => form.type, (type) => {
  resetFields()
  emit('update:type', type)
})

const typeItems = computed(() => [
  { label: t('chat.tabs.dm'), value: 'dm' as const, icon: 'i-lucide-user' },
  { label: t('chat.tabs.group'), value: 'group' as const, icon: 'i-lucide-users' },
  { label: t('chat.tabs.channel'), value: 'channel' as const, icon: 'i-lucide-hash' }
])

const availableMembers = computed(() =>
  (props.members ?? []).filter(m => m.id !== authStore.user?.id)
)

const memberItems = computed(() =>
  availableMembers.value.map(m => ({ label: m.name, value: m.id }))
)

const submitLabel = computed(() => {
  switch (form.type) {
    case 'dm':
      return t('chat.actions.startDm')
    case 'group':
      return t('chat.actions.createGroup')
    default:
      return t('chat.actions.createChannel')
  }
})

const typeHint = computed(() => {
  switch (form.type) {
    case 'dm':
      return t('chat.hints.dm')
    case 'group':
      return t('chat.hints.group')
    default:
      return t('chat.hints.channel')
  }
})

const canSubmit = computed(() => {
  if (props.loading) return false
  if (form.type === 'dm') return !!form.dm_user_id
  if (!form.name.trim()) return false
  if (form.type === 'group') return form.member_ids.length >= 1
  return true
})

function resetFields() {
  form.name = ''
  form.description = ''
  form.member_ids = []
  form.dm_user_id = ''
}

function onSubmit() {
  if (!canSubmit.value) return

  if (form.type === 'dm') {
    emit('submit', { type: 'dm', member_ids: [form.dm_user_id] })
    return
  }

  emit('submit', {
    type: form.type,
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    member_ids: form.member_ids,
    is_readonly: form.type === 'channel'
  })
}
</script>

<template>
  <form class="midesk-form-fields midesk-form-panel" @submit.prevent="onSubmit">
    <p class="text-sm text-[var(--color-midesk-muted)]">{{ typeHint }}</p>

    <div class="midesk-chat-type-tabs" role="tablist" :aria-label="t('chat.fields.type')">
      <button
        v-for="item in typeItems"
        :key="item.value"
        type="button"
        role="tab"
        class="midesk-chat-type-tab"
        :class="{ 'is-active': form.type === item.value }"
        :aria-selected="form.type === item.value"
        @click="form.type = item.value"
      >
        <UIcon :name="item.icon" class="size-4 shrink-0" aria-hidden="true" />
        <span class="midesk-chat-type-tab__label">{{ item.label }}</span>
      </button>
    </div>

    <MideskFormField
      v-if="form.type === 'dm'"
      :label="t('chat.fields.dmUser')"
      :model-value="form.dm_user_id"
      required
    >
      <USelectMenu
        v-model="form.dm_user_id"
        :items="memberItems"
        value-key="value"
        :placeholder="t('chat.fields.dmUserPlaceholder')"
      />
    </MideskFormField>

    <template v-else>
      <MideskFormField :label="t('chat.fields.name')" :model-value="form.name" required>
        <UInput v-model="form.name" placeholder=" " />
      </MideskFormField>

      <MideskFormField
        v-if="form.type === 'channel'"
        :label="t('chat.fields.description')"
        :model-value="form.description"
      >
        <UTextarea v-model="form.description" :rows="2" placeholder=" " />
      </MideskFormField>

      <MideskFormField
        :label="form.type === 'group' ? t('chat.fields.members') : t('chat.fields.channelMembers')"
        :model-value="form.member_ids.join(',')"
        :required="form.type === 'group'"
      >
        <USelectMenu
          v-model="form.member_ids"
          :items="memberItems"
          value-key="value"
          multiple
          :placeholder="t('chat.fields.membersPlaceholder')"
        />
      </MideskFormField>

      <p v-if="form.type === 'group'" class="text-xs text-[var(--color-midesk-muted)]">
        {{ t('chat.hints.groupMembers') }}
      </p>
      <p v-else class="text-xs text-[var(--color-midesk-muted)]">
        {{ t('chat.hints.channelMembers') }}
      </p>
    </template>

    <div class="flex justify-end gap-2 pt-2">
      <UButton type="button" variant="ghost" :disabled="loading" @click="emit('cancel')">
        {{ t('common.cancel') }}
      </UButton>
      <UButton type="submit" color="primary" :loading="loading" :disabled="!canSubmit">
        {{ submitLabel }}
      </UButton>
    </div>
  </form>
</template>

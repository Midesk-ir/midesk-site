<script setup lang="ts">
import type { CreateChatChannelPayload } from '~/types/phase4'
import type { User } from '~/types'

const props = defineProps<{ members?: User[] }>()
const emit = defineEmits<{ submit: [payload: CreateChatChannelPayload] }>()

const { t } = useI18n()

const form = reactive<CreateChatChannelPayload>({
  type: 'group',
  name: '',
  member_ids: [],
  description: ''
})

const typeItems = computed(() => [
  { label: t('chat.types.group'), value: 'group' },
  { label: t('chat.types.channel'), value: 'channel' },
  { label: t('chat.types.dm'), value: 'dm' }
])

const memberItems = computed(() =>
  (props.members ?? []).map(m => ({ label: m.name, value: m.id }))
)

function onSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('chat.fields.type')" :model-value="form.type">
      <USelect v-model="form.type" :items="typeItems" />
    </MideskFormField>
    <MideskFormField v-if="form.type !== 'dm'" :label="t('chat.fields.name')" :model-value="form.name">
      <UInput v-model="form.name" placeholder=" " />
    </MideskFormField>
    <MideskFormField :label="t('chat.fields.members')" :model-value="form.member_ids.join(',')">
      <USelectMenu v-model="form.member_ids" :items="memberItems" multiple value-key="value" />
    </MideskFormField>
    <div class="flex justify-end">
      <UButton type="submit" color="primary">{{ t('chat.create') }}</UButton>
    </div>
  </form>
</template>

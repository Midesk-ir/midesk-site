<script setup lang="ts">
import type { User } from '~/types'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'admin'] })

const { t } = useI18n()
const { api } = useApi()

const members = ref<User[]>([])
const loading = ref(true)
const showInvite = ref(false)
const inviting = ref(false)
const inviteForm = reactive({ email: '', role: 'MEMBER' as 'ADMIN' | 'MANAGER' | 'MEMBER' })

async function load() {
  loading.value = true
  try {
    const data = await api<{ data: User[] }>('/members')
    members.value = data.data
  } finally {
    loading.value = false
  }
}

async function invite() {
  inviting.value = true
  try {
    await api('/orgs/current/members/invite', {
      method: 'POST',
      body: inviteForm
    })
    showInvite.value = false
    inviteForm.email = ''
    await load()
  } finally {
    inviting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <h1 class="midesk-page-title">{{ t('members.title') }}</h1>
      <UButton icon="i-lucide-user-plus" color="primary" class="shrink-0" @click="showInvite = true">
        {{ t('members.invite') }}
      </UButton>
    </div>

    <UCard v-if="loading" class="midesk-glass border-[var(--color-midesk-border)]">
      <USkeleton v-for="i in 3" :key="i" class="mb-3 h-12" />
    </UCard>

    <UCard v-else class="midesk-glass border-[var(--color-midesk-border)]">
      <ul class="divide-y divide-[var(--color-midesk-border)]">
        <li
          v-for="member in members"
          :key="member.id"
          class="flex flex-wrap items-center justify-between gap-3 p-4"
        >
          <div class="flex items-center gap-3">
            <UAvatar :alt="member.name" icon="i-lucide-user" />
            <div>
              <p class="font-medium">{{ member.name }}</p>
              <p class="text-sm text-muted">{{ member.email || member.phone }}</p>
            </div>
          </div>
          <UBadge variant="subtle">{{ t(`members.roles.${member.role}`) }}</UBadge>
        </li>
      </ul>
    </UCard>

    <MideskModal v-model:open="showInvite" :title="t('members.invite')">
      <div class="midesk-form-fields midesk-form-panel">
        <MideskFormField
          :label="t('auth.email')"
          :model-value="inviteForm.email"
          field-class="midesk-ltr-field"
        >
          <UInput v-model="inviteForm.email" type="email" placeholder=" " />
        </MideskFormField>
        <MideskFormField :label="t('members.role')" :model-value="inviteForm.role">
          <USelect
            v-model="inviteForm.role"
            :items="(['ADMIN','MANAGER','MEMBER'] as const).map(r => ({
              label: t(`members.roles.${r}`),
              value: r
            }))"
          />
        </MideskFormField>
      </div>
      <template #footer>
        <div class="w-full sm:w-auto">
          <UButton block :loading="inviting" color="primary" @click="invite">
            {{ t('members.invite') }}
          </UButton>
        </div>
      </template>
    </MideskModal>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
import { readApiError } from '~/utils/api-fetch'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'admin'] })

const { t } = useI18n()
const { api } = useApi()
const toast = useToast()

const members = ref<User[]>([])
const loading = ref(true)
const showInvite = ref(false)
const inviting = ref(false)
const inviteError = ref('')
const inviteForm = reactive({
  identifier: '',
  role: 'MEMBER' as 'ADMIN' | 'MANAGER' | 'MEMBER'
})

const roleItems = computed(() =>
  (['ADMIN', 'MANAGER', 'MEMBER'] as const).map(r => ({
    label: t(`members.roles.${r}`),
    value: r
  }))
)

async function load() {
  loading.value = true
  try {
    const data = await api<{ data: User[] }>('/members')
    members.value = data.data
  } finally {
    loading.value = false
  }
}

function openInvite() {
  inviteError.value = ''
  inviteForm.identifier = ''
  inviteForm.role = 'MEMBER'
  showInvite.value = true
}

async function invite() {
  const identifier = inviteForm.identifier.trim()
  if (!identifier) {
    inviteError.value = t('common.fillRequired')
    return
  }

  const identifierField = identifier.includes('@') ? 'email' : 'phone'
  inviting.value = true
  inviteError.value = ''
  try {
    await api('/orgs/current/members/invite', {
      method: 'POST',
      body: {
        [identifierField]: identifier,
        role: inviteForm.role
      }
    })
    showInvite.value = false
    inviteForm.identifier = ''
    inviteForm.role = 'MEMBER'
    toast.add({ title: t('members.inviteSuccess'), color: 'success' })
    await load()
  } catch (error) {
    inviteError.value = readApiError(error, 'email')
      || readApiError(error, 'phone')
      || readApiError(error, 'role')
      || readApiError(error)
      || t('common.error')
    toast.add({ title: inviteError.value, color: 'error' })
  } finally {
    inviting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <h1 class="midesk-page-title">
        {{ t('members.title') }}
      </h1>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton
          variant="primary"
          icon="i-lucide-user-plus"
          @click="openInvite"
        >
          {{ t('members.invite') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <UCard
      v-if="loading"
      class="midesk-glass border-[var(--color-midesk-border)]"
    >
      <USkeleton
        v-for="i in 3"
        :key="i"
        class="mb-3 h-12"
      />
    </UCard>

    <UCard
      v-else
      class="midesk-glass border-[var(--color-midesk-border)]"
    >
      <ul class="divide-y divide-[var(--color-midesk-border)]">
        <li
          v-for="member in members"
          :key="member.id"
          class="flex flex-wrap items-center justify-between gap-3 p-4"
        >
          <div class="flex items-center gap-3">
            <UAvatar
              :alt="member.name"
              icon="i-lucide-user"
            />
            <div>
              <p class="font-medium">
                {{ member.name }}
              </p>
              <p class="text-sm text-muted">
                {{ member.email || member.phone }}
              </p>
            </div>
          </div>
          <UBadge variant="subtle">
            {{ t(`members.roles.${member.role}`) }}
          </UBadge>
        </li>
      </ul>
    </UCard>

    <MideskModal
      v-model:open="showInvite"
      :title="t('members.invite')"
    >
      <div class="midesk-form-fields midesk-form-panel">
        <p class="text-sm text-[var(--color-midesk-muted)]">
          {{ t('members.inviteHint') }}
        </p>
        <MideskFormField
          :label="t('members.emailOrPhone')"
          :model-value="inviteForm.identifier"
          :error="inviteError || undefined"
          field-class="midesk-ltr-field"
          required
        >
          <UInput
            v-model="inviteForm.identifier"
            type="text"
            inputmode="email"
            :placeholder="t('members.emailOrPhonePlaceholder')"
            @update:model-value="inviteError = ''"
          />
        </MideskFormField>
        <MideskFormField
          :label="t('members.role')"
          :model-value="inviteForm.role"
        >
          <USelect
            v-model="inviteForm.role"
            value-key="value"
            label-key="label"
            :items="roleItems"
          />
        </MideskFormField>
      </div>
      <template #footer>
        <div class="w-full sm:w-auto">
          <UButton
            block
            color="primary"
            :loading="inviting"
            :disabled="!inviteForm.identifier.trim()"
            @click="invite"
          >
            {{ t('members.invite') }}
          </UButton>
        </div>
      </template>
    </MideskModal>
  </div>
</template>

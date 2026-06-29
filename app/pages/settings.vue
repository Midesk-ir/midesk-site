<script setup lang="ts">
import type { Tenant, User } from '~/types'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const { api } = useApi()
const authStore = useAuthStore()
const { updateOrg } = useTenant()
const toast = useToast()

const profile = reactive({
  name: authStore.user?.name ?? '',
  password: ''
})

const org = reactive<Omit<Tenant, 'id'> & { name: string }>({
  name: '',
  locale: 'fa-IR',
  calendar_type: 'jalali' as 'jalali' | 'gregorian',
  region: 'IR' as 'IR' | 'INTL',
  default_currency: 'IRR',
  timezone: 'Asia/Tehran'
})

const saving = ref(false)

onMounted(async () => {
  const tenant = await api<Tenant>('/orgs/current')
  Object.assign(org, tenant)
  profile.name = authStore.user?.name ?? ''
})

async function saveProfile() {
  saving.value = true
  try {
    const user = await api<User>('/core/me', {
      method: 'PATCH',
      body: { name: profile.name, ...(profile.password ? { password: profile.password } : {}) }
    })
    authStore.user = user
    toast.add({ title: t('settings.saved'), color: 'success' })
  } finally {
    saving.value = false
  }
}

async function saveOrg() {
  saving.value = true
  try {
    await updateOrg(org)
    toast.add({ title: t('settings.saved'), color: 'success' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold mb-1">{{ t('settings.title') }}</h1>

    <div class="max-w-xl space-y-6">
      <UCard class="midesk-glass border-[var(--color-midesk-border)]">
        <template #header>{{ t('settings.profile') }}</template>
        <div class="midesk-form-fields">
          <MideskFormField :label="t('auth.name')" :model-value="profile.name">
            <UInput v-model="profile.name" placeholder=" " />
          </MideskFormField>
          <MideskFormField :label="t('settings.newPassword')" :model-value="profile.password">
            <UInput v-model="profile.password" type="password" placeholder=" " />
          </MideskFormField>
          <UButton :loading="saving" color="primary" @click="saveProfile">
            {{ t('settings.save') }}
          </UButton>
        </div>
      </UCard>

      <UCard class="midesk-glass border-[var(--color-midesk-border)]">
        <template #header>{{ t('settings.organization') }}</template>
        <div class="midesk-form-fields">
          <MideskFormField :label="t('onboarding.orgName')" :model-value="org.name">
            <UInput v-model="org.name" placeholder=" " />
          </MideskFormField>
          <MideskFormField :label="t('onboarding.calendar')" :model-value="org.calendar_type">
            <USelect
              v-model="org.calendar_type"
              :items="[
                { label: t('onboarding.calendarJalali'), value: 'jalali' },
                { label: t('onboarding.calendarGregorian'), value: 'gregorian' }
              ]"
            />
          </MideskFormField>
          <MideskFormField
            :label="t('onboarding.currency')"
            :model-value="org.default_currency"
            field-class="midesk-ltr-field"
          >
            <UInput v-model="org.default_currency" dir="ltr" placeholder=" " />
          </MideskFormField>
          <MideskFormField
            :label="t('onboarding.timezone')"
            :model-value="org.timezone"
            field-class="midesk-ltr-field"
          >
            <UInput v-model="org.timezone" dir="ltr" placeholder=" " />
          </MideskFormField>
          <UButton :loading="saving" color="primary" @click="saveOrg">
            {{ t('settings.save') }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

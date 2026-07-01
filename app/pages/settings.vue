<script setup lang="ts">
import type { Tenant, User } from '~/types'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const { api } = useApi()
const authStore = useAuthStore()
const { updateOrg } = useTenant()
const toast = useToast()
const route = useRoute()

const loading = ref(true)
const profileSaving = ref(false)
const orgSaving = ref(false)

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

const tabItems = computed(() => [
  { label: t('settings.profile'), value: 'profile', icon: 'i-lucide-user' },
  { label: t('settings.organization'), value: 'organization', icon: 'i-lucide-building-2' }
])

const activeTab = ref('profile')

watch(tabItems, () => {
  const fromQuery = route.query.tab as string | undefined
  if (fromQuery && tabItems.value.some(i => i.value === fromQuery)) {
    activeTab.value = fromQuery
  }
}, { immediate: true })

onMounted(async () => {
  loading.value = true
  try {
    const tenant = await api<Tenant>('/orgs/current')
    Object.assign(org, tenant)
    profile.name = authStore.user?.name ?? ''
  } finally {
    loading.value = false
  }
})

async function saveProfile() {
  profileSaving.value = true
  try {
    const user = await api<User>('/core/me', {
      method: 'PATCH',
      body: { name: profile.name, ...(profile.password ? { password: profile.password } : {}) }
    })
    authStore.user = user
    profile.password = ''
    toast.add({ title: t('settings.saved'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    profileSaving.value = false
  }
}

async function saveOrg() {
  orgSaving.value = true
  try {
    await updateOrg(org)
    toast.add({ title: t('settings.saved'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    orgSaving.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="midesk-page-title mb-6">{{ t('settings.title') }}</h1>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-10 w-64 rounded-lg" />
      <USkeleton class="midesk-skeleton-card h-64 max-w-xl" />
    </div>

    <div v-else class="space-y-6">
      <UTabs v-model="activeTab" :items="tabItems" :content="false" class="w-full" />

      <div v-if="activeTab === 'profile'" class="max-w-xl">
        <UCard class="midesk-glass border-[var(--color-midesk-border)]">
          <template #header>
            <div>
              <p class="font-semibold">{{ t('settings.profile') }}</p>
              <p class="mt-0.5 text-sm font-normal text-[var(--color-midesk-muted)]">
                {{ t('settings.tabs.profileDesc') }}
              </p>
            </div>
          </template>
          <div class="midesk-form-fields">
            <MideskFormField :label="t('auth.name')" :model-value="profile.name">
              <UInput v-model="profile.name" placeholder=" " />
            </MideskFormField>
            <MideskFormField :label="t('settings.newPassword')" :model-value="profile.password">
              <UInput v-model="profile.password" type="password" placeholder=" " />
            </MideskFormField>
            <UButton :loading="profileSaving" color="primary" @click="saveProfile">
              {{ t('settings.save') }}
            </UButton>
          </div>
        </UCard>
      </div>

      <div v-else class="max-w-xl">
        <UCard class="midesk-glass border-[var(--color-midesk-border)]">
          <template #header>
            <div>
              <p class="font-semibold">{{ t('settings.organization') }}</p>
              <p class="mt-0.5 text-sm font-normal text-[var(--color-midesk-muted)]">
                {{ t('settings.tabs.organizationDesc') }}
              </p>
            </div>
          </template>
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
            <UButton :loading="orgSaving" color="primary" @click="saveOrg">
              {{ t('settings.save') }}
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

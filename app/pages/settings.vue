<script setup lang="ts">
import type { Tenant, User } from '~/types'
import type {
  CreateCustomRolePayload,
  CustomRole,
  GuestAccess,
  InviteGuestPayload
} from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

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

const guests = ref<GuestAccess[]>([])
const customRoles = ref<CustomRole[]>([])
const guestsLoading = ref(false)
const rolesLoading = ref(false)
const showGuestForm = ref(false)
const showRoleForm = ref(false)
const editingRole = ref<CustomRole | null>(null)

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

const tabItems = computed(() => {
  const items = [
    { label: t('settings.profile'), value: 'profile', icon: 'i-lucide-user' },
    { label: t('settings.organization'), value: 'organization', icon: 'i-lucide-building-2' }
  ]
  if (authStore.isAdmin) {
    items.push(
      { label: t('guest.title'), value: 'guests', icon: 'i-lucide-user-plus' },
      { label: t('roles.title'), value: 'roles', icon: 'i-lucide-shield' }
    )
  }
  return items
})

const activeTab = ref('profile')

const showEditRoleModal = computed({
  get: () => editingRole.value !== null,
  set: (open) => { if (!open) editingRole.value = null }
})

watch(tabItems, () => {
  const fromQuery = route.query.tab as string | undefined
  if (fromQuery && tabItems.value.some(i => i.value === fromQuery)) {
    activeTab.value = fromQuery
  }
}, { immediate: true })

watch(activeTab, (tab) => {
  if (tab === 'guests') loadGuests()
  if (tab === 'roles') loadRoles()
})

async function loadGuests() {
  guestsLoading.value = true
  try {
    const res = await storeApi<{ data: GuestAccess[] }>('/guests')
    guests.value = res.data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    guestsLoading.value = false
  }
}

async function loadRoles() {
  rolesLoading.value = true
  try {
    const res = await storeApi<{ data: CustomRole[] }>('/roles/custom')
    customRoles.value = res.data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    rolesLoading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const tenant = await api<Tenant>('/orgs/current')
    Object.assign(org, tenant)
    profile.name = authStore.user?.name ?? ''
    if (activeTab.value === 'guests') await loadGuests()
    if (activeTab.value === 'roles') await loadRoles()
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

async function onInviteGuest(payload: InviteGuestPayload) {
  try {
    await storeApi('/guests', { method: 'POST', body: payload })
    showGuestForm.value = false
    toast.add({ title: t('guest.invited'), color: 'success' })
    await loadGuests()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onRevokeGuest(id: string) {
  try {
    await storeApi(`/guests/${id}`, { method: 'DELETE' })
    toast.add({ title: t('guest.revoked'), color: 'success' })
    await loadGuests()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

function openCreateRole() {
  editingRole.value = null
  showRoleForm.value = true
}

function openEditRole(role: CustomRole) {
  editingRole.value = role
}

async function onSaveRole(payload: CreateCustomRolePayload) {
  try {
    if (editingRole.value) {
      await storeApi(`/roles/custom/${editingRole.value.id}`, { method: 'PATCH', body: payload })
    } else {
      await storeApi('/roles/custom', { method: 'POST', body: payload })
    }
    showRoleForm.value = false
    editingRole.value = null
    toast.add({ title: t('settings.saved'), color: 'success' })
    await loadRoles()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onDeleteRole(id: string) {
  try {
    await storeApi(`/roles/custom/${id}`, { method: 'DELETE' })
    toast.add({ title: t('settings.saved'), color: 'success' })
    await loadRoles()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('settings.title')">
      <template #actions>
        <LayoutMideskPageHeaderButton to="/settings/notifications" icon="i-lucide-bell">
          {{ t('notifications.settings.title') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

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

      <div v-else-if="activeTab === 'organization'" class="max-w-xl">
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

      <div v-else-if="activeTab === 'guests'" class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="font-semibold">{{ t('guest.title') }}</p>
            <p class="mt-0.5 text-sm text-[var(--color-midesk-muted)]">{{ t('settings.tabs.guestsDesc') }}</p>
          </div>
          <UButton color="primary" icon="i-lucide-user-plus" @click="showGuestForm = true">
            {{ t('guest.invite') }}
          </UButton>
        </div>
        <GuestGuestList
          :guests="guests"
          :loading="guestsLoading"
          @revoke="onRevokeGuest"
        />
      </div>

      <div v-else-if="activeTab === 'roles'" class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="font-semibold">{{ t('roles.title') }}</p>
            <p class="mt-0.5 text-sm text-[var(--color-midesk-muted)]">{{ t('settings.tabs.rolesDesc') }}</p>
          </div>
          <UButton color="primary" icon="i-lucide-plus" @click="openCreateRole">
            {{ t('roles.create') }}
          </UButton>
        </div>
        <SettingsCustomRolesList
          :roles="customRoles"
          :loading="rolesLoading"
          @edit="openEditRole"
          @delete="onDeleteRole"
        />
      </div>
    </div>

    <MideskModal v-model:open="showGuestForm" :title="t('guest.invite')">
      <GuestGuestInviteForm @submit="onInviteGuest" @cancel="showGuestForm = false" />
    </MideskModal>

    <MideskModal v-model:open="showRoleForm" :title="t('roles.create')">
      <SettingsCustomRoleForm @submit="onSaveRole" @cancel="showRoleForm = false" />
    </MideskModal>

    <MideskModal v-model:open="showEditRoleModal" :title="t('roles.edit')">
      <SettingsCustomRoleForm
        v-if="editingRole"
        :initial="editingRole"
        @submit="onSaveRole"
        @cancel="editingRole = null"
      />
    </MideskModal>
  </div>
</template>

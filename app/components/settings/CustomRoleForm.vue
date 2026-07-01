<script setup lang="ts">
import type { CreateCustomRolePayload, CustomRole } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

const props = defineProps<{
  initial?: CustomRole | null
}>()

const emit = defineEmits<{ submit: [payload: CreateCustomRolePayload], cancel: [] }>()

const { t } = useI18n()

const permissionsLoading = ref(true)
const allPermissions = ref<string[]>([])

const form = reactive<CreateCustomRolePayload>({
  name: '',
  permissions: []
})

const permissionGroups = computed(() => {
  const groups = new Map<string, string[]>()
  for (const perm of allPermissions.value) {
    const group = perm.split(':')[0] ?? 'other'
    const list = groups.get(group) ?? []
    list.push(perm)
    groups.set(group, list)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, permissions]) => ({
      group,
      label: t(`roles.groups.${group}`, group),
      permissions: permissions.sort()
    }))
})

watch(() => props.initial, (role) => {
  if (role) {
    form.name = role.name
    form.permissions = [...role.permissions]
  } else {
    form.name = ''
    form.permissions = []
  }
}, { immediate: true })

onMounted(async () => {
  permissionsLoading.value = true
  try {
    const res = await storeApi<{ data: string[] }>('/roles/permissions')
    allPermissions.value = res.data
  } finally {
    permissionsLoading.value = false
  }
})

function togglePermission(perm: string, checked: boolean) {
  if (checked) {
    if (!form.permissions.includes(perm)) form.permissions.push(perm)
  } else {
    form.permissions = form.permissions.filter(p => p !== perm)
  }
}

function toggleGroup(permissions: string[], checked: boolean) {
  if (checked) {
    const next = new Set(form.permissions)
    permissions.forEach(p => next.add(p))
    form.permissions = [...next]
  } else {
    const remove = new Set(permissions)
    form.permissions = form.permissions.filter(p => !remove.has(p))
  }
}

function isGroupChecked(permissions: string[]) {
  return permissions.length > 0 && permissions.every(p => form.permissions.includes(p))
}

function isGroupIndeterminate(permissions: string[]) {
  const selected = permissions.filter(p => form.permissions.includes(p)).length
  return selected > 0 && selected < permissions.length
}

function onSubmit() {
  emit('submit', { name: form.name, permissions: [...form.permissions] })
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('roles.fields.name')" :model-value="form.name">
      <UInput v-model="form.name" placeholder=" " required />
    </MideskFormField>

    <div>
      <p class="mb-2 text-sm text-[var(--color-midesk-muted)]">{{ t('roles.fields.permissions') }}</p>
      <div v-if="permissionsLoading" class="space-y-3">
        <USkeleton v-for="i in 3" :key="i" class="h-20" />
      </div>
      <div v-else class="max-h-80 space-y-4 overflow-y-auto rounded-lg border border-[var(--color-midesk-border)] p-3">
        <section v-for="group in permissionGroups" :key="group.group">
          <div class="mb-2 flex items-center gap-2">
            <UCheckbox
              :model-value="isGroupChecked(group.permissions)"
              :indeterminate="isGroupIndeterminate(group.permissions)"
              :label="group.label"
              @update:model-value="toggleGroup(group.permissions, $event === true)"
            />
          </div>
          <div class="ms-6 space-y-1.5">
            <UCheckbox
              v-for="perm in group.permissions"
              :key="perm"
              :model-value="form.permissions.includes(perm)"
              :label="perm"
              class="midesk-ltr-field"
              @update:model-value="togglePermission(perm, $event === true)"
            />
          </div>
        </section>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <UButton type="button" variant="ghost" color="neutral" @click="emit('cancel')">
        {{ t('common.cancel') }}
      </UButton>
      <UButton type="submit" color="primary" :disabled="!form.name.trim()">
        {{ t('common.save') }}
      </UButton>
    </div>
  </form>
</template>

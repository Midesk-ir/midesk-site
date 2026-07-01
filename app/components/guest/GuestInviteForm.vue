<script setup lang="ts">
import type { InviteGuestPayload } from '~/types/phase5'
import type { Project } from '~/types'
import { storeApi } from '~/utils/api-client'

const emit = defineEmits<{ submit: [payload: InviteGuestPayload], cancel: [] }>()

const { t } = useI18n()

const projects = ref<Project[]>([])
const projectsLoading = ref(true)

const form = reactive<InviteGuestPayload>({
  email: '',
  name: '',
  role: 'viewer',
  project_ids: [],
  expires_at: ''
})

const roleItems = computed(() => [
  { label: t('guest.roles.viewer'), value: 'viewer' as const },
  { label: t('guest.roles.commenter'), value: 'commenter' as const }
])

onMounted(async () => {
  projectsLoading.value = true
  try {
    const res = await storeApi<{ data: Project[] }>('/projects')
    projects.value = res.data
    if (!form.project_ids.length && projects.value.length) {
      form.project_ids = [projects.value[0]!.id]
    }
  } catch {
    projects.value = [{ id: 'p1', name: 'Project 1' } as Project]
    form.project_ids = ['p1']
  } finally {
    projectsLoading.value = false
  }
})

function toggleProject(id: string, checked: boolean) {
  if (checked) {
    if (!form.project_ids.includes(id)) form.project_ids.push(id)
  } else {
    form.project_ids = form.project_ids.filter(pid => pid !== id)
  }
}

function onSubmit() {
  emit('submit', { ...form, project_ids: [...form.project_ids] })
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('guest.fields.email')" :model-value="form.email" field-class="midesk-ltr-field">
      <UInput v-model="form.email" type="email" dir="ltr" placeholder=" " required />
    </MideskFormField>
    <MideskFormField :label="t('guest.fields.name')" :model-value="form.name">
      <UInput v-model="form.name" placeholder=" " required />
    </MideskFormField>
    <MideskFormField :label="t('guest.fields.role')" :model-value="form.role">
      <USelect v-model="form.role" :items="roleItems" />
    </MideskFormField>
    <div>
      <p class="mb-2 text-sm text-[var(--color-midesk-muted)]">{{ t('guest.fields.projects') }}</p>
      <div v-if="projectsLoading" class="space-y-2">
        <USkeleton v-for="i in 2" :key="i" class="h-8" />
      </div>
      <div v-else class="space-y-2 rounded-lg border border-[var(--color-midesk-border)] p-3">
        <UCheckbox
          v-for="project in projects"
          :key="project.id"
          :model-value="form.project_ids.includes(project.id)"
          :label="project.name"
          @update:model-value="toggleProject(project.id, $event === true)"
        />
      </div>
    </div>
    <MideskFormField :label="t('guest.fields.expiresAt')" :model-value="form.expires_at">
      <MideskDatePicker v-model="form.expires_at" />
    </MideskFormField>
    <div class="flex justify-end gap-2">
      <UButton type="button" variant="ghost" color="neutral" @click="emit('cancel')">
        {{ t('common.cancel') }}
      </UButton>
      <UButton type="submit" color="primary" :disabled="!form.email || !form.name || !form.expires_at || !form.project_ids.length">
        {{ t('guest.invite') }}
      </UButton>
    </div>
  </form>
</template>

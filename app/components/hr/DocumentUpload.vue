<script setup lang="ts">
import type { DocumentCategory, HrDocument, Personnel } from '~/types/phase2'

const props = defineProps<{
  personnel: Personnel[]
}>()

const emit = defineEmits<{
  uploaded: [doc: HrDocument]
}>()

const { t } = useI18n()
const { api } = useApi()
const toast = useToast()

const submitting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)

const form = reactive({
  personnel_id: '',
  category: 'other' as DocumentCategory
})

const personnelItems = computed(() =>
  props.personnel.map(p => ({
    label: `${p.user.name} (${p.employee_code})`,
    value: p.id
  }))
)

const categoryItems = computed(() =>
  (['contract', 'id', 'certificate', 'other'] as DocumentCategory[]).map(cat => ({
    label: t(`hr.documents.category.${cat}`),
    value: cat
  }))
)

watch(
  () => props.personnel,
  (list) => {
    if (list.length && !form.personnel_id) {
      form.personnel_id = list[0]!.id
    }
  },
  { immediate: true }
)

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
}

async function submit() {
  if (!form.personnel_id || !form.category || !selectedFile.value) return

  submitting.value = true
  try {
    const body = new FormData()
    body.append('personnel_id', form.personnel_id)
    body.append('category', form.category)
    body.append('file', selectedFile.value)

    const res = await api<{ data: HrDocument }>('/hr/documents', {
      method: 'POST',
      body
    })

    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
    emit('uploaded', res.data)
    toast.add({ title: t('hr.documents.uploadSuccess'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
    <h2 class="midesk-card-header">{{ t('hr.documents.upload') }}</h2>

    <form class="midesk-form-fields" @submit.prevent="submit">
      <MideskFormField :label="t('hr.documents.fields.personnel')" :model-value="form.personnel_id" required>
        <USelect v-model="form.personnel_id" :items="personnelItems" />
      </MideskFormField>

      <MideskFormField :label="t('hr.documents.fields.category')" :model-value="form.category" required>
        <USelect v-model="form.category" :items="categoryItems" />
      </MideskFormField>

      <MideskFormField :label="t('hr.documents.fields.file')" :model-value="selectedFile?.name">
        <input
          ref="fileInput"
          type="file"
          class="block w-full text-sm text-[var(--color-midesk-muted)] file:me-4 file:rounded-lg file:border-0 file:bg-[var(--color-midesk-accent-soft)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-midesk-accent)]"
          @change="onFileChange"
        >
      </MideskFormField>

      <div class="flex justify-end">
        <UButton type="submit" color="primary" :loading="submitting" :disabled="!selectedFile">
          {{ t('hr.documents.upload') }}
        </UButton>
      </div>
    </form>
  </div>
</template>

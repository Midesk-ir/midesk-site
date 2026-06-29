<script setup lang="ts">
import type { Sprint } from '~/types/phase1'
import type { CreateSprintPayload } from '~/types/phase1'

const props = defineProps<{
  sprint?: Sprint | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  save: [payload: CreateSprintPayload]
}>()

const { t } = useI18n()

const saving = ref(false)
const form = reactive<CreateSprintPayload>({
  name: '',
  goal: '',
  start_date: '',
  end_date: ''
})

const isEdit = computed(() => !!props.sprint)

function resetForm() {
  if (props.sprint) {
    form.name = props.sprint.name
    form.goal = props.sprint.goal ?? ''
    form.start_date = props.sprint.start_date.slice(0, 10)
    form.end_date = props.sprint.end_date.slice(0, 10)
  } else {
    form.name = ''
    form.goal = ''
    form.start_date = ''
    form.end_date = ''
  }
}

function submit() {
  if (!form.name.trim() || !form.start_date || !form.end_date) return
  saving.value = true
  emit('save', {
    name: form.name.trim(),
    goal: form.goal?.trim() || undefined,
    start_date: form.start_date,
    end_date: form.end_date
  })
}

watch(open, (v) => {
  if (v) resetForm()
})

watch(() => props.sprint, resetForm)

defineExpose({ saving })
</script>

<template>
  <MideskModal
    v-model:open="open"
    :title="isEdit ? (sprint?.name ?? '') : t('sprint.create')"
  >
    <div class="midesk-form-fields midesk-form-panel">
        <MideskFormField :label="t('sprint.name')" :model-value="form.name" required>
          <UInput v-model="form.name" placeholder=" " />
        </MideskFormField>
        <MideskFormField :label="t('sprint.goal')" :model-value="form.goal">
          <UTextarea v-model="form.goal" :rows="2" placeholder=" " />
        </MideskFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <MideskFormField :label="t('sprint.startDate')" :model-value="form.start_date" field-class="midesk-ltr-field" required>
            <UInput v-model="form.start_date" type="date" />
          </MideskFormField>
          <MideskFormField :label="t('sprint.endDate')" :model-value="form.end_date" field-class="midesk-ltr-field" required>
            <UInput v-model="form.end_date" type="date" />
          </MideskFormField>
        </div>
      </div>
    <template #footer>
      <UButton variant="ghost" @click="open = false">
        {{ t('common.cancel') }}
      </UButton>
      <UButton
        :loading="saving"
        :disabled="isEdit"
        color="primary"
        @click="submit"
      >
        {{ isEdit ? t('common.save') : t('common.create') }}
      </UButton>
    </template>
  </MideskModal>
</template>

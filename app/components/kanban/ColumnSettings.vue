<script setup lang="ts">
import draggable from 'vuedraggable'
import type { ProjectColumn } from '~/types/phase1'

const props = defineProps<{
  projectId: string
}>()

const open = defineModel<boolean>('open', { default: false })

const { api } = useApi()
const { t } = useI18n()
const toast = useToast()

const columns = ref<ProjectColumn[]>([])
const loading = ref(false)
const saving = ref(false)

const newColumn = reactive({
  name: '',
  wip_limit: null as number | null,
  is_done_column: false
})

async function loadColumns() {
  loading.value = true
  try {
    const data = await api<{ data: ProjectColumn[] }>(`/projects/${props.projectId}/columns`)
    columns.value = data.data
  } finally {
    loading.value = false
  }
}

async function saveOrder() {
  saving.value = true
  try {
    const data = await api<{ data: ProjectColumn[] }>(
      `/projects/${props.projectId}/columns/reorder`,
      { method: 'PATCH', body: { ids: columns.value.map(c => c.id) } }
    )
    columns.value = data.data
    toast.add({ title: t('columns.saveOrder'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}

async function updateColumn(col: ProjectColumn) {
  try {
    const data = await api<{ data: ProjectColumn }>(
      `/projects/${props.projectId}/columns/${col.id}`,
      {
        method: 'PATCH',
        body: {
          name: col.name,
          wip_limit: col.wip_limit,
          is_done_column: col.is_done_column
        }
      }
    )
    const idx = columns.value.findIndex(c => c.id === col.id)
    if (idx >= 0) columns.value[idx] = data.data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function addColumn() {
  if (!newColumn.name.trim()) return
  try {
    const data = await api<{ data: ProjectColumn }>(
      `/projects/${props.projectId}/columns`,
      {
        method: 'POST',
        body: {
          name: newColumn.name,
          wip_limit: newColumn.wip_limit,
          is_done_column: newColumn.is_done_column
        }
      }
    )
    columns.value.push(data.data)
    newColumn.name = ''
    newColumn.wip_limit = null
    newColumn.is_done_column = false
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function deleteColumn(id: string) {
  try {
    await api(`/projects/${props.projectId}/columns/${id}`, { method: 'DELETE' })
    columns.value = columns.value.filter(c => c.id !== id)
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

watch(open, (v) => {
  if (v) loadColumns()
})

const emit = defineEmits<{
  saved: []
}>()

async function handleSaveOrder() {
  await saveOrder()
  emit('saved')
}
</script>

<template>
  <MideskModal
    v-model:open="open"
    :title="t('columns.settings')"
    :ui="{ content: 'sm:max-w-lg' }"
  >
    <div v-if="loading" class="space-y-3">
          <USkeleton v-for="i in 4" :key="i" class="h-12" />
        </div>

        <template v-else>
          <p class="mb-3 text-sm text-muted">{{ t('columns.reorder') }}</p>

          <draggable
            v-model="columns"
            item-key="id"
            handle=".drag-handle"
            class="space-y-2"
            :animation="200"
            @end="saveOrder"
          >
            <template #item="{ element: col }">
              <div
                class="flex items-center gap-2 rounded-lg border border-[var(--color-midesk-border)] p-2"
              >
                <UIcon
                  name="i-lucide-grip-vertical"
                  class="drag-handle size-4 shrink-0 cursor-grab text-muted"
                />
                <UInput
                  v-model="col.name"
                  size="sm"
                  class="flex-1"
                  @blur="updateColumn(col)"
                />
                <UInput
                  :model-value="col.wip_limit != null ? String(col.wip_limit) : ''"
                  type="number"
                  size="sm"
                  :placeholder="t('columns.wipLimit')"
                  class="w-20"
                  min="0"
                  @update:model-value="(v: string | number) => {
                    col.wip_limit = v === '' || v == null ? null : Number(v)
                  }"
                  @blur="updateColumn(col)"
                />
                <UCheckbox
                  v-model="col.is_done_column"
                  :label="t('columns.isDone')"
                  @update:model-value="updateColumn(col)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  size="xs"
                  @click="deleteColumn(col.id)"
                />
              </div>
            </template>
          </draggable>

          <div class="mt-4 space-y-2 rounded-lg border border-dashed border-[var(--color-midesk-border)] p-3">
            <p class="text-sm font-medium">{{ t('columns.add') }}</p>
            <div class="flex flex-wrap items-end gap-2">
              <UInput v-model="newColumn.name" size="sm" :placeholder="t('columns.name')" class="flex-1" />
              <UInput
                :model-value="newColumn.wip_limit != null ? String(newColumn.wip_limit) : ''"
                type="number"
                size="sm"
                :placeholder="t('columns.wipLimit')"
                class="w-20"
                min="0"
                @update:model-value="(v: string | number) => {
                  newColumn.wip_limit = v === '' || v == null ? null : Number(v)
                }"
              />
              <UButton size="sm" icon="i-lucide-plus" @click="addColumn">
                {{ t('columns.add') }}
              </UButton>
            </div>
          </div>
        </template>
    <template #footer>
      <UButton variant="ghost" @click="open = false">
        {{ t('common.close') }}
      </UButton>
      <UButton color="primary" :loading="saving" @click="handleSaveOrder">
        {{ t('columns.saveOrder') }}
      </UButton>
    </template>
  </MideskModal>
</template>

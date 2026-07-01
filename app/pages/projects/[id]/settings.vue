<script setup lang="ts">
import draggable from 'vuedraggable'
import type { ProjectColumn } from '~/types/phase1'

definePageMeta({ middleware: ['auth', 'tenant', 'admin'] })

const projectId = inject<ComputedRef<string>>('projectId')!
const { t } = useI18n()
const { api } = useApi()
const toast = useToast()
const authStore = useAuthStore()

const columns = ref<ProjectColumn[]>([])
const loading = ref(true)
const settingsOpen = ref(false)

async function loadColumns() {
  loading.value = true
  try {
    const data = await api<{ data: ProjectColumn[] }>(`/projects/${projectId.value}/columns`)
    columns.value = data.data
  } finally {
    loading.value = false
  }
}

async function saveOrder() {
  try {
    const data = await api<{ data: ProjectColumn[] }>(
      `/projects/${projectId.value}/columns/reorder`,
      { method: 'PATCH', body: { ids: columns.value.map(c => c.id) } }
    )
    columns.value = data.data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function updateColumn(col: ProjectColumn) {
  try {
    const data = await api<{ data: ProjectColumn }>(
      `/projects/${projectId.value}/columns/${col.id}`,
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

onMounted(loadColumns)

function onSettingsSaved() {
  loadColumns()
}
</script>

<template>
  <div v-if="!authStore.isAdmin" class="text-sm text-muted">
    {{ t('common.error') }}
  </div>

  <div v-else>
    <div class="midesk-page-header">
      <h2 class="text-lg font-semibold">{{ t('columns.settings') }}</h2>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton variant="soft-primary" icon="i-lucide-settings-2" @click="settingsOpen = true">
          {{ t('columns.settings') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <UCard v-if="loading" class="midesk-glass border-[var(--color-midesk-border)]">
      <USkeleton v-for="i in 5" :key="i" class="mb-3 h-12" />
    </UCard>

    <UCard v-else class="midesk-glass border-[var(--color-midesk-border)]">
      <p class="mb-4 text-sm text-muted">{{ t('columns.reorder') }}</p>

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
            class="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--color-midesk-border)] p-3"
          >
            <UIcon
              name="i-lucide-grip-vertical"
              class="drag-handle size-4 shrink-0 cursor-grab text-muted"
            />
            <UInput
              v-model="col.name"
              size="sm"
              class="min-w-32 flex-1"
              @blur="updateColumn(col)"
            />
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted">{{ t('columns.wipLimit') }}</span>
              <UInput
                :model-value="col.wip_limit ?? ''"
                type="number"
                size="sm"
                class="w-20"
                min="0"
                @update:model-value="(v: string | number) => {
                  col.wip_limit = v === '' || v == null ? null : Number(v)
                }"
                @blur="updateColumn(col)"
              />
            </div>
            <KanbanWipIndicator :current="col.current_count" :limit="col.wip_limit" />
            <UCheckbox
              v-model="col.is_done_column"
              :label="t('columns.isDone')"
              @update:model-value="updateColumn(col)"
            />
          </div>
        </template>
      </draggable>
    </UCard>

    <KanbanColumnSettings
      v-model:open="settingsOpen"
      :project-id="projectId"
      @saved="onSettingsSaved"
    />
  </div>
</template>

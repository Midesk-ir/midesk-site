<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from 'reka-ui'

const props = defineProps<{
  title: string
  description?: string
  ui?: { content?: string }
}>()

const open = defineModel<boolean>('open', { default: false })
const { t } = useI18n()

const contentClass = computed(() =>
  [
    'midesk-modal',
    props.ui?.content ?? 'max-w-lg'
  ].join(' ')
)
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="midesk-modal-overlay" />

      <DialogContent :class="contentClass">
        <header class="midesk-modal-header">
          <div class="min-w-0 flex-1">
            <slot name="header">
              <DialogTitle class="midesk-modal-title">
                {{ title }}
              </DialogTitle>
              <DialogDescription
                v-if="description"
                class="midesk-modal-description"
              >
                {{ description }}
              </DialogDescription>
            </slot>
          </div>
          <DialogClose as-child>
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="sm"
              class="shrink-0"
              :aria-label="t('common.close')"
            />
          </DialogClose>
        </header>

        <div v-if="$slots.default" class="midesk-modal-body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="midesk-modal-footer">
          <slot name="footer" />
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

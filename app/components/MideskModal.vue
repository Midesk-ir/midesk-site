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
  ui?: { content?: string, body?: string, header?: string }
}>()

const open = defineModel<boolean>('open', { default: false })
const { t } = useI18n()

const contentClass = computed(() =>
  [
    'midesk-modal',
    props.ui?.content ?? 'max-w-lg'
  ].join(' ')
)

function isDatepickerOverlayTarget(target: EventTarget | null) {
  return target instanceof Element
    && Boolean(target.closest('.midesk-datepicker-overlay, .datepicker__overlay'))
}

function onInteractOutside(event: Event) {
  const detail = (event as CustomEvent<{ originalEvent?: Event }>).detail
  const originalTarget = detail?.originalEvent?.target ?? event.target
  if (isDatepickerOverlayTarget(originalTarget)) {
    event.preventDefault()
  }
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="midesk-modal-overlay" />

      <DialogContent
        :class="contentClass"
        @pointer-down-outside="onInteractOutside"
        @interact-outside="onInteractOutside"
        @focus-outside="onInteractOutside"
      >
        <header :class="['midesk-modal-header', props.ui?.header]">
          <div class="midesk-modal-header-slot min-w-0 flex-1">
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
            <DialogTitle v-if="$slots.header" class="sr-only">
              {{ title }}
            </DialogTitle>
          </div>
          <DialogClose as-child>
            <button
              type="button"
              class="midesk-modal-close shrink-0"
              :aria-label="t('common.close')"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </DialogClose>
        </header>

        <div v-if="$slots.default" :class="['midesk-modal-body', props.ui?.body]">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="midesk-modal-footer">
          <slot name="footer" />
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

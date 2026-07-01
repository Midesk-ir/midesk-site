<script setup lang="ts">
export type SidebarNavGroupItem = {
  label: string
  to: string
  icon: string
  badge?: number
}

const props = defineProps<{
  label: string
  icon: string
  items: SidebarNavGroupItem[]
  expanded: boolean
  showCompact: boolean
  isRtl: boolean
  isGroupActive: boolean
  isItemActive: (path: string) => boolean
}>()

const emit = defineEmits<{
  'update:expanded': [value: boolean]
  navigate: []
}>()

const dropdownItems = computed(() => [
  props.items.map(item => ({
    label: item.label,
    icon: item.icon,
    to: item.to,
    onSelect: () => emit('navigate')
  }))
])

function toggle() {
  emit('update:expanded', !props.expanded)
}
</script>

<template>
  <div v-if="items.length" class="pt-1">
    <UDropdownMenu
      v-if="showCompact"
      :items="dropdownItems"
      :content="{ side: isRtl ? 'left' : 'right', align: 'start', sideOffset: 8 }"
    >
      <button
        type="button"
        :title="label"
        class="relative flex w-full items-center justify-center rounded-xl p-2.5 transition-all duration-150"
        :class="isGroupActive
          ? 'bg-[var(--color-midesk-accent)] text-white shadow-[0_0_20px_var(--color-midesk-accent-glow)]'
          : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'"
      >
        <UIcon :name="icon" class="size-5 shrink-0" />
        <span
          class="absolute bottom-1 end-1 flex size-3.5 items-center justify-center rounded-full bg-[var(--color-midesk-accent)] text-white"
        >
          <UIcon name="i-lucide-chevrons-up-down" class="size-2.5" />
        </span>
      </button>
    </UDropdownMenu>

    <template v-else>
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
        :class="isGroupActive
          ? 'bg-white/[0.06] text-[var(--color-midesk-text)] ring-1 ring-[var(--color-midesk-border)]'
          : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'"
        :aria-expanded="expanded"
        :aria-label="label"
        @click="toggle"
      >
        <UIcon :name="icon" class="size-5 shrink-0" />
        <span class="min-w-0 flex-1 truncate text-start">{{ label }}</span>
        <span
          class="flex size-6 shrink-0 items-center justify-center rounded-md border border-[var(--color-midesk-border)] bg-white/[0.04]"
          :class="expanded ? 'text-[var(--color-midesk-accent)]' : 'text-[var(--color-midesk-muted)]'"
          aria-hidden="true"
        >
          <UIcon
            :name="isRtl ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
            class="size-3.5 transition-transform duration-200"
            :class="{ 'rotate-90': expanded && !isRtl, '-rotate-90': expanded && isRtl }"
          />
        </span>
      </button>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-show="expanded"
          class="mt-1 space-y-0.5 border-s-2 border-[var(--color-midesk-border)] ps-3 ms-3.5"
          role="group"
          :aria-label="label"
        >
          <NuxtLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150"
            :class="isItemActive(item.to)
              ? 'bg-[var(--color-midesk-accent-soft)] font-medium text-[var(--color-midesk-accent)]'
              : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.04] hover:text-[var(--color-midesk-text)]'"
            @click="emit('navigate')"
          >
            <UIcon :name="item.icon" class="size-4 shrink-0" />
            <span class="truncate">{{ item.label }}</span>
            <UBadge
              v-if="item.badge && item.badge > 0"
              color="error"
              size="xs"
              class="ms-auto min-w-[1rem]"
            >
              {{ item.badge > 99 ? '99+' : item.badge }}
            </UBadge>
          </NuxtLink>
        </div>
      </Transition>
    </template>
  </div>
</template>

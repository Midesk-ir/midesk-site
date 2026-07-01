export function useDirectionalIcons() {
  const { localeProperties } = useI18n()

  const isRtl = computed(() => localeProperties.value.dir === 'rtl')

  const nextIcon = computed(() =>
    isRtl.value ? 'i-lucide-arrow-left' : 'i-lucide-arrow-right'
  )

  const backIcon = computed(() =>
    isRtl.value ? 'i-lucide-arrow-right' : 'i-lucide-arrow-left'
  )

  return { isRtl, nextIcon, backIcon }
}

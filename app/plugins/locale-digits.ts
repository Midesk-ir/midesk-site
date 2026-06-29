import { localizeDigits } from '~/utils/localeDigits'

const SKIP_TAGS = new Set([
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'SCRIPT',
  'STYLE',
  'CODE',
  'PRE',
  'OPTION'
])

function shouldSkip(el: Element | null): boolean {
  if (!el) return true
  if (SKIP_TAGS.has(el.tagName)) return true
  if (el.hasAttribute('contenteditable')) return true
  if (el.closest('[data-locale-digits="off"]')) return true
  return false
}

function localizeTextNodes(root: Element, locale: string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode() as Text | null

  while (node) {
    const parent = node.parentElement
    if (parent && !shouldSkip(parent)) {
      const raw = node.nodeValue
      if (raw && /[\d۰-۹٠-٩]/.test(raw)) {
        const next = localizeDigits(raw, locale)
        if (next !== raw) node.nodeValue = next
      }
    }
    node = walker.nextNode() as Text | null
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('localeDigits', {
    getSSRProps() {
      return {}
    },
    mounted(el: HTMLElement, binding) {
      localizeTextNodes(el, binding.value ?? 'fa')
    },
    updated(el: HTMLElement, binding) {
      localizeTextNodes(el, binding.value ?? 'fa')
    }
  })

  if (!import.meta.client) return

  const i18n = nuxtApp.$i18n as { locale: { value: string } }
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  const refresh = () => {
    nextTick(() => localizeTextNodes(document.body, i18n.locale.value))
  }

  const scheduleRefresh = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(refresh, 32)
  }

  nuxtApp.hook('app:mounted', () => {
    refresh()
    const observer = new MutationObserver(scheduleRefresh)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })
  })

  nuxtApp.hook('page:finish', refresh)
  watch(() => i18n.locale.value, refresh)
})

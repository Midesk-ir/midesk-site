const FIX_ID = 'midesk-ui-cascade-fix'

/**
 * Keep this stylesheet last so our overrides win the cascade.
 * We intentionally avoid global direction rules since they can
 * interfere with interactive overlays (e.g. datepicker close behavior).
 */
const FIX_CSS = `
.datepicker__overlay,
.datepicker__overlay *,
.datepicker__overlay *::before,
.datepicker__overlay *::after {
  direction: inherit;
}

html[dir='ltr'] .datepicker__overlay,
html[dir='ltr'] .datepicker__overlay *,
html[dir='ltr'] .datepicker__overlay *::before,
html[dir='ltr'] .datepicker__overlay *::after {
  direction: ltr;
}

html[dir='rtl'] .datepicker__overlay,
html[dir='rtl'] .datepicker__overlay *,
html[dir='rtl'] .datepicker__overlay *::before,
html[dir='rtl'] .datepicker__overlay *::after {
  direction: rtl;
}

[data-slot='list'] [data-slot='trigger'] {
  background-color: transparent !important;
  border: none;
}

[data-slot='list'] [data-slot='trigger'][data-state='inactive'] {
  color: var(--color-midesk-muted) !important;
}

[data-slot='list'] [data-slot='trigger'][data-state='inactive']:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.06) !important;
  color: var(--color-midesk-text) !important;
}

[data-slot='list'] [data-slot='trigger'][data-state='active'] {
  color: #ffffff !important;
}

[data-slot='list'] [data-slot='trigger']:focus-visible {
  outline: 2px solid rgba(255, 92, 0, 0.5) !important;
  outline-offset: 1px;
}

[data-slot='list'] [data-slot='indicator'] {
  background-color: var(--color-midesk-accent) !important;
}
`

function ensureFixLast() {
  let el = document.getElementById(FIX_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = FIX_ID
    el.textContent = FIX_CSS
    document.head.appendChild(el)
  } else {
    el.textContent = FIX_CSS
    if (el !== document.head.lastElementChild) {
      document.head.appendChild(el)
    }
  }
}

export default defineNuxtPlugin(() => {
  ensureFixLast()

  const observer = new MutationObserver(ensureFixLast)
  observer.observe(document.head, { childList: true })
})

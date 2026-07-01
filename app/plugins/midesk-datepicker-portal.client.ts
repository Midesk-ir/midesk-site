/**
 * @mahlaparvaz/vue-datepicker renders its overlay inside the component tree.
 * Inside cards with backdrop-filter that creates a stacking context, the popup
 * can appear behind sibling sections. Move overlays to document.body.
 */
function portalDatepickerOverlays() {
  document.querySelectorAll('.datepicker__overlay').forEach((el) => {
    if (el.parentElement !== document.body) {
      document.body.appendChild(el)
    }
  })
}

export default defineNuxtPlugin(() => {
  portalDatepickerOverlays()

  const observer = new MutationObserver(portalDatepickerOverlays)
  observer.observe(document.body, { childList: true, subtree: true })
})

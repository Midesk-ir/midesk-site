export function useLandingParallax() {
  const scrollY = ref(0)
  const pointerX = ref(0.5)
  const pointerY = ref(0.5)
  const reducedMotion = ref(false)

  const heroGlowShift = computed(() => ({
    primary: `translate(${pointerX.value * 24 - 12}px, ${scrollY.value * 0.08 + pointerY.value * 12 - 6}px)`,
    secondary: `translate(${-pointerX.value * 18 + 9}px, ${-scrollY.value * 0.05 - pointerY.value * 10 + 5}px)`
  }))

  const previewTilt = computed(() => {
    if (reducedMotion.value) return 'none'
    const rx = (pointerY.value - 0.5) * -6
    const ry = (pointerX.value - 0.5) * 8
    return `rotateX(${rx}deg) rotateY(${ry}deg)`
  })

  onMounted(() => {
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion.value) return

    const onScroll = () => { scrollY.value = window.scrollY }
    const onMove = (e: MouseEvent) => {
      pointerX.value = e.clientX / window.innerWidth
      pointerY.value = e.clientY / window.innerHeight
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
    })
  })

  return { heroGlowShift, previewTilt, reducedMotion }
}

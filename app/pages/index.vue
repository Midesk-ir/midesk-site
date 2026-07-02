<script setup lang="ts">
definePageMeta({ layout: 'marketing' })

const { t } = useI18n()
const { nextIcon } = useDirectionalIcons()

const stats = [
  { value: '15+', labelKey: 'landing.stats.modules' },
  { value: '2', labelKey: 'landing.stats.languages' },
  { value: '5m', labelKey: 'landing.stats.setup' },
  { value: '∞', labelKey: 'landing.stats.scale' }
] as const

const heroChips = ['kanban', 'hr', 'crm', 'chat', 'ai', 'finance'] as const

const heroChipIcons: Record<typeof heroChips[number], string> = {
  kanban: 'i-lucide-square-kanban',
  hr: 'i-lucide-users',
  crm: 'i-lucide-contact',
  chat: 'i-lucide-messages-square',
  ai: 'i-lucide-brain',
  finance: 'i-lucide-wallet'
}

const heroTrustItems = ['noCard', 'setup', 'support'] as const

const heroTrustIcons: Record<typeof heroTrustItems[number], string> = {
  noCard: 'i-lucide-credit-card',
  setup: 'i-lucide-timer',
  support: 'i-lucide-headphones'
}

const socialItems = ['agile', 'hr', 'finance', 'remote'] as const

const socialIcons: Record<typeof socialItems[number], string> = {
  agile: 'i-lucide-kanban-square',
  hr: 'i-lucide-users-round',
  finance: 'i-lucide-wallet',
  remote: 'i-lucide-laptop'
}

const values = [
  { key: 'integration', icon: 'i-lucide-layers' },
  { key: 'agility', icon: 'i-lucide-zap' },
  { key: 'multitenancy', icon: 'i-lucide-building-2' },
  { key: 'i18n', icon: 'i-lucide-globe' }
] as const

const featureCategories = [
  {
    key: 'projects',
    icon: 'i-lucide-folder-kanban',
    accent: 'projects',
    items: ['kanban', 'sprints', 'worklog', 'dashboard'] as const
  },
  {
    key: 'people',
    icon: 'i-lucide-heart-handshake',
    accent: 'people',
    items: ['hr', 'calendar', 'teams', 'performance'] as const
  },
  {
    key: 'business',
    icon: 'i-lucide-briefcase-business',
    accent: 'business',
    items: ['finance', 'crm', 'correspondence', 'surveys'] as const
  },
  {
    key: 'collab',
    icon: 'i-lucide-sparkles',
    accent: 'collab',
    items: ['chat', 'meetings', 'ai', 'notes', 'reports'] as const
  }
] as const

const compareItems = [
  { key: 'tools', icon: 'i-lucide-puzzle' },
  { key: 'data', icon: 'i-lucide-bar-chart-3' },
  { key: 'calendar', icon: 'i-lucide-calendar-days' },
  { key: 'cost', icon: 'i-lucide-piggy-bank' }
] as const

const howSteps = [
  { key: 'register', icon: 'i-lucide-user-plus' },
  { key: 'setup', icon: 'i-lucide-settings-2' },
  { key: 'run', icon: 'i-lucide-rocket' }
] as const

const testimonials = [
  { key: 'one', accent: 'orange' },
  { key: 'two', accent: 'violet' },
  { key: 'three', accent: 'cyan' }
] as const

const pricingTiers = [
  { key: 'free', highlighted: false },
  { key: 'startup', highlighted: false },
  { key: 'pro', highlighted: true },
  { key: 'enterprise', highlighted: false }
] as const

const faqItems = ['what', 'free', 'calendar', 'security', 'roadmap'] as const

const faqAccordion = computed(() =>
  faqItems.map(key => ({
    label: t(`landing.faqItems.${key}.q`),
    content: t(`landing.faqItems.${key}.a`)
  }))
)

function pricingLink(tierKey: string) {
  if (tierKey === 'free') return '/register'
  return { path: '/register', query: { plan: tierKey } }
}

function testimonialInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}

useLandingSeo()
</script>

<template>
  <div class="midesk-landing">
    <!-- Hero -->
    <section class="midesk-landing-hero">
      <div class="midesk-landing-hero-bg" aria-hidden="true">
        <div class="midesk-landing-hero-glow midesk-landing-hero-glow--primary" />
        <div class="midesk-landing-hero-glow midesk-landing-hero-glow--secondary" />
        <div class="midesk-landing-hero-glow midesk-landing-hero-glow--tertiary" />
        <div class="midesk-landing-hero-grid" />
        <div class="midesk-landing-hero-noise" />
      </div>

      <div class="midesk-landing-hero-layout">
        <div class="midesk-landing-hero-copy">
          <p class="midesk-landing-eyebrow">
            <UIcon name="i-lucide-sparkles" class="size-3.5" />
            {{ t('landing.eyebrow') }}
          </p>

          <h1 class="midesk-landing-headline">
            {{ t('landing.heroTitleBefore') }}
            <span class="midesk-landing-headline-accent">{{ t('landing.heroTitleHighlight') }}</span>
            {{ t('landing.heroTitleAfter') }}
          </h1>

          <p class="midesk-landing-subtitle">
            {{ t('landing.heroSubtitle') }}
          </p>

          <ul class="midesk-landing-hero-trust-list">
            <li v-for="item in heroTrustItems" :key="item">
              <UIcon :name="heroTrustIcons[item]" class="size-3.5 text-emerald-400" />
              {{ t(`landing.heroTrustItems.${item}`) }}
            </li>
          </ul>

          <div class="midesk-landing-actions">
            <UButton
              to="/register"
              size="xl"
              color="primary"
              class="midesk-landing-btn-primary midesk-landing-btn-glow"
              :icon="nextIcon"
            >
              {{ t('landing.getStarted') }}
            </UButton>
            <UButton
              to="#pricing"
              size="xl"
              variant="outline"
              color="neutral"
              class="midesk-landing-btn-outline"
            >
              {{ t('landing.viewPlans') }}
            </UButton>
          </div>
          <p class="midesk-landing-cta-note">{{ t('landing.heroCtaNote') }}</p>

          <div class="midesk-landing-hero-chips">
            <span v-for="chip in heroChips" :key="chip" class="midesk-landing-hero-chip">
              <UIcon :name="heroChipIcons[chip]" class="size-3.5" />
              {{ t(`landing.heroChips.${chip}`) }}
            </span>
          </div>

          <dl class="midesk-landing-stats">
            <div v-for="stat in stats" :key="stat.labelKey" class="midesk-landing-stat">
              <dt class="midesk-landing-stat-value">{{ stat.value }}</dt>
              <dd class="midesk-landing-stat-label">{{ t(stat.labelKey) }}</dd>
            </div>
          </dl>
        </div>

        <LandingProductPreview class="midesk-landing-hero-preview" />
      </div>

      <a href="#features" class="midesk-landing-scroll-hint">
        <span>{{ t('landing.scrollHint') }}</span>
        <UIcon name="i-lucide-chevron-down" class="size-4 midesk-landing-scroll-hint-icon" />
      </a>
    </section>

    <!-- Social proof -->
    <section class="midesk-landing-social" aria-label="Social proof">
      <div class="midesk-landing-social-inner">
        <p class="midesk-landing-social-label">{{ t('landing.socialProof') }}</p>
        <div class="midesk-landing-marquee" aria-hidden="true">
          <div class="midesk-landing-marquee-track">
            <span
              v-for="(item, i) in [...socialItems, ...socialItems]"
              :key="`${item}-${i}`"
              class="midesk-landing-social-pill"
            >
              <UIcon :name="socialIcons[socialItems[i % socialItems.length]]" class="size-4 text-[var(--color-midesk-accent)]" />
              {{ t(`landing.socialItems.${socialItems[i % socialItems.length]}`) }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="midesk-landing-section midesk-landing-values" aria-labelledby="landing-values-title">
      <div class="midesk-landing-container">
        <LandingReveal>
          <p class="midesk-landing-section-eyebrow">{{ t('landing.sectionEyebrows.values') }}</p>
          <h2 id="landing-values-title" class="midesk-landing-section-title midesk-landing-section-title--center">
            {{ t('landing.valuesTitle') }}
          </h2>
        </LandingReveal>
        <div class="midesk-landing-values-grid">
          <LandingReveal
            v-for="(item, index) in values"
            :key="item.key"
            :delay="index * 80"
          >
            <article class="midesk-landing-value-card">
              <div class="midesk-landing-value-icon">
                <UIcon :name="item.icon" class="size-5" />
              </div>
              <h3>{{ t(`landing.values.${item.key}.title`) }}</h3>
              <p>{{ t(`landing.values.${item.key}.desc`) }}</p>
            </article>
          </LandingReveal>
        </div>
      </div>
    </section>

    <!-- Compare -->
    <section class="midesk-landing-section midesk-landing-compare" aria-labelledby="landing-compare-title">
      <div class="midesk-landing-container">
        <LandingReveal>
          <div class="midesk-landing-section-header">
            <p class="midesk-landing-section-eyebrow">{{ t('landing.sectionEyebrows.compare') }}</p>
            <h2 id="landing-compare-title" class="midesk-landing-section-title">{{ t('landing.compareTitle') }}</h2>
            <p class="midesk-landing-section-subtitle">{{ t('landing.compareSubtitle') }}</p>
          </div>
        </LandingReveal>
        <div class="midesk-landing-compare-grid">
          <LandingReveal
            v-for="(item, index) in compareItems"
            :key="item.key"
            :delay="index * 70"
          >
            <article class="midesk-landing-compare-card">
              <div class="midesk-landing-compare-icon">
                <UIcon :name="item.icon" class="size-5" />
              </div>
              <div class="midesk-landing-compare-before">
                <span class="midesk-landing-compare-label">{{ t('landing.compareBefore') }}</span>
                <p>{{ t(`landing.compareItems.${item.key}.before`) }}</p>
              </div>
              <UIcon name="i-lucide-arrow-down" class="midesk-landing-compare-arrow size-5 lg:hidden" />
              <UIcon name="i-lucide-arrow-right" class="midesk-landing-compare-arrow midesk-landing-compare-arrow--lg size-5 hidden lg:block" />
              <div class="midesk-landing-compare-after">
                <span class="midesk-landing-compare-label is-midesk">{{ t('landing.compareAfter') }}</span>
                <p>{{ t(`landing.compareItems.${item.key}.after`) }}</p>
              </div>
            </article>
          </LandingReveal>
        </div>
      </div>
    </section>

    <!-- Features bento -->
    <section id="features" class="midesk-landing-section" aria-labelledby="landing-features-title">
      <div class="midesk-landing-container">
        <LandingReveal>
          <div class="midesk-landing-section-header">
            <p class="midesk-landing-section-eyebrow">{{ t('landing.sectionEyebrows.features') }}</p>
            <h2 id="landing-features-title" class="midesk-landing-section-title">{{ t('landing.featuresTitle') }}</h2>
            <p class="midesk-landing-section-subtitle">{{ t('landing.featuresSubtitle') }}</p>
          </div>
        </LandingReveal>

        <div class="midesk-landing-bento">
          <LandingReveal
            v-for="(category, index) in featureCategories"
            :key="category.key"
            :delay="index * 90"
          >
            <article
              class="midesk-landing-bento-card"
              :class="[
                `midesk-landing-bento-card--${category.key}`,
                `midesk-landing-bento-card--accent-${category.accent}`
              ]"
            >
              <header class="midesk-landing-bento-header">
                <div class="midesk-landing-bento-icon">
                  <UIcon :name="category.icon" class="size-5" />
                </div>
                <div>
                  <h3>{{ t(`landing.featureCategories.${category.key}.title`) }}</h3>
                  <p>{{ t(`landing.featureCategories.${category.key}.desc`) }}</p>
                </div>
              </header>
              <ul class="midesk-landing-bento-list">
                <li v-for="item in category.items" :key="item">
                  <UIcon name="i-lucide-check" class="size-3.5 shrink-0 text-[var(--color-midesk-accent)]" />
                  <div>
                    <strong>{{ t(`landing.featureItems.${item}.title`) }}</strong>
                    <span>{{ t(`landing.featureItems.${item}.desc`) }}</span>
                  </div>
                </li>
              </ul>
            </article>
          </LandingReveal>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="midesk-landing-section midesk-landing-how" aria-labelledby="landing-how-title">
      <div class="midesk-landing-container">
        <LandingReveal>
          <div class="midesk-landing-section-header">
            <p class="midesk-landing-section-eyebrow">{{ t('landing.sectionEyebrows.how') }}</p>
            <h2 id="landing-how-title" class="midesk-landing-section-title">{{ t('landing.howTitle') }}</h2>
            <p class="midesk-landing-section-subtitle">{{ t('landing.howSubtitle') }}</p>
          </div>
        </LandingReveal>

        <div class="midesk-landing-steps" role="list">
          <LandingReveal
            v-for="(step, index) in howSteps"
            :key="step.key"
            :delay="index * 100"
          >
            <div class="midesk-landing-step" role="listitem">
              <div class="midesk-landing-step-badge">
                <span class="midesk-landing-step-num">{{ index + 1 }}</span>
                <UIcon :name="step.icon" class="size-4" />
              </div>
              <div>
                <h3>{{ t(`landing.howSteps.${step.key}.title`) }}</h3>
                <p>{{ t(`landing.howSteps.${step.key}.desc`) }}</p>
              </div>
            </div>
          </LandingReveal>
        </div>

        <LandingReveal :delay="200">
          <div class="midesk-landing-how-cta">
            <UButton to="/register" size="lg" color="primary" class="midesk-landing-btn-glow" :icon="nextIcon">
              {{ t('landing.getStarted') }}
            </UButton>
          </div>
        </LandingReveal>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="midesk-landing-section midesk-landing-testimonials-section">
      <div class="midesk-landing-container">
        <LandingReveal>
          <p class="midesk-landing-section-eyebrow midesk-landing-section-eyebrow--center">
            {{ t('landing.sectionEyebrows.testimonials') }}
          </p>
          <h2 class="midesk-landing-section-title midesk-landing-section-title--center">
            {{ t('landing.testimonialsTitle') }}
          </h2>
        </LandingReveal>
        <div class="midesk-landing-testimonials">
          <LandingReveal
            v-for="(item, index) in testimonials"
            :key="item.key"
            :delay="index * 90"
          >
            <blockquote
              class="midesk-landing-testimonial"
              :class="`midesk-landing-testimonial--${item.accent}`"
            >
              <div class="midesk-landing-testimonial-top">
                <div
                  class="midesk-landing-testimonial-avatar"
                  :class="`midesk-landing-testimonial-avatar--${item.accent}`"
                >
                  {{ testimonialInitials(t(`landing.testimonials.${item.key}.name`)) }}
                </div>
                <div class="midesk-landing-testimonial-stars">
                  <UIcon v-for="s in 5" :key="s" name="i-lucide-star" class="size-3.5 fill-amber-400 text-amber-400" />
                </div>
              </div>
              <UIcon name="i-lucide-quote" class="midesk-landing-testimonial-quote size-5" />
              <p>{{ t(`landing.testimonials.${item.key}.quote`) }}</p>
              <footer>
                <strong>{{ t(`landing.testimonials.${item.key}.name`) }}</strong>
                <span>{{ t(`landing.testimonials.${item.key}.role`) }} · {{ t(`landing.testimonials.${item.key}.company`) }}</span>
              </footer>
            </blockquote>
          </LandingReveal>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="midesk-landing-section midesk-landing-pricing">
      <div class="midesk-landing-container">
        <LandingReveal>
          <div class="midesk-landing-section-header">
            <UBadge color="primary" variant="subtle" class="mb-3">{{ t('landing.pricingBadge') }}</UBadge>
            <p class="midesk-landing-section-eyebrow">{{ t('landing.sectionEyebrows.pricing') }}</p>
            <h2 class="midesk-landing-section-title">{{ t('landing.pricingTitle') }}</h2>
            <p class="midesk-landing-section-subtitle">{{ t('landing.pricingSubtitle') }}</p>
          </div>
        </LandingReveal>

        <div class="midesk-landing-pricing-grid">
          <LandingReveal
            v-for="(tier, index) in pricingTiers"
            :key="tier.key"
            :delay="index * 70"
          >
            <article
              class="midesk-landing-pricing-card"
              :class="{ 'is-highlighted': tier.highlighted }"
            >
              <UBadge
                v-if="tier.highlighted"
                color="primary"
                variant="solid"
                class="midesk-landing-pricing-badge"
              >
                {{ t('landing.pricingPopular') }}
              </UBadge>

              <h3>{{ t(`landing.pricingTiers.${tier.key}.name`) }}</h3>
              <p class="midesk-landing-pricing-desc">{{ t(`landing.pricingTiers.${tier.key}.desc`) }}</p>

              <div class="midesk-landing-pricing-price">
                <span class="midesk-landing-pricing-amount">
                  {{ t(`landing.pricingTiers.${tier.key}.price`) }}
                </span>
                <span class="midesk-landing-pricing-period">
                  / {{ t(`landing.pricingTiers.${tier.key}.period`) }}
                </span>
              </div>

              <ul class="midesk-landing-pricing-features">
                <li v-for="fi in 4" :key="fi">
                  <UIcon name="i-lucide-check" class="size-4 shrink-0 text-[var(--color-midesk-accent)]" />
                  {{ t(`landing.pricingTiers.${tier.key}.features.${fi - 1}`) }}
                </li>
              </ul>

              <UButton
                :to="pricingLink(tier.key)"
                :color="tier.highlighted ? 'primary' : 'neutral'"
                :variant="tier.highlighted ? 'solid' : 'outline'"
                size="lg"
                block
                class="mt-auto"
                :class="{ 'midesk-landing-btn-glow': tier.highlighted }"
              >
                {{ t(`landing.pricingTiers.${tier.key}.cta`) }}
              </UButton>
            </article>
          </LandingReveal>
        </div>

        <p class="midesk-landing-pricing-guarantee">
          <UIcon name="i-lucide-badge-check" class="size-4 text-emerald-400" />
          {{ t('landing.pricingGuarantee') }}
        </p>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="midesk-landing-section" aria-labelledby="landing-faq-title">
      <div class="midesk-landing-container midesk-landing-container--narrow">
        <LandingReveal>
          <p class="midesk-landing-section-eyebrow midesk-landing-section-eyebrow--center">
            {{ t('landing.sectionEyebrows.faq') }}
          </p>
          <h2 id="landing-faq-title" class="midesk-landing-section-title midesk-landing-section-title--center">
            {{ t('landing.faqTitle') }}
          </h2>
        </LandingReveal>
        <LandingReveal :delay="80">
          <UAccordion
            :items="faqAccordion"
            type="single"
            collapsible
            class="midesk-landing-faq"
          />
        </LandingReveal>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="midesk-landing-cta">
      <div class="midesk-landing-cta-glow" aria-hidden="true" />
      <div class="midesk-landing-container">
        <LandingReveal>
          <div class="midesk-landing-cta-card">
            <div class="midesk-landing-cta-inner">
              <UBadge color="neutral" variant="subtle">{{ t('landing.ctaBadge') }}</UBadge>
              <h2>{{ t('landing.ctaTitle') }}</h2>
              <p>{{ t('landing.ctaSubtitle') }}</p>
              <div class="midesk-landing-actions1">
                <UButton to="/register" size="xl" color="primary" class="midesk-landing-btn-glow" :icon="nextIcon">
                  {{ t('landing.getStarted') }}
                </UButton>
                <UButton to="#pricing" size="xl" variant="outline" color="neutral">
                  {{ t('landing.viewPlans') }}
                </UButton>
              </div>
            </div>
          </div>
        </LandingReveal>
      </div>
    </section>

    <!-- Footer -->
    <footer class="midesk-landing-footer">
      <div class="midesk-landing-container midesk-landing-footer-inner">
        <div class="midesk-landing-footer-brand">
          <AppLogo />
          <p class="midesk-landing-footer-tagline">{{ t('landing.footerTagline') }}</p>
        </div>
        <nav class="midesk-landing-footer-nav" :aria-label="t('landing.nav.ariaLabel')">
          <a href="#features">{{ t('landing.nav.features') }}</a>
          <a href="#how-it-works">{{ t('landing.nav.howItWorks') }}</a>
          <a href="#pricing">{{ t('landing.nav.pricing') }}</a>
          <a href="#faq">{{ t('landing.nav.faq') }}</a>
          <NuxtLink to="/login">{{ t('landing.login') }}</NuxtLink>
          <NuxtLink to="/register">{{ t('landing.getStarted') }}</NuxtLink>
        </nav>
        <p class="midesk-landing-footer-copy">{{ t('landing.footer') }}</p>
      </div>
    </footer>
  </div>
</template>

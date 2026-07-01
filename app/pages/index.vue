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
    accent: 'from-orange-500/20 to-amber-500/5',
    items: ['kanban', 'sprints', 'worklog', 'dashboard'] as const
  },
  {
    key: 'people',
    icon: 'i-lucide-heart-handshake',
    accent: 'from-rose-500/20 to-pink-500/5',
    items: ['hr', 'calendar', 'teams', 'performance'] as const
  },
  {
    key: 'business',
    icon: 'i-lucide-briefcase-business',
    accent: 'from-violet-500/20 to-purple-500/5',
    items: ['finance', 'crm', 'correspondence', 'surveys'] as const
  },
  {
    key: 'collab',
    icon: 'i-lucide-sparkles',
    accent: 'from-cyan-500/20 to-blue-500/5',
    items: ['chat', 'meetings', 'ai', 'notes', 'reports'] as const
  }
] as const

const compareItems = ['tools', 'data', 'calendar', 'cost'] as const

const howSteps = ['register', 'setup', 'run'] as const

const testimonials = ['one', 'two', 'three'] as const

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

          <p class="midesk-landing-hero-trust">
            <UIcon name="i-lucide-shield-check" class="size-4 text-emerald-400" />
            {{ t('landing.heroTrust') }}
          </p>

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
    </section>

    <!-- Social proof -->
    <section class="midesk-landing-social" aria-label="Social proof">
      <div class="midesk-landing-container">
        <p class="midesk-landing-social-label">{{ t('landing.socialProof') }}</p>
        <div class="midesk-landing-social-items">
          <span v-for="item in ['agile', 'hr', 'finance', 'remote']" :key="item">
            {{ t(`landing.socialItems.${item}`) }}
          </span>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="midesk-landing-section midesk-landing-values" aria-labelledby="landing-values-title">
      <div class="midesk-landing-container">
        <h2 id="landing-values-title" class="midesk-landing-section-title">{{ t('landing.valuesTitle') }}</h2>
        <div class="midesk-landing-values-grid">
          <article v-for="item in values" :key="item.key" class="midesk-landing-value-card">
            <div class="midesk-landing-value-icon">
              <UIcon :name="item.icon" class="size-5" />
            </div>
            <h3>{{ t(`landing.values.${item.key}.title`) }}</h3>
            <p>{{ t(`landing.values.${item.key}.desc`) }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Compare -->
    <section class="midesk-landing-section midesk-landing-compare" aria-labelledby="landing-compare-title">
      <div class="midesk-landing-container">
        <div class="midesk-landing-section-header">
          <h2 id="landing-compare-title" class="midesk-landing-section-title">{{ t('landing.compareTitle') }}</h2>
          <p class="midesk-landing-section-subtitle">{{ t('landing.compareSubtitle') }}</p>
        </div>
        <div class="midesk-landing-compare-grid">
          <article v-for="item in compareItems" :key="item" class="midesk-landing-compare-card">
            <div class="midesk-landing-compare-before">
              <span class="midesk-landing-compare-label">{{ t('landing.compareBefore') }}</span>
              <p>{{ t(`landing.compareItems.${item}.before`) }}</p>
            </div>
            <UIcon name="i-lucide-arrow-down" class="midesk-landing-compare-arrow size-5 lg:hidden" />
            <UIcon name="i-lucide-arrow-right" class="midesk-landing-compare-arrow midesk-landing-compare-arrow--lg size-5 hidden lg:block" />
            <div class="midesk-landing-compare-after">
              <span class="midesk-landing-compare-label is-midesk">{{ t('landing.compareAfter') }}</span>
              <p>{{ t(`landing.compareItems.${item}.after`) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Features bento -->
    <section id="features" class="midesk-landing-section" aria-labelledby="landing-features-title">
      <div class="midesk-landing-container">
        <div class="midesk-landing-section-header">
          <h2 id="landing-features-title" class="midesk-landing-section-title">{{ t('landing.featuresTitle') }}</h2>
          <p class="midesk-landing-section-subtitle">{{ t('landing.featuresSubtitle') }}</p>
        </div>

        <div class="midesk-landing-bento">
          <article
            v-for="category in featureCategories"
            :key="category.key"
            class="midesk-landing-bento-card"
            :class="`midesk-landing-bento-card--${category.key}`"
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
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="midesk-landing-section midesk-landing-how" aria-labelledby="landing-how-title">
      <div class="midesk-landing-container">
        <div class="midesk-landing-section-header">
          <h2 id="landing-how-title" class="midesk-landing-section-title">{{ t('landing.howTitle') }}</h2>
          <p class="midesk-landing-section-subtitle">{{ t('landing.howSubtitle') }}</p>
        </div>

        <ol class="midesk-landing-steps">
          <li v-for="(step, index) in howSteps" :key="step" class="midesk-landing-step">
            <span class="midesk-landing-step-num">{{ index + 1 }}</span>
            <div>
              <h3>{{ t(`landing.howSteps.${step}.title`) }}</h3>
              <p>{{ t(`landing.howSteps.${step}.desc`) }}</p>
            </div>
          </li>
        </ol>

        <div class="midesk-landing-how-cta">
          <UButton to="/register" size="lg" color="primary" :icon="nextIcon">
            {{ t('landing.getStarted') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="midesk-landing-section midesk-landing-testimonials-section">
      <div class="midesk-landing-container">
        <h2 class="midesk-landing-section-title midesk-landing-section-title--center">
          {{ t('landing.testimonialsTitle') }}
        </h2>
        <div class="midesk-landing-testimonials">
          <blockquote
            v-for="item in testimonials"
            :key="item"
            class="midesk-landing-testimonial"
          >
            <div class="midesk-landing-testimonial-stars">
              <UIcon v-for="s in 5" :key="s" name="i-lucide-star" class="size-3.5 fill-amber-400 text-amber-400" />
            </div>
            <UIcon name="i-lucide-quote" class="midesk-landing-testimonial-quote size-5" />
            <p>{{ t(`landing.testimonials.${item}.quote`) }}</p>
            <footer>
              <strong>{{ t(`landing.testimonials.${item}.name`) }}</strong>
              <span>{{ t(`landing.testimonials.${item}.role`) }} · {{ t(`landing.testimonials.${item}.company`) }}</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="midesk-landing-section midesk-landing-pricing">
      <div class="midesk-landing-container">
        <div class="midesk-landing-section-header">
          <UBadge color="primary" variant="subtle" class="mb-3">{{ t('landing.pricingBadge') }}</UBadge>
          <h2 class="midesk-landing-section-title">{{ t('landing.pricingTitle') }}</h2>
          <p class="midesk-landing-section-subtitle">{{ t('landing.pricingSubtitle') }}</p>
        </div>

        <div class="midesk-landing-pricing-grid">
          <article
            v-for="tier in pricingTiers"
            :key="tier.key"
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
        <h2 id="landing-faq-title" class="midesk-landing-section-title midesk-landing-section-title--center">
          {{ t('landing.faqTitle') }}
        </h2>
        <UAccordion
          :items="faqAccordion"
          type="single"
          collapsible
          class="midesk-landing-faq"
        />
      </div>
    </section>

    <!-- Final CTA -->
    <section class="midesk-landing-cta">
      <div class="midesk-landing-cta-glow" aria-hidden="true" />
      <div class="midesk-landing-container midesk-landing-cta-inner">
        <UBadge color="neutral" variant="subtle">{{ t('landing.ctaBadge') }}</UBadge>
        <h2>{{ t('landing.ctaTitle') }}</h2>
        <p>{{ t('landing.ctaSubtitle') }}</p>
        <div class="midesk-landing-actions">
          <UButton to="/register" size="xl" color="primary" class="midesk-landing-btn-glow" :icon="nextIcon">
            {{ t('landing.getStarted') }}
          </UButton>
          <UButton to="#pricing" size="xl" variant="outline" color="neutral">
            {{ t('landing.viewPlans') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="midesk-landing-footer">
      <div class="midesk-landing-container midesk-landing-footer-inner">
        <AppLogo />
        <p class="midesk-landing-footer-tagline">{{ t('landing.footerTagline') }}</p>
        <nav class="midesk-landing-footer-nav">
          <a href="#features">{{ t('landing.nav.features') }}</a>
          <a href="#pricing">{{ t('landing.nav.pricing') }}</a>
          <NuxtLink to="/login">{{ t('landing.login') }}</NuxtLink>
          <NuxtLink to="/register">{{ t('landing.getStarted') }}</NuxtLink>
        </nav>
        <p class="midesk-landing-footer-copy">{{ t('landing.footer') }}</p>
      </div>
    </footer>
  </div>
</template>

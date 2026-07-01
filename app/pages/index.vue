<script setup lang="ts">
definePageMeta({ layout: 'marketing' })

const { t } = useI18n()
const { nextIcon } = useDirectionalIcons()

const stats = [
  { value: '6+', labelKey: 'landing.stats.modules' },
  { value: '2', labelKey: 'landing.stats.languages' },
  { value: '2', labelKey: 'landing.stats.calendar' },
  { value: '✓', labelKey: 'landing.stats.tenants' }
]

const values = [
  { key: 'integration', icon: 'i-lucide-layers' },
  { key: 'agility', icon: 'i-lucide-zap' },
  { key: 'multitenancy', icon: 'i-lucide-building-2' },
  { key: 'i18n', icon: 'i-lucide-globe' }
] as const

const features = [
  { key: 'kanban', icon: 'i-lucide-square-kanban' },
  { key: 'sprints', icon: 'i-lucide-rocket' },
  { key: 'worklog', icon: 'i-lucide-clock' },
  { key: 'calendar', icon: 'i-lucide-calendar-days' },
  { key: 'teams', icon: 'i-lucide-users' },
  { key: 'dashboard', icon: 'i-lucide-layout-dashboard' }
] as const

const howSteps = ['register', 'setup', 'run'] as const

const testimonials = ['one', 'two', 'three'] as const

const pricingTiers = [
  { key: 'free', highlighted: false },
  { key: 'startup', highlighted: false },
  { key: 'pro', highlighted: true },
  { key: 'enterprise', highlighted: false }
] as const

const faqItems = ['what', 'free', 'calendar', 'security', 'roadmap'] as const

const roadmapItems = ['hr', 'finance', 'ai'] as const

const faqAccordion = computed(() =>
  faqItems.map(key => ({
    label: t(`landing.faqItems.${key}.q`),
    content: t(`landing.faqItems.${key}.a`)
  }))
)

useSeoMeta({
  title: () => `${t('app.name')} — ${t('app.tagline')}`,
  description: () => t('landing.heroSubtitle'),
  ogTitle: () => t('app.tagline'),
  ogDescription: () => t('landing.heroSubtitle')
})
</script>

<template>
  <div class="midesk-landing">
    <!-- Hero -->
    <section class="midesk-landing-hero">
      <div class="midesk-landing-hero-bg" aria-hidden="true">
        <div class="midesk-landing-hero-glow midesk-landing-hero-glow--primary" />
        <div class="midesk-landing-hero-glow midesk-landing-hero-glow--secondary" />
        <div class="midesk-landing-hero-grid" />
      </div>

      <div class="midesk-landing-hero-layout">
        <div class="midesk-landing-hero-copy">
          <p class="midesk-landing-eyebrow">{{ t('landing.eyebrow') }}</p>

          <h1 class="midesk-landing-headline">
            {{ t('landing.heroTitleBefore') }}
            <span class="midesk-landing-headline-accent">{{ t('landing.heroTitleHighlight') }}</span>
            {{ t('landing.heroTitleAfter') }}
          </h1>

          <p class="midesk-landing-subtitle">
            {{ t('landing.heroSubtitle') }}
          </p>

          <div class="midesk-landing-actions">
            <UButton to="/register" size="xl" color="primary" class="midesk-landing-btn-primary" :icon="nextIcon">
              {{ t('landing.getStarted') }}
            </UButton>
            <UButton
              to="/login"
              size="xl"
              variant="outline"
              color="neutral"
              class="midesk-landing-btn-outline"
            >
              {{ t('landing.login') }}
            </UButton>
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

    <!-- Values -->
    <section class="midesk-landing-section midesk-landing-values">
      <div class="midesk-landing-container">
        <h2 class="midesk-landing-section-title">{{ t('landing.valuesTitle') }}</h2>
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

    <!-- Features -->
    <section id="features" class="midesk-landing-section">
      <div class="midesk-landing-container">
        <div class="midesk-landing-section-header">
          <h2 class="midesk-landing-section-title">{{ t('landing.featuresTitle') }}</h2>
          <p class="midesk-landing-section-subtitle">{{ t('landing.featuresSubtitle') }}</p>
        </div>

        <div class="midesk-landing-features-grid">
          <article
            v-for="feature in features"
            :key="feature.key"
            class="midesk-landing-feature-card"
          >
            <div class="midesk-landing-feature-icon">
              <UIcon :name="feature.icon" class="size-5" />
            </div>
            <h3>{{ t(`landing.featureItems.${feature.key}.title`) }}</h3>
            <p>{{ t(`landing.featureItems.${feature.key}.desc`) }}</p>
          </article>
        </div>

        <div class="midesk-landing-roadmap">
          <span class="midesk-landing-roadmap-badge">{{ t('landing.roadmapBadge') }}</span>
          <span class="midesk-landing-roadmap-label">{{ t('landing.roadmapTitle') }}:</span>
          <template v-for="(item, i) in roadmapItems" :key="item">
            <span v-if="i > 0" class="midesk-landing-roadmap-sep">·</span>
            <span class="midesk-landing-roadmap-item">{{ t(`landing.roadmapItems.${item}`) }}</span>
          </template>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="midesk-landing-section midesk-landing-how">
      <div class="midesk-landing-container">
        <div class="midesk-landing-section-header">
          <h2 class="midesk-landing-section-title">{{ t('landing.howTitle') }}</h2>
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
      </div>
    </section>

    <!-- Testimonials -->
    <section class="midesk-landing-section">
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
              variant="subtle"
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
              :to="tier.key === 'free' ? '/register' : '/register'"
              :color="tier.highlighted ? 'primary' : 'neutral'"
              :variant="tier.highlighted ? 'solid' : 'outline'"
              block
              class="mt-auto"
            >
              {{ t(`landing.pricingTiers.${tier.key}.cta`) }}
            </UButton>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="midesk-landing-section">
      <div class="midesk-landing-container midesk-landing-container--narrow">
        <h2 class="midesk-landing-section-title midesk-landing-section-title--center">
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
        <h2>{{ t('landing.ctaTitle') }}</h2>
        <p>{{ t('landing.ctaSubtitle') }}</p>
        <div class="midesk-landing-actions">
          <UButton to="/register" size="xl" color="primary">
            {{ t('landing.getStarted') }}
          </UButton>
          <UButton to="/login" size="xl" variant="ghost" color="neutral">
            {{ t('landing.consult') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="midesk-landing-footer">
      <div class="midesk-landing-container midesk-landing-footer-inner">
        <AppLogo />
        <p class="midesk-landing-footer-tagline">{{ t('landing.footerTagline') }}</p>
        <p class="midesk-landing-footer-copy">{{ t('landing.footer') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { LandingSection } from '~/utils/landing-data'
import { landingSectionAnchor } from '~/utils/landing-data'

const props = defineProps<{
  section: LandingSection
  reversed?: boolean
}>()

const { t } = useI18n()
const { nextIcon } = useDirectionalIcons()
</script>

<template>
  <section
    :id="landingSectionAnchor(section.key)"
    class="midesk-landing-section midesk-landing-section-detail"
    :class="[
      `midesk-landing-section-detail--${section.accent}`,
      { 'is-reversed': reversed }
    ]"
    :aria-labelledby="`section-title-${section.key}`"
  >
    <div class="midesk-landing-section-detail-bg" aria-hidden="true" />

    <div class="midesk-landing-container midesk-landing-section-detail-inner">
      <LandingReveal>
        <a href="#sections" class="midesk-landing-section-back">
          <UIcon name="i-lucide-arrow-up" class="size-3.5" />
          {{ t('landing.sectionBackToOverview') }}
        </a>
      </LandingReveal>

      <div class="midesk-landing-section-detail-grid">
        <LandingReveal :delay="80">
          <div class="midesk-landing-section-detail-copy">
            <p class="midesk-landing-section-eyebrow">
              {{ t('landing.sectionLabel') }}
            </p>
            <h2 :id="`section-title-${section.key}`" class="midesk-landing-section-detail-title">
              <span class="midesk-landing-section-detail-icon">
                <UIcon :name="section.icon" class="size-5" />
              </span>
              {{ t(`landing.productSections.${section.key}.title`) }}
            </h2>
            <p class="midesk-landing-section-detail-lead">
              {{ t(`landing.productSections.${section.key}.desc`) }}
            </p>
            <p class="midesk-landing-section-detail-body">
              {{ t(`landing.productSections.${section.key}.longDesc`) }}
            </p>

            <div class="midesk-landing-section-detail-for">
              <UIcon name="i-lucide-users" class="size-4 text-[var(--color-midesk-accent)]" />
              <div>
                <strong>{{ t('landing.sectionWhoFor') }}</strong>
                <span>{{ t(`landing.productSections.${section.key}.whoFor`) }}</span>
              </div>
            </div>

            <ul class="midesk-landing-section-detail-features">
              <li v-for="featureKey in section.featureKeys" :key="featureKey">
                <UIcon name="i-lucide-check-circle-2" class="size-4 shrink-0 text-[var(--color-midesk-accent)]" />
                <div>
                  <strong>{{ t(`landing.productSections.${section.key}.features.${featureKey}.title`) }}</strong>
                  <span>{{ t(`landing.productSections.${section.key}.features.${featureKey}.desc`) }}</span>
                </div>
              </li>
            </ul>

            <div class="midesk-landing-section-detail-actions">
              <UButton to="/register" color="primary" size="lg" class="midesk-landing-btn-glow" :icon="nextIcon">
                {{ t('landing.sectionCta') }}
              </UButton>
            </div>
          </div>
        </LandingReveal>

        <LandingReveal :delay="140">
          <LandingSectionVisual
            :section-key="section.key"
            :accent="section.accent"
            class="midesk-landing-section-detail-visual"
          />
        </LandingReveal>
      </div>
    </div>
  </section>
</template>

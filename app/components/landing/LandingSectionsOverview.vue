<script setup lang="ts">
import {
  LANDING_PRODUCT_SECTIONS,
  landingSectionAnchor,
  type LandingSectionKey
} from '~/utils/landing-data'

const { t } = useI18n()
const { nextIcon } = useDirectionalIcons()

const hovered = ref<LandingSectionKey | null>(null)
</script>

<template>
  <section id="sections" class="midesk-landing-section midesk-landing-sections-overview" aria-labelledby="landing-sections-title">
    <div class="midesk-landing-sections-overview-bg" aria-hidden="true" />

    <div class="midesk-landing-container">
      <LandingReveal>
        <div class="midesk-landing-section-header">
          <p class="midesk-landing-section-eyebrow">{{ t('landing.sectionEyebrows.sections') }}</p>
          <h2 id="landing-sections-title" class="midesk-landing-section-title">
            {{ t('landing.sectionsOverviewTitle') }}
          </h2>
          <p class="midesk-landing-section-subtitle">{{ t('landing.sectionsOverviewSubtitle') }}</p>
        </div>
      </LandingReveal>

      <div class="midesk-landing-sections-grid">
        <LandingReveal
          v-for="(section, index) in LANDING_PRODUCT_SECTIONS"
          :key="section.key"
          :delay="index * 70"
        >
          <a
            :href="`#${landingSectionAnchor(section.key)}`"
            class="midesk-landing-section-card"
            :class="[
              `midesk-landing-section-card--${section.accent}`,
              { 'is-hovered': hovered === section.key }
            ]"
            @mouseenter="hovered = section.key"
            @mouseleave="hovered = null"
            @focus="hovered = section.key"
            @blur="hovered = null"
          >
            <div class="midesk-landing-section-card-glow" aria-hidden="true" />
            <div class="midesk-landing-section-card-icon">
              <UIcon :name="section.icon" class="size-6" />
            </div>
            <h3>{{ t(`landing.productSections.${section.key}.title`) }}</h3>
            <p>{{ t(`landing.productSections.${section.key}.summary`) }}</p>
            <ul class="midesk-landing-section-card-tags">
              <li v-for="fi in 3" :key="fi">
                {{ t(`landing.productSections.${section.key}.highlights.${fi - 1}`) }}
              </li>
            </ul>
            <span class="midesk-landing-section-card-link">
              {{ t('landing.sectionExplore') }}
              <UIcon :name="nextIcon" class="size-4" />
            </span>
          </a>
        </LandingReveal>
      </div>
    </div>
  </section>
</template>

<template>
  <div class="midesk-landing-preview" aria-hidden="true">
    <div class="midesk-landing-preview-chrome">
      <div class="midesk-landing-preview-dots">
        <span /><span /><span />
      </div>
      <div class="midesk-landing-preview-bar" />
    </div>

    <div class="midesk-landing-preview-body">
      <aside class="midesk-landing-preview-sidebar">
        <div class="midesk-landing-preview-logo" />
        <div class="midesk-landing-preview-nav">
          <div class="is-active" />
          <div /><div /><div />
        </div>
      </aside>

      <div class="midesk-landing-preview-main">
        <div class="midesk-landing-preview-topbar" />
        <div class="midesk-landing-preview-stats">
          <div v-for="i in 3" :key="i" />
        </div>
        <div class="midesk-landing-preview-board">
          <div v-for="col in 4" :key="col" class="midesk-landing-preview-column">
            <div class="midesk-landing-preview-col-head" />
            <div class="midesk-landing-preview-card is-accent" />
            <div class="midesk-landing-preview-card" />
            <div v-if="col < 3" class="midesk-landing-preview-card is-short" />
          </div>
        </div>
      </div>
    </div>

    <div class="midesk-landing-preview-float midesk-landing-preview-float--chart">
      <UIcon name="i-lucide-line-chart" class="size-4 text-[var(--color-midesk-accent)]" />
      <span>Burndown</span>
    </div>

    <div class="midesk-landing-preview-float midesk-landing-preview-float--notif">
      <UIcon name="i-lucide-bell" class="size-3.5" />
      <span>3</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { can } = usePermissions()

const links = computed(() => [
  { label: t('crm.nav.dashboard'), to: '/crm', show: can('crm:view') },
  { label: t('crm.nav.contacts'), to: '/crm/contacts', show: can('crm:view') },
  { label: t('crm.nav.pipeline'), to: '/crm/opportunities', show: can('crm:view') }
].filter(item => item.show))

function isActive(path: string) {
  if (path === '/crm') return route.path === '/crm'
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <nav v-if="links.length > 1" class="midesk-subnav">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="midesk-subnav-link"
      :class="{ 'midesk-subnav-link--active': isActive(link.to) }"
    >
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: ['auth', 'onboarding'] })

const { t, locale } = useI18n()
const { createOrg } = useAuth()
const step = ref(1)
const loading = ref(false)
const invites = ref<string[]>([''])

const form = reactive({
  name: '',
  region: 'IR' as 'IR' | 'INTL',
  locale: 'fa-IR',
  calendar_type: 'jalali' as 'jalali' | 'gregorian',
  default_currency: 'IRR',
  timezone: 'Asia/Tehran'
})

watch(() => form.region, (r) => {
  if (r === 'IR') {
    form.locale = 'fa-IR'
    form.calendar_type = 'jalali'
    form.default_currency = 'IRR'
    form.timezone = 'Asia/Tehran'
    locale.value = 'fa'
  } else {
    form.locale = 'en-US'
    form.calendar_type = 'gregorian'
    form.default_currency = 'USD'
    form.timezone = 'UTC'
    locale.value = 'en'
  }
})

async function finish() {
  loading.value = true
  try {
    await createOrg(form)
    await navigateTo('/dashboard', { replace: true })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="midesk-glass midesk-form-card border-[var(--color-midesk-border)]">
    <template #header>
      <h1 class="text-xl font-semibold">{{ t('onboarding.title') }}</h1>
      <UProgress :model-value="step * 25" color="primary" size="xs" class="mt-3" />
    </template>

    <div v-if="step === 1" class="midesk-form-fields">
      <MideskFormField :label="t('onboarding.orgName')" :model-value="form.name">
        <UInput v-model="form.name" placeholder=" " />
      </MideskFormField>
      <UButton block :disabled="!form.name" @click="step = 2">
        {{ t('onboarding.next') }}
      </UButton>
    </div>

    <div v-else-if="step === 2" class="midesk-form-fields">
      <MideskFormField :label="t('onboarding.region')" :model-value="form.region">
        <URadioGroup
          v-model="form.region"
          :items="[
            { label: t('onboarding.regionIR'), value: 'IR' },
            { label: t('onboarding.regionINTL'), value: 'INTL' }
          ]"
        />
      </MideskFormField>
      <div class="flex gap-2">
        <UButton variant="outline" @click="step = 1">{{ t('onboarding.back') }}</UButton>
        <UButton block @click="step = 3">{{ t('onboarding.next') }}</UButton>
      </div>
    </div>

    <div v-else-if="step === 3" class="midesk-form-fields">
      <MideskFormField :label="t('onboarding.calendar')" :model-value="form.calendar_type">
        <USelect
          v-model="form.calendar_type"
          :items="[
            { label: t('onboarding.calendarJalali'), value: 'jalali' },
            { label: t('onboarding.calendarGregorian'), value: 'gregorian' }
          ]"
        />
      </MideskFormField>
      <MideskFormField
        :label="t('onboarding.currency')"
        :model-value="form.default_currency"
        field-class="midesk-ltr-field"
      >
        <UInput v-model="form.default_currency" dir="ltr" placeholder=" " />
      </MideskFormField>
      <MideskFormField
        :label="t('onboarding.timezone')"
        :model-value="form.timezone"
        field-class="midesk-ltr-field"
      >
        <UInput v-model="form.timezone" dir="ltr" placeholder=" " />
      </MideskFormField>
      <div class="flex gap-2">
        <UButton variant="outline" @click="step = 2">{{ t('onboarding.back') }}</UButton>
        <UButton block @click="step = 4">{{ t('onboarding.next') }}</UButton>
      </div>
    </div>

    <div v-else class="midesk-form-fields">
      <p class="text-sm text-[var(--color-midesk-muted)]">{{ t('onboarding.inviteMembers') }}</p>
      <UInput
        v-for="(_, i) in invites"
        :key="i"
        v-model="invites[i]"
        :placeholder="t('onboarding.inviteEmail')"
      />
      <div class="flex gap-2">
        <UButton variant="outline" @click="step = 3">{{ t('onboarding.back') }}</UButton>
        <UButton block :loading="loading" color="primary" @click="finish">
          {{ t('onboarding.finish') }}
        </UButton>
      </div>
    </div>
  </UCard>
</template>

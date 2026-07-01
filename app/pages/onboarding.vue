<script setup lang="ts">
type OnboardingWizardStep = {
  id: number
  icon: string
  title: string
  description: string
}

definePageMeta({ layout: 'auth-onboarding', middleware: ['auth', 'onboarding'] })

const { t, locale } = useI18n()
const { createOrg } = useAuth()
const toast = useToast()
const { nextIcon, backIcon } = useDirectionalIcons()

const step = ref(1)
const slideDirection = ref<'forward' | 'back'>('forward')
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

const steps = computed<OnboardingWizardStep[]>(() => [
  {
    id: 1,
    icon: 'i-lucide-building-2',
    title: t('onboarding.steps.org.title'),
    description: t('onboarding.steps.org.description')
  },
  {
    id: 2,
    icon: 'i-lucide-globe',
    title: t('onboarding.steps.region.title'),
    description: t('onboarding.steps.region.description')
  },
  {
    id: 3,
    icon: 'i-lucide-settings-2',
    title: t('onboarding.steps.settings.title'),
    description: t('onboarding.steps.settings.description')
  },
  {
    id: 4,
    icon: 'i-lucide-user-plus',
    title: t('onboarding.steps.invite.title'),
    description: t('onboarding.steps.invite.description')
  }
])

const currentStepMeta = computed(() => steps.value.find(s => s.id === step.value))

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

function goTo(next: number) {
  slideDirection.value = next > step.value ? 'forward' : 'back'
  step.value = next
}

function nextStep() {
  if (step.value < steps.value.length) goTo(step.value + 1)
}

function prevStep() {
  if (step.value > 1) goTo(step.value - 1)
}

function addInviteField() {
  invites.value.push('')
}

async function finish() {
  loading.value = true
  try {
    await createOrg(form)
    await navigateTo('/dashboard', { replace: true })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="midesk-glass w-full border-[var(--color-midesk-border)]">
    <template #header>
      <div class="space-y-1">
        <h1 class="text-xl font-semibold">{{ t('onboarding.title') }}</h1>
        <p class="text-sm text-[var(--color-midesk-muted)]">{{ t('onboarding.subtitle') }}</p>
      </div>
    </template>

    <OnboardingStepIndicator
      :steps="steps"
      :current="step"
      class="mb-8"
      @update:current="goTo"
    />

    <Transition :name="slideDirection === 'forward' ? 'onboarding-forward' : 'onboarding-back'" mode="out-in">
      <div :key="step">
        <div v-if="step === 1" class="space-y-6">
          <div class="onboarding-step-intro">
            <div class="onboarding-step-intro__icon">
              <UIcon :name="currentStepMeta?.icon ?? 'i-lucide-building-2'" class="size-5" />
            </div>
            <div>
              <h2 class="text-base font-semibold">{{ currentStepMeta?.title }}</h2>
              <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">{{ currentStepMeta?.description }}</p>
            </div>
          </div>

          <MideskFormField :label="t('onboarding.orgName')" :model-value="form.name" required>
            <UInput v-model="form.name" placeholder=" " autofocus />
          </MideskFormField>

          <UButton block :disabled="!form.name.trim()" color="primary" :icon="nextIcon" @click="nextStep">
            {{ t('onboarding.next') }}
          </UButton>
        </div>

        <div v-else-if="step === 2" class="space-y-6">
          <div class="onboarding-step-intro">
            <div class="onboarding-step-intro__icon">
              <UIcon :name="currentStepMeta?.icon ?? 'i-lucide-globe'" class="size-5" />
            </div>
            <div>
              <h2 class="text-base font-semibold">{{ currentStepMeta?.title }}</h2>
              <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">{{ currentStepMeta?.description }}</p>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              class="onboarding-region-card"
              :class="form.region === 'IR' ? 'onboarding-region-card--active' : ''"
              @click="form.region = 'IR'"
            >
              <UIcon name="i-lucide-map-pin" class="size-5 shrink-0" />
              <div class="text-start">
                <p class="font-medium">{{ t('onboarding.regionIR') }}</p>
                <p class="mt-0.5 text-xs text-[var(--color-midesk-muted)]">{{ t('onboarding.regionIRHint') }}</p>
              </div>
              <UIcon
                v-if="form.region === 'IR'"
                name="i-lucide-circle-check"
                class="ms-auto size-5 text-[var(--color-midesk-accent)]"
              />
            </button>

            <button
              type="button"
              class="onboarding-region-card"
              :class="form.region === 'INTL' ? 'onboarding-region-card--active' : ''"
              @click="form.region = 'INTL'"
            >
              <UIcon name="i-lucide-earth" class="size-5 shrink-0" />
              <div class="text-start">
                <p class="font-medium">{{ t('onboarding.regionINTL') }}</p>
                <p class="mt-0.5 text-xs text-[var(--color-midesk-muted)]">{{ t('onboarding.regionINTLHint') }}</p>
              </div>
              <UIcon
                v-if="form.region === 'INTL'"
                name="i-lucide-circle-check"
                class="ms-auto size-5 text-[var(--color-midesk-accent)]"
              />
            </button>
          </div>

          <div class="flex gap-2">
            <UButton variant="outline" color="neutral" class="shrink-0" :icon="backIcon" @click="prevStep">
              {{ t('onboarding.back') }}
            </UButton>
            <UButton block color="primary" :icon="nextIcon" @click="nextStep">
              {{ t('onboarding.next') }}
            </UButton>
          </div>
        </div>

        <div v-else-if="step === 3" class="space-y-6">
          <div class="onboarding-step-intro">
            <div class="onboarding-step-intro__icon">
              <UIcon :name="currentStepMeta?.icon ?? 'i-lucide-settings-2'" class="size-5" />
            </div>
            <div>
              <h2 class="text-base font-semibold">{{ currentStepMeta?.title }}</h2>
              <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">{{ currentStepMeta?.description }}</p>
            </div>
          </div>

          <div class="midesk-form-fields">
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
          </div>

          <div class="rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.02] p-4">
            <p class="mb-2 text-xs font-medium text-[var(--color-midesk-muted)]">{{ t('onboarding.preview') }}</p>
            <div class="flex flex-wrap gap-2">
              <UBadge variant="subtle" color="primary">{{ form.calendar_type === 'jalali' ? t('onboarding.calendarJalali') : t('onboarding.calendarGregorian') }}</UBadge>
              <UBadge variant="subtle" color="neutral">{{ form.default_currency }}</UBadge>
              <UBadge variant="subtle" color="neutral">{{ form.timezone }}</UBadge>
            </div>
          </div>

          <div class="flex gap-2">
            <UButton variant="outline" color="neutral" class="shrink-0" :icon="backIcon" @click="prevStep">
              {{ t('onboarding.back') }}
            </UButton>
            <UButton block color="primary" :icon="nextIcon" @click="nextStep">
              {{ t('onboarding.next') }}
            </UButton>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div class="onboarding-step-intro">
            <div class="onboarding-step-intro__icon">
              <UIcon :name="currentStepMeta?.icon ?? 'i-lucide-user-plus'" class="size-5" />
            </div>
            <div>
              <h2 class="text-base font-semibold">{{ currentStepMeta?.title }}</h2>
              <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">{{ currentStepMeta?.description }}</p>
            </div>
          </div>

          <div class="midesk-form-fields">
            <MideskFormField
              v-for="(_, i) in invites"
              :key="i"
              :label="t('onboarding.inviteEmail')"
              :model-value="invites[i]"
              field-class="midesk-ltr-field"
            >
              <UInput v-model="invites[i]" type="email" dir="ltr" placeholder=" " />
            </MideskFormField>
            <UButton
              variant="soft"
              color="neutral"
              icon="i-lucide-plus"
              size="sm"
              class="self-start"
              @click="addInviteField"
            >
              {{ t('onboarding.addInvite') }}
            </UButton>
          </div>

          <div class="flex gap-2">
            <UButton variant="outline" color="neutral" class="shrink-0" :icon="backIcon" @click="prevStep">
              {{ t('onboarding.back') }}
            </UButton>
            <UButton block :loading="loading" color="primary" icon="i-lucide-sparkles" @click="finish">
              {{ t('onboarding.finish') }}
            </UButton>
          </div>
        </div>
      </div>
    </Transition>
  </UCard>
</template>

<style scoped>
.onboarding-step-intro {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.onboarding-step-intro__icon {
  display: flex;
  size: 2.5rem;
  width: 2.5rem;
  height: 2.5rem;
  shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--color-midesk-accent) 12%, transparent);
  color: var(--color-midesk-accent);
}

.onboarding-region-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  border-radius: 0.875rem;
  border: 2px solid var(--color-midesk-border);
  background: transparent;
  color: var(--color-midesk-text);
  text-align: start;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.onboarding-region-card:hover {
  border-color: color-mix(in srgb, var(--color-midesk-accent) 40%, var(--color-midesk-border));
  background: white/[0.02];
}

.onboarding-region-card--active {
  border-color: var(--color-midesk-accent);
  background: color-mix(in srgb, var(--color-midesk-accent) 8%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-midesk-accent) 20%, transparent);
}

.onboarding-forward-enter-active,
.onboarding-forward-leave-active,
.onboarding-back-enter-active,
.onboarding-back-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.28s ease;
}

.onboarding-forward-enter-from {
  opacity: 0;
  transform: translateX(-1.25rem);
}

.onboarding-forward-leave-to {
  opacity: 0;
  transform: translateX(1.25rem);
}

.onboarding-back-enter-from {
  opacity: 0;
  transform: translateX(1.25rem);
}

.onboarding-back-leave-to {
  opacity: 0;
  transform: translateX(-1.25rem);
}

:global([dir='rtl']) .onboarding-forward-enter-from {
  transform: translateX(1.25rem);
}

:global([dir='rtl']) .onboarding-forward-leave-to {
  transform: translateX(-1.25rem);
}

:global([dir='rtl']) .onboarding-back-enter-from {
  transform: translateX(-1.25rem);
}

:global([dir='rtl']) .onboarding-back-leave-to {
  transform: translateX(1.25rem);
}
</style>

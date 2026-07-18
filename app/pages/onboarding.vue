<script setup lang="ts">
import {
  currencyOptionsForRegion,
  ensureOrgDefaultsForRegion,
  timezoneOptionsForRegion
} from '~/utils/org-options'

type OnboardingWizardStep = {
  id: number
  icon: string
  title: string
  description: string
}

definePageMeta({ layout: 'auth-onboarding', middleware: ['auth', 'onboarding'] })

const { t, locale } = useI18n()
const { createOrg, logout } = useAuth()
const toast = useToast()
const { nextIcon, backIcon } = useDirectionalIcons()

type OnboardingPhase = 'choose' | 'create' | 'waiting'

const onboardingIntent = useCookie<'choose' | 'create' | 'waiting'>('midesk_onboarding_intent', {
  default: () => 'choose',
  maxAge: 60 * 60 * 24 * 30
})

const phase = ref<OnboardingPhase>(
  onboardingIntent.value === 'create' || onboardingIntent.value === 'waiting'
    ? onboardingIntent.value
    : 'choose'
)
const step = ref(1)
const slideDirection = ref<'forward' | 'back'>('forward')
const loading = ref(false)
const invites = ref<string[]>([''])

const form = reactive({
  name: '',
  region: 'IR' as 'IR' | 'INTL',
  locale: 'fa',
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

const headerTitle = computed(() => {
  if (phase.value === 'choose') return t('onboarding.chooseTitle')
  if (phase.value === 'waiting') return t('onboarding.waitingTitle')
  return t('onboarding.title')
})

const headerSubtitle = computed(() => {
  if (phase.value === 'choose') return t('onboarding.chooseSubtitle')
  if (phase.value === 'waiting') return t('onboarding.waitingSubtitle')
  return t('onboarding.subtitle')
})

const currencyOptions = computed(() => currencyOptionsForRegion(form.region, t))
const timezoneOptions = computed(() => timezoneOptionsForRegion(form.region, t))

const selectedCurrencyLabel = computed(
  () => currencyOptions.value.find(item => item.value === form.default_currency)?.label ?? form.default_currency
)
const selectedTimezoneLabel = computed(
  () => timezoneOptions.value.find(item => item.value === form.timezone)?.label ?? form.timezone
)

function setPhase(next: OnboardingPhase) {
  phase.value = next
  onboardingIntent.value = next
  if (next === 'create') {
    step.value = 1
    slideDirection.value = 'forward'
  }
}

function chooseCreate() {
  setPhase('create')
}

function chooseWait() {
  setPhase('waiting')
}

function backToChoices() {
  setPhase('choose')
}

watch(() => form.region, (r) => {
  if (r === 'IR') {
    form.locale = 'fa'
    form.calendar_type = 'jalali'
    locale.value = 'fa'
  } else {
    form.locale = 'en'
    form.calendar_type = 'gregorian'
    locale.value = 'en'
  }

  const defaults = ensureOrgDefaultsForRegion(r, {
    default_currency: form.default_currency,
    timezone: form.timezone
  })
  form.default_currency = defaults.default_currency
  form.timezone = defaults.timezone
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
    onboardingIntent.value = 'choose'
    await navigateTo('/dashboard', { replace: true })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

async function signOut() {
  await logout()
}
</script>

<template>
  <UCard class="midesk-glass onboarding-card w-full max-w-full border-[var(--color-midesk-border)]">
    <template #header>
      <div class="space-y-1 text-center sm:text-start">
        <h1 class="text-xl font-semibold">{{ headerTitle }}</h1>
        <p class="text-sm text-[var(--color-midesk-muted)]">{{ headerSubtitle }}</p>
      </div>
    </template>

    <div v-if="phase === 'choose'" class="onboarding-step">
      <div class="onboarding-choice-grid">
        <button type="button" class="onboarding-choice-card" @click="chooseCreate">
          <div class="onboarding-choice-card__icon">
            <UIcon name="i-lucide-building-2" class="size-5" />
          </div>
          <div class="min-w-0 text-start">
            <p class="font-semibold">{{ t('onboarding.chooseCreateTitle') }}</p>
            <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">{{ t('onboarding.chooseCreateDesc') }}</p>
          </div>
          <UIcon :name="nextIcon" class="size-4 shrink-0 text-[var(--color-midesk-muted)]" />
        </button>

        <button type="button" class="onboarding-choice-card" @click="chooseWait">
          <div class="onboarding-choice-card__icon">
            <UIcon name="i-lucide-mail-plus" class="size-5" />
          </div>
          <div class="min-w-0 text-start">
            <p class="font-semibold">{{ t('onboarding.chooseWaitTitle') }}</p>
            <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">{{ t('onboarding.chooseWaitDesc') }}</p>
          </div>
          <UIcon :name="nextIcon" class="size-4 shrink-0 text-[var(--color-midesk-muted)]" />
        </button>
      </div>
    </div>

    <div v-else-if="phase === 'waiting'" class="onboarding-step">
      <div class="onboarding-waiting">
        <div class="onboarding-waiting__icon">
          <UIcon name="i-lucide-hourglass" class="size-6" />
        </div>
        <p class="onboarding-waiting__hint">{{ t('onboarding.waitingHint') }}</p>
        <div class="onboarding-waiting__actions">
          <UButton color="primary" block @click="chooseCreate">
            {{ t('onboarding.waitingCreateCta') }}
          </UButton>
          <UButton variant="ghost" color="neutral" block @click="backToChoices">
            {{ t('onboarding.backToChoices') }}
          </UButton>
          <UButton variant="outline" color="neutral" block @click="signOut">
            {{ t('onboarding.waitingLogout') }}
          </UButton>
        </div>
      </div>
    </div>

    <template v-else>
      <OnboardingStepIndicator
        :steps="steps"
        :current="step"
        class="mb-8"
        @update:current="goTo"
      />

      <UButton
        variant="ghost"
        color="neutral"
        size="sm"
        class="mb-4"
        :icon="backIcon"
        @click="backToChoices"
      >
        {{ t('onboarding.backToChoices') }}
      </UButton>

      <Transition :name="slideDirection === 'forward' ? 'onboarding-forward' : 'onboarding-back'" mode="out-in">
        <div :key="step">
          <div v-if="step === 1" class="onboarding-step">
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

            <UButton block :disabled="!form.name.trim()" color="primary" :icon="nextIcon" class="mt-2" @click="nextStep">
              {{ t('onboarding.next') }}
            </UButton>
          </div>

        <div v-else-if="step === 2" class="onboarding-step">
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

          <div class="onboarding-actions">
            <UButton variant="outline" color="neutral" class="shrink-0" :icon="backIcon" @click="prevStep">
              {{ t('onboarding.back') }}
            </UButton>
            <UButton block color="primary" :icon="nextIcon" @click="nextStep">
              {{ t('onboarding.next') }}
            </UButton>
          </div>
        </div>

        <div v-else-if="step === 3" class="onboarding-step">
          <div class="onboarding-step-intro">
            <div class="onboarding-step-intro__icon">
              <UIcon :name="currentStepMeta?.icon ?? 'i-lucide-settings-2'" class="size-5" />
            </div>
            <div>
              <h2 class="text-base font-semibold">{{ currentStepMeta?.title }}</h2>
              <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">{{ currentStepMeta?.description }}</p>
            </div>
          </div>

          <div class="onboarding-settings-panel midesk-form-panel">
            <div class="onboarding-settings-grid">
              <MideskFormField :label="t('onboarding.calendar')" :model-value="form.calendar_type">
                <USelect
                  v-model="form.calendar_type"
                  class="w-full"
                  :items="[
                    { label: t('onboarding.calendarJalali'), value: 'jalali' },
                    { label: t('onboarding.calendarGregorian'), value: 'gregorian' }
                  ]"
                />
              </MideskFormField>

              <MideskFormField
                :label="t('onboarding.currency')"
                :model-value="selectedCurrencyLabel"
              >
                <USelect
                  v-model="form.default_currency"
                  class="w-full"
                  :items="currencyOptions"
                />
              </MideskFormField>

              <div class="onboarding-settings-grid__timezone">
                <MideskFormField
                  :label="t('onboarding.timezone')"
                  :model-value="selectedTimezoneLabel"
                >
                  <USelect
                    v-model="form.timezone"
                    class="w-full"
                    :items="timezoneOptions"
                  />
                </MideskFormField>
              </div>
            </div>

            <div class="onboarding-preview">
              <p class="onboarding-preview__title">{{ t('onboarding.preview') }}</p>
              <div class="onboarding-preview__items">
                <div class="onboarding-preview__item">
                  <UIcon name="i-lucide-calendar-days" class="size-4 text-[var(--color-midesk-accent)]" />
                  <span>{{ form.calendar_type === 'jalali' ? t('onboarding.calendarJalali') : t('onboarding.calendarGregorian') }}</span>
                </div>
                <div class="onboarding-preview__item">
                  <UIcon name="i-lucide-banknote" class="size-4 text-[var(--color-midesk-accent)]" />
                  <span>{{ selectedCurrencyLabel }}</span>
                </div>
                <div class="onboarding-preview__item">
                  <UIcon name="i-lucide-clock" class="size-4 text-[var(--color-midesk-accent)]" />
                  <span>{{ selectedTimezoneLabel }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="onboarding-actions">
            <UButton variant="outline" color="neutral" class="shrink-0" :icon="backIcon" @click="prevStep">
              {{ t('onboarding.back') }}
            </UButton>
            <UButton block color="primary" :icon="nextIcon" @click="nextStep">
              {{ t('onboarding.next') }}
            </UButton>
          </div>
        </div>

        <div v-else class="onboarding-step">
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

          <div class="onboarding-actions">
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
    </template>
  </UCard>
</template>

<style scoped>
.onboarding-card {
  width: 100%;
  margin-inline: auto;
}

.onboarding-card :deep([data-slot='root']),
.onboarding-card :deep([data-slot='body']),
.onboarding-card :deep([data-slot='header']) {
  width: 100%;
}

.onboarding-card :deep([data-slot='body']) {
  padding-top: 0.25rem;
}

.onboarding-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.onboarding-choice-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.onboarding-choice-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  border-radius: 0.875rem;
  border: 1px solid var(--color-midesk-border);
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  text-align: start;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.onboarding-choice-card:hover {
  border-color: color-mix(in srgb, var(--color-midesk-accent) 45%, var(--color-midesk-border));
  background: rgba(255, 255, 255, 0.05);
}

.onboarding-choice-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: 0.625rem;
  border: 1px solid var(--color-midesk-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-midesk-accent);
}

.onboarding-waiting {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding: 0.5rem 0 0.25rem;
}

.onboarding-waiting__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 0.875rem;
  border: 1px solid var(--color-midesk-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-midesk-accent);
}

.onboarding-waiting__hint {
  margin: 0;
  max-width: 28rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-midesk-muted);
}

.onboarding-waiting__actions {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.onboarding-step-intro {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.onboarding-step-intro__icon {
  display: flex;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
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
  background: rgba(255, 255, 255, 0.02);
}

.onboarding-region-card--active {
  border-color: var(--color-midesk-accent);
  background: color-mix(in srgb, var(--color-midesk-accent) 8%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-midesk-accent) 20%, transparent);
}

.onboarding-settings-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.onboarding-settings-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .onboarding-settings-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .onboarding-settings-grid__timezone {
    grid-column: 1 / -1;
  }
}

.onboarding-settings-grid :deep([data-slot='trigger']),
.onboarding-settings-grid :deep(button) {
  width: 100%;
}

.onboarding-preview {
  border-radius: 0.875rem;
  border: 1px solid var(--color-midesk-border);
  background: color-mix(in srgb, var(--color-midesk-accent) 4%, transparent);
  padding: 1rem;
}

.onboarding-preview__title {
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-midesk-muted);
}

.onboarding-preview__items {
  display: grid;
  gap: 0.625rem;
}

@media (min-width: 640px) {
  .onboarding-preview__items {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.onboarding-preview__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.25rem;
  padding: 0.5rem 0.625rem;
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.8125rem;
  color: var(--color-midesk-text);
}

.onboarding-actions {
  display: flex;
  gap: 0.625rem;
  padding-top: 0.25rem;
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

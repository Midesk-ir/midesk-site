<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { t } = useI18n()
const { register } = useAuth()
const route = useRoute()
const loading = ref(false)
const toast = useToast()

const planQuery = computed(() => {
  const plan = route.query.plan as string | undefined
  const valid = ['free', 'startup', 'pro', 'enterprise'] as const
  return plan && valid.includes(plan as typeof valid[number]) ? plan : undefined
})

const schema = toTypedSchema(z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10).optional().or(z.literal('')),
  password: z.string().min(6)
}))

async function onSubmit(values: { name: string, email?: string, phone?: string, password: string }) {
  loading.value = true
  try {
    const result = await register({
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      password: values.password
    })
    toast.add({ title: t('auth.otpSent'), color: 'success' })
    await navigateTo({
      path: '/verify-otp',
      query: { phone: result.phone || values.phone }
    })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="midesk-auth-card">
    <div class="midesk-auth-card-header">
      <div class="midesk-auth-card-icon-wrap midesk-auth-card-icon-wrap--register">
        <UIcon name="i-lucide-rocket" class="size-6 text-[var(--color-midesk-accent)]" />
      </div>
      <h1 class="midesk-auth-card-title">{{ t('auth.register') }}</h1>
      <p class="midesk-auth-card-subtitle">{{ t('auth.registerSubtitle') }}</p>

      <div v-if="planQuery" class="midesk-auth-plan-badge">
        <UIcon name="i-lucide-badge-check" class="size-4" />
        {{ t('auth.selectedPlan', { plan: t(`landing.pricingTiers.${planQuery}.name`, planQuery) }) }}
      </div>
    </div>

    <div class="midesk-auth-benefits">
      <span v-for="benefit in ['free', 'fast', 'secure']" :key="benefit">
        <UIcon name="i-lucide-check-circle-2" class="size-3.5 text-[var(--color-midesk-accent)]" />
        {{ t(`auth.registerBenefits.${benefit}`) }}
      </span>
    </div>

    <VeeForm :validation-schema="schema" class="midesk-auth-card-body" @submit="onSubmit">
      <div class="midesk-form-fields">
        <VeeField v-slot="{ field, errorMessage }" name="name">
          <MideskFormField :label="t('auth.name')" :error="errorMessage" :model-value="field.value">
            <UInput v-bind="field" placeholder=" " icon="i-lucide-user" />
          </MideskFormField>
        </VeeField>
        <VeeField v-slot="{ field, errorMessage }" name="email">
          <MideskFormField
            :label="t('auth.email')"
            :error="errorMessage"
            :model-value="field.value"
            field-class="midesk-ltr-field"
          >
            <UInput v-bind="field" type="email" placeholder=" " icon="i-lucide-mail" />
          </MideskFormField>
        </VeeField>
        <VeeField v-slot="{ field, errorMessage }" name="phone">
          <MideskFormField
            :label="t('auth.phone')"
            :error="errorMessage"
            :model-value="field.value"
            field-class="midesk-ltr-field"
          >
            <UInput v-bind="field" dir="ltr" placeholder=" " icon="i-lucide-phone" />
          </MideskFormField>
        </VeeField>
        <VeeField v-slot="{ field, errorMessage }" name="password">
          <MideskFormField :label="t('auth.password')" :error="errorMessage" :model-value="field.value">
            <UInput v-bind="field" type="password" placeholder=" " icon="i-lucide-lock" />
          </MideskFormField>
        </VeeField>

        <UButton type="submit" block size="lg" :loading="loading" color="primary" class="midesk-auth-submit">
          {{ t('auth.registerCta') }}
        </UButton>
      </div>
    </VeeForm>

    <p class="midesk-auth-footer-link">
      {{ t('auth.hasAccount') }}
      <NuxtLink to="/login" class="midesk-link font-medium hover:underline">
        {{ t('auth.login') }}
      </NuxtLink>
    </p>
  </div>
</template>

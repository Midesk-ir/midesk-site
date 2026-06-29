<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { isNavigationFailure } from 'vue-router'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { t } = useI18n()
const { login, loginOtp } = useAuth()
const tenantStore = useTenantStore()
const route = useRoute()
const toast = useToast()

const mode = ref<'password' | 'otp'>('password')
const loading = ref(false)

const passwordSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(6)
}))

const otpSchema = toTypedSchema(z.object({
  phone: z.string().min(10)
}))

async function onPasswordSubmit(values: { email: string, password: string }) {
  loading.value = true
  try {
    await login(values)

    const target = tenantStore.hasTenant
      ? ((route.query.redirect as string) || '/dashboard')
      : '/onboarding'

    await navigateTo(target, { replace: true })
  } catch (e: unknown) {
    if (isNavigationFailure(e)) return

    const err = e as { data?: { details?: Record<string, string[]> } }
    toast.add({
      title: err.data?.details?.email?.[0] || err.data?.details?.password?.[0] || t('common.error'),
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

async function onOtpSubmit(values: { phone: string }) {
  loading.value = true
  try {
    await loginOtp(values)
    await navigateTo({ path: '/verify-otp', query: { phone: values.phone }, replace: true })
  } catch (e: unknown) {
    if (isNavigationFailure(e)) return
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

const showGoogle = computed(() => !tenantStore.isIran)
</script>

<template>
  <UCard class="midesk-glass midesk-form-card border-[var(--color-midesk-border)]">
    <template #header>
      <h1 class="text-xl font-semibold">{{ t('auth.login') }}</h1>
    </template>

    <div class="mb-4 flex gap-2">
      <UButton
        :variant="mode === 'password' ? 'solid' : 'ghost'"
        size="sm"
        @click="mode = 'password'"
      >
        {{ t('auth.loginWithPassword') }}
      </UButton>
      <UButton
        :variant="mode === 'otp' ? 'solid' : 'ghost'"
        size="sm"
        @click="mode = 'otp'"
      >
        {{ t('auth.loginWithOtp') }}
      </UButton>
    </div>

    <VeeForm
      v-if="mode === 'password'"
      :validation-schema="passwordSchema"
      @submit="onPasswordSubmit"
    >
      <div class="midesk-form-fields">
        <VeeField v-slot="{ field, errorMessage }" name="email">
          <MideskFormField
            :label="t('auth.email')"
            :error="errorMessage"
            :model-value="field.value"
            field-class="midesk-ltr-field"
          >
            <UInput
              :model-value="field.value"
              type="email"
              placeholder=" "
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </MideskFormField>
        </VeeField>
        <VeeField v-slot="{ field, errorMessage }" name="password">
          <MideskFormField
            :label="t('auth.password')"
            :error="errorMessage"
            :model-value="field.value"
          >
            <UInput
              :model-value="field.value"
              type="password"
              placeholder=" "
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </MideskFormField>
        </VeeField>
      <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('auth.demoHint') }}</p>
        <UButton type="submit" block :loading="loading" color="primary">
          {{ t('auth.login') }}
        </UButton>
      </div>
    </VeeForm>

    <VeeForm
      v-else
      :validation-schema="otpSchema"
      @submit="onOtpSubmit"
    >
      <div class="midesk-form-fields">
        <VeeField v-slot="{ field, errorMessage }" name="phone">
          <MideskFormField
            :label="t('auth.phone')"
            :error="errorMessage"
            :model-value="field.value"
            field-class="midesk-ltr-field"
          >
            <UInput
              :model-value="field.value"
              placeholder=" "
              dir="ltr"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </MideskFormField>
        </VeeField>
        <UButton type="submit" block :loading="loading" color="primary">
          {{ t('auth.sendOtp') }}
        </UButton>
      </div>
    </VeeForm>

    <UButton
      v-if="showGoogle"
      block
      class="mt-4"
      color="neutral"
      variant="outline"
      icon="i-simple-icons-google"
    >
      {{ t('auth.googleLogin') }}
    </UButton>

    <p class="mt-6 text-center text-sm text-[var(--color-midesk-muted)]">
      {{ t('auth.noAccount') }}
      <NuxtLink to="/register" class="midesk-link hover:underline">
        {{ t('auth.register') }}
      </NuxtLink>
    </p>
  </UCard>
</template>

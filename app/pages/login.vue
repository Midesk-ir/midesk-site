<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { isNavigationFailure } from 'vue-router'
import { authQueryFromRoute, resolvePostAuthTarget } from '~/utils/auth-redirect'
import { ensureSessionBootstrap } from '~/utils/session-bootstrap'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { t } = useI18n()
const { login, loginOtp, logout } = useAuth()
const authStore = useAuthStore()
const tenantStore = useTenantStore()
const route = useRoute()
const toast = useToast()

const alreadyLoggedIn = computed(() => authStore.isAuthenticated)
const sessionLoading = ref(false)

onMounted(async () => {
  if (!authStore.isAuthenticated) return

  sessionLoading.value = true
  try {
    await ensureSessionBootstrap()
  } catch (error: unknown) {
    const status = (error as { statusCode?: number })?.statusCode
    if (status === 401) {
      authStore.clearAuth()
      tenantStore.clearTenant()
    }
  } finally {
    sessionLoading.value = false
  }
})

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
    await navigateTo(resolvePostAuthTarget(route.query.redirect as string | undefined), { replace: true })
  } catch (e: unknown) {
    if (isNavigationFailure(e)) return

    const err = e as { data?: { details?: Record<string, string[]> }, statusCode?: number }
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
    await navigateTo({
      path: '/verify-otp',
      query: { phone: values.phone, ...authQueryFromRoute(route) },
      replace: true
    })
  } catch (e: unknown) {
    if (isNavigationFailure(e)) return
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

async function goToApp() {
  await navigateTo(resolvePostAuthTarget(route.query.redirect as string | undefined), { replace: true })
}
</script>

<template>
  <div class="midesk-auth-card">
    <div class="midesk-auth-card-header">
      <div class="midesk-auth-card-icon-wrap">
        <UIcon name="i-lucide-log-in" class="size-6 text-[var(--color-midesk-accent)]" />
      </div>
      <h1 class="midesk-auth-card-title">{{ t('auth.login') }}</h1>
      <p class="midesk-auth-card-subtitle">{{ t('auth.loginSubtitle') }}</p>
    </div>

    <div v-if="alreadyLoggedIn" class="midesk-auth-card-body space-y-4 text-center">
      <USkeleton v-if="sessionLoading" class="mx-auto size-14 rounded-2xl" />
      <UAvatar v-else :alt="authStore.user?.name ?? ''" size="xl" icon="i-lucide-user" class="mx-auto" />
      <p class="text-sm text-[var(--color-midesk-muted)]">{{ t('auth.alreadyLoggedIn') }}</p>
      <p class="text-lg font-semibold">{{ authStore.user?.name ?? '—' }}</p>
      <UButton block size="lg" color="primary" :loading="sessionLoading" @click="goToApp">
        {{ t('auth.continueToApp') }}
      </UButton>
      <UButton block size="lg" variant="outline" color="neutral" :disabled="sessionLoading" @click="logout">
        {{ t('auth.switchAccount') }}
      </UButton>
    </div>

    <div v-else class="midesk-auth-card-body">
      <div class="midesk-auth-mode-tabs">
        <button
          type="button"
          class="midesk-auth-mode-tab"
          :class="{ 'is-active': mode === 'password' }"
          @click="mode = 'password'"
        >
          <UIcon name="i-lucide-key-round" class="size-4" />
          {{ t('auth.loginWithPassword') }}
        </button>
        <button
          type="button"
          class="midesk-auth-mode-tab"
          :class="{ 'is-active': mode === 'otp' }"
          @click="mode = 'otp'"
        >
          <UIcon name="i-lucide-smartphone" class="size-4" />
          {{ t('auth.loginWithOtp') }}
        </button>
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
                icon="i-lucide-mail"
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
                icon="i-lucide-lock"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
              />
            </MideskFormField>
          </VeeField>

          <div class="midesk-auth-demo-hint">
            <UIcon name="i-lucide-sparkles" class="size-4 shrink-0 text-[var(--color-midesk-accent)]" />
            <span>{{ t('auth.demoHint') }}</span>
          </div>

          <UButton type="submit" block size="lg" :loading="loading" color="primary" class="midesk-auth-submit">
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
                icon="i-lucide-phone"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
              />
            </MideskFormField>
          </VeeField>
          <UButton type="submit" block size="lg" :loading="loading" color="primary" class="midesk-auth-submit">
            {{ t('auth.sendOtp') }}
          </UButton>
        </div>
      </VeeForm>

      <div class="midesk-auth-divider">
        <span>{{ t('auth.or') }}</span>
      </div>

      <UButton to="/register" block size="lg" variant="outline" color="neutral" class="midesk-auth-alt-cta">
        {{ t('auth.createFreeAccount') }}
      </UButton>
    </div>
  </div>
</template>

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
  <UCard class="midesk-glass midesk-form-card border-[var(--color-midesk-border)]">
    <template #header>
      <h1 class="text-xl font-semibold">{{ t('auth.login') }}</h1>
    </template>

    <div v-if="alreadyLoggedIn" class="space-y-4 text-center">
      <USkeleton v-if="sessionLoading" class="mx-auto size-12 rounded-full" />
      <UAvatar v-else :alt="authStore.user?.name ?? ''" size="lg" icon="i-lucide-user" class="mx-auto" />
      <p class="text-sm text-[var(--color-midesk-muted)]">{{ t('auth.alreadyLoggedIn') }}</p>
      <p class="font-medium">{{ authStore.user?.name ?? '—' }}</p>
      <UButton block color="primary" :loading="sessionLoading" @click="goToApp">
        {{ t('auth.continueToApp') }}
      </UButton>
      <UButton block variant="outline" color="neutral" :disabled="sessionLoading" @click="logout">
        {{ t('auth.switchAccount') }}
      </UButton>
    </div>

    <div v-else>
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

      <p class="mt-6 text-center text-sm text-[var(--color-midesk-muted)]">
        {{ t('auth.noAccount') }}
        <NuxtLink to="/register" class="midesk-link hover:underline">
          {{ t('auth.register') }}
        </NuxtLink>
      </p>
    </div>
  </UCard>
</template>

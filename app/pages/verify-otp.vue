<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { t } = useI18n()
const route = useRoute()
const { verifyOtp, loginOtp } = useAuth()
import { resolvePostAuthTarget } from '~/utils/auth-redirect'
const toast = useToast()
const loading = ref(false)
const resending = ref(false)
const countdown = ref(0)

const phone = computed(() => route.query.phone as string)

const schema = toTypedSchema(z.object({
  code: z.string().length(6)
}))

let timer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  countdown.value = 120
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) clearInterval(timer)
  }, 1000)
}

onMounted(startCountdown)
onUnmounted(() => { if (timer) clearInterval(timer) })

async function onResend() {
  if (!phone.value || resending.value) return
  resending.value = true
  try {
    await loginOtp({ phone: phone.value })
    toast.add({ title: t('auth.otpSent'), color: 'success' })
    if (timer) clearInterval(timer)
    startCountdown()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    resending.value = false
  }
}

async function onSubmit(values: { code: string }) {
  loading.value = true
  try {
    await verifyOtp({ phone: phone.value, code: values.code })
    await navigateTo(resolvePostAuthTarget(route.query.redirect as string | undefined), { replace: true })
  } catch (e: unknown) {
    const err = e as { data?: { details?: Record<string, string[]> } }
    toast.add({
      title: err.data?.details?.code?.[0] || t('common.error'),
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="midesk-glass midesk-form-card border-[var(--color-midesk-border)]">
    <template #header>
      <h1 class="text-xl font-semibold">{{ t('auth.verifyOtp') }}</h1>
      <p class="text-sm text-[var(--color-midesk-muted)]">{{ t('auth.otpSent') }}: {{ phone }}</p>
    </template>

    <VeeForm :validation-schema="schema" class="midesk-form-fields" @submit="onSubmit">
      <VeeField v-slot="{ field, errorMessage }" name="code">
        <MideskFormField
          :label="t('auth.otpCode')"
          :error="errorMessage"
          :model-value="field.value"
          field-class="midesk-ltr-field"
        >
          <UInput
            v-bind="field"
            maxlength="6"
            dir="ltr"
            placeholder=" "
            class="text-center tracking-widest"
          />
        </MideskFormField>
      </VeeField>
      <p class="mb-4 text-xs text-[var(--color-midesk-muted)]">Demo code: 123456</p>
      <UButton type="submit" block :loading="loading" color="primary">
        {{ t('auth.verifyOtp') }}
      </UButton>
    </VeeForm>

    <p class="mt-4 text-center text-sm text-[var(--color-midesk-muted)]">
      <span v-if="countdown > 0">{{ t('auth.resendIn', { seconds: countdown }) }}</span>
      <UButton v-else variant="link" size="sm" :loading="resending" @click="onResend">{{ t('auth.resend') }}</UButton>
    </p>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { t } = useI18n()
const { register } = useAuth()
const loading = ref(false)
const toast = useToast()

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
  <UCard class="midesk-glass midesk-form-card border-[var(--color-midesk-border)]">
    <template #header>
      <h1 class="text-xl font-semibold">{{ t('auth.register') }}</h1>
    </template>

    <VeeForm :validation-schema="schema" @submit="onSubmit">
      <div class="midesk-form-fields">
        <VeeField v-slot="{ field, errorMessage }" name="name">
          <MideskFormField :label="t('auth.name')" :error="errorMessage" :model-value="field.value">
            <UInput v-bind="field" placeholder=" " />
          </MideskFormField>
        </VeeField>
        <VeeField v-slot="{ field, errorMessage }" name="email">
          <MideskFormField
            :label="t('auth.email')"
            :error="errorMessage"
            :model-value="field.value"
            field-class="midesk-ltr-field"
          >
            <UInput v-bind="field" type="email" placeholder=" " />
          </MideskFormField>
        </VeeField>
        <VeeField v-slot="{ field, errorMessage }" name="phone">
          <MideskFormField
            :label="t('auth.phone')"
            :error="errorMessage"
            :model-value="field.value"
            field-class="midesk-ltr-field"
          >
            <UInput v-bind="field" dir="ltr" placeholder=" " />
          </MideskFormField>
        </VeeField>
        <VeeField v-slot="{ field, errorMessage }" name="password">
          <MideskFormField :label="t('auth.password')" :error="errorMessage" :model-value="field.value">
            <UInput v-bind="field" type="password" placeholder=" " />
          </MideskFormField>
        </VeeField>
        <UButton type="submit" block :loading="loading" color="primary">
          {{ t('auth.register') }}
        </UButton>
      </div>
    </VeeForm>

    <p class="mt-6 text-center text-sm text-[var(--color-midesk-muted)]">
      {{ t('auth.hasAccount') }}
      <NuxtLink to="/login" class="midesk-link hover:underline">
        {{ t('auth.login') }}
      </NuxtLink>
    </p>
  </UCard>
</template>

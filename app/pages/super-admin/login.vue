<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { isNavigationFailure } from 'vue-router'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const saStore = useSuperAdminStore()
const toast = useToast()

const loading = ref(false)

const schema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(1)
}))

async function onSubmit(values: { email: string, password: string }) {
  loading.value = true
  try {
    await saStore.login(values)
    await navigateTo('/super-admin/dashboard', { replace: true })
  } catch (e: unknown) {
    if (isNavigationFailure(e)) return
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="midesk-glass midesk-form-card border-[var(--color-midesk-border)]">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-shield" class="size-5 text-red-500" />
        <h1 class="text-xl font-semibold">{{ t('superAdmin.loginTitle') }}</h1>
      </div>
    </template>

    <VeeForm :validation-schema="schema" @submit="onSubmit">
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

   
     <!-- <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('superAdmin.demoHint') }}</p> -->
        <UButton type="submit" block :loading="loading" color="error">
          {{ t('auth.login') }}
        </UButton>
      </div>
    </VeeForm>
  </UCard>
</template>

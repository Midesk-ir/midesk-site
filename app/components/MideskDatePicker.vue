<script setup lang="ts">
import { DatePicker } from '@mahlaparvaz/vue-datepicker'
import {
  isoToPickerValue,
  pickerValueToIso,
  type PickerDateValue
} from '~/utils/datepicker-bridge'

const VAZIR_FONT = 'Vazirmatn, ui-sans-serif, sans-serif'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}>(), {
  modelValue: null,
  placeholder: undefined,
  disabled: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const { t } = useI18n()
const { calendarType } = useCalendar()

const isOpen = ref(false)
const pickerValue = ref<PickerDateValue>(null)

const pickerLocale = computed(() =>
  calendarType.value === 'jalali' ? 'jalali' : 'gregorian'
)

const placeholderText = computed(() =>
  props.placeholder ?? t('datepicker.placeholder')
)

const formattedDate = computed(() => {
  const value = pickerValue.value
  if (!value) return ''

  if (pickerLocale.value === 'jalali') {
    const { jy, jm, jd } = value
    if (jy == null || jm == null || jd == null) return ''
    return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`
  }

  const { year, month, day } = value
  if (year == null || month == null || day == null) return ''
  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
})

const mideskTheme = computed(() => ({
  colors: {
    primary: '#ff5c00',
    primaryLight: '#ff7a33',
    primaryLighter: '#ff994d',
    primaryLightest: 'rgba(255, 92, 0, 0.18)',
    primaryDark: '#e65200',
    gray: '#3a3a3a',
    grayLight: '#2e2e2e',
    grayLighter: '#1f1f1f',
    grayLightest: '#161616',
    textPrimary: '#ffffff',
    white: '#ffffff'
  },
  radius: {
    small: '6px',
    medium: '10px',
    large: '12px',
    xlarge: '14px'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px'
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    md: '14px',
    lg: '15px'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600'
  },
  dimensions: {
    width: '22.5rem',
    daySize: '2.375rem',
    buttonHeight: '2rem',
    weekdayHeight: '1.75rem'
  },
  grid: {
    gap: '6px',
    columnGap: '2px'
  },
  transitions: {
    duration: '0.18s',
    timing: 'ease-out'
  },
  range: {
    gradientStart: 'rgba(255, 92, 0, 0.22)',
    gradientEnd: 'rgba(255, 92, 0, 0.06)'
  },
  scrollbar: {
    width: '3px',
    thumbHeight: '40px',
    trackColor: 'rgba(255, 255, 255, 0.06)',
    thumbColor: 'rgba(255, 92, 0, 0.55)'
  }
}))

const fontConfig = {
  jalali: VAZIR_FONT,
  gregorian: VAZIR_FONT,
  hijri: VAZIR_FONT,
  chinese: VAZIR_FONT
}

function syncFromModel(iso: string | null | undefined) {
  pickerValue.value = isoToPickerValue(iso, pickerLocale.value)
}

watch(
  () => props.modelValue,
  value => syncFromModel(value),
  { immediate: true }
)

watch(pickerLocale, () => syncFromModel(props.modelValue))

watch(pickerLocale, (value) => {
  if (import.meta.client) {
    localStorage.setItem('datepicker_locale', value)
  }
}, { immediate: true })

function openPicker() {
  if (props.disabled) return
  syncFromModel(props.modelValue)
  isOpen.value = true
}

function closePicker() {
  isOpen.value = false
}

function togglePicker() {
  if (isOpen.value) closePicker()
  else openPicker()
}

function onConfirm(value: PickerDateValue) {
  pickerValue.value = value
  const iso = pickerValueToIso(value, pickerLocale.value)
  if (iso !== (props.modelValue?.slice(0, 10) ?? null)) {
    emit('update:modelValue', iso)
  }
  closePicker()
}

function clearDate(event: MouseEvent) {
  event.stopPropagation()
  pickerValue.value = null
  emit('update:modelValue', null)
}

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) closePicker()
}

onMounted(() => {
  window.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
  closePicker()
})
</script>

<template>
  <div class="midesk-datepicker-root">
    <div
      role="button"
      tabindex="0"
      class="midesk-date-trigger"
      :aria-expanded="isOpen"
      :class="{
        'midesk-date-trigger--sm': size === 'sm',
        'midesk-date-trigger--filled': !!formattedDate,
        'midesk-date-trigger--disabled': disabled
      }"
      @click="togglePicker"
      @keydown.enter.prevent="togglePicker"
      @keydown.space.prevent="togglePicker"
    >
      <span
        class="midesk-date-trigger__value"
        :class="{ 'midesk-date-trigger__placeholder': !formattedDate }"
      >
        {{ formattedDate || placeholderText }}
      </span>
      <div class="midesk-date-trigger__trailing">
        <button
          v-if="formattedDate && !disabled"
          type="button"
          class="midesk-date-trigger__clear"
          :aria-label="t('datepicker.clear')"
          @click="clearDate"
        >
          <UIcon name="i-lucide-x" class="size-3.5" />
        </button>
        <UIcon name="i-lucide-calendar-days" class="midesk-date-trigger__icon size-4" aria-hidden="true" />
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="datepicker__overlay midesk-datepicker-overlay"
        role="presentation"
        @mousedown.self.prevent="closePicker"
      >
        <div
          class="datepicker__overlay-content"
          role="dialog"
          aria-modal="true"
          @mousedown.stop
          @click.stop
        >
          <DatePicker
            v-model="pickerValue"
            :locale="pickerLocale"
            :enable-locale-selector="false"
            :available-locales="['jalali', 'gregorian']"
            :font-config="fontConfig"
            :theme="mideskTheme"
            @confirm="onConfirm"
            @close="closePicker"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

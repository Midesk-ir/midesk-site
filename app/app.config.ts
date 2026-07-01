export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'neutral'
    },
    formField: {
      slots: {
        root: 'w-full min-w-0',
        label: 'mb-1.5 block text-sm font-medium text-[var(--color-midesk-text)]',
        description: 'text-xs text-[var(--color-midesk-muted)]',
        hint: 'text-xs text-[var(--color-midesk-muted)]',
        error: 'mt-1.5 text-xs text-error',
        container: 'mt-0'
      }
    },
    input: {
      slots: {
        root: 'relative flex w-full min-w-0',
        base: [
          'rounded-lg bg-[var(--color-midesk-input-bg)] text-[var(--color-midesk-text)]',
          'ring-1 ring-inset ring-[var(--color-midesk-input-border)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-midesk-accent)]/60',
          'px-3 text-start text-sm',
          'placeholder:text-transparent'
        ].join(' ')
      },
      defaultVariants: {
        color: 'neutral',
        variant: 'outline'
      }
    },
    textarea: {
      slots: {
        root: 'relative flex w-full min-w-0',
        base: [
          'rounded-lg bg-[var(--color-midesk-input-bg)] text-[var(--color-midesk-text)]',
          'ring-1 ring-inset ring-[var(--color-midesk-input-border)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-midesk-accent)]/60',
          'px-3 text-start text-sm min-h-24',
          'placeholder:text-transparent'
        ].join(' ')
      },
      defaultVariants: {
        color: 'neutral',
        variant: 'outline'
      }
    },
    select: {
      slots: {
        base: [
          'w-full min-w-0 rounded-lg bg-[var(--color-midesk-input-bg)] text-[var(--color-midesk-text)]',
          'ring-1 ring-inset ring-[var(--color-midesk-input-border)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-midesk-accent)]/60',
          'px-3 ps-3 pe-9 text-start text-sm'
        ].join(' '),
        value: 'truncate text-start',
        placeholder: 'truncate text-start text-[var(--color-midesk-muted)]',
        trailing: 'absolute inset-y-0 end-0 flex items-center pe-2.5 pointer-events-none',
        trailingIcon: 'size-4 shrink-0 text-[var(--color-midesk-muted)]',
        content: 'z-[100] bg-[var(--color-midesk-card)] ring-1 ring-[var(--color-midesk-border)] text-start',
        viewport: 'p-1',
        item: 'rounded-md text-start justify-start gap-2',
        itemLabel: 'truncate text-start',
        itemWrapper: 'min-w-0 text-start'
      },
      defaultVariants: {
        color: 'neutral',
        variant: 'outline'
      }
    },
    selectMenu: {
      slots: {
        base: [
          'w-full min-w-0 rounded-lg bg-[var(--color-midesk-input-bg)] text-[var(--color-midesk-text)]',
          'ring-1 ring-inset ring-[var(--color-midesk-input-border)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-midesk-accent)]/60',
          'px-3 ps-3 pe-9 text-start text-sm'
        ].join(' '),
        value: 'truncate text-start',
        placeholder: 'truncate text-start text-[var(--color-midesk-muted)]',
        trailing: 'absolute inset-y-0 end-0 flex items-center pe-2.5',
        trailingIcon: 'size-4 shrink-0 text-[var(--color-midesk-muted)]',
        content: 'z-[100] bg-[var(--color-midesk-card)] ring-1 ring-[var(--color-midesk-border)] text-start',
        item: 'rounded-md text-start justify-start gap-2',
        itemLabel: 'truncate text-start'
      },
      defaultVariants: {
        color: 'neutral',
        variant: 'outline'
      }
    },
    badge: {
      slots: {
        base: 'font-semibold inline-flex items-center leading-normal tracking-normal',
        label: 'truncate'
      },
      variants: {
        size: {
          xs: {
            base: 'text-[11px] leading-4 px-1.5 py-0.5 gap-1 rounded-md',
            leadingIcon: 'size-3.5',
            trailingIcon: 'size-3.5'
          },
          sm: {
            base: 'text-xs leading-4 px-2 py-0.5 gap-1 rounded-md',
            leadingIcon: 'size-4',
            trailingIcon: 'size-4'
          },
          md: {
            base: 'text-sm leading-5 px-2.5 py-1 gap-1.5 rounded-md',
            leadingIcon: 'size-4',
            trailingIcon: 'size-4'
          },
          lg: {
            base: 'text-sm leading-5 px-3 py-1 gap-1.5 rounded-lg',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5'
          },
          xl: {
            base: 'text-base leading-6 px-3 py-1.5 gap-2 rounded-lg',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5'
          }
        }
      },
      compoundVariants: [
        {
          color: 'neutral',
          variant: 'subtle',
          class: 'bg-white/10 text-[var(--color-midesk-text)] ring ring-inset ring-white/12'
        },
        {
          color: 'primary',
          variant: 'subtle',
          class: 'bg-[var(--color-midesk-accent)]/15 text-[var(--color-midesk-accent)] ring ring-inset ring-[var(--color-midesk-accent)]/30'
        }
      ],
      defaultVariants: {
        size: 'sm',
        variant: 'subtle'
      }
    },
    card: {
      slots: {
        root: 'rounded-xl overflow-hidden',
        header: 'px-5 py-4 font-semibold text-[var(--color-midesk-text)] sm:px-6',
        body: 'px-5 py-5 sm:px-6',
        footer: 'px-5 py-4 sm:px-6'
      },
      variants: {
        variant: {
          outline: {
            root: 'divide-y divide-[var(--color-midesk-border)] bg-transparent ring-1 ring-[var(--color-midesk-border)]'
          }
        }
      }
    },
    tabs: {
      slots: {
        list: 'relative flex p-1 group w-full bg-white/[0.04] ring-1 ring-inset ring-[var(--color-midesk-border)] rounded-lg',
        indicator: 'absolute transition-[translate,width] duration-200 rounded-md bg-[var(--color-midesk-accent)] shadow-sm',
        trigger: [
          'inline-flex flex-row items-center justify-center gap-1.5',
          'rounded-md font-medium transition-colors',
          'data-[state=inactive]:text-[var(--color-midesk-muted)]',
          'hover:data-[state=inactive]:not-disabled:text-[var(--color-midesk-text)]',
          'hover:data-[state=inactive]:not-disabled:bg-white/[0.06]',
          'data-[state=active]:text-white',
          'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-midesk-accent)]/50'
        ].join(' '),
        label: 'truncate text-start',
        leadingIcon: 'shrink-0'
      },
      defaultVariants: {
        color: 'primary',
        variant: 'pill',
        size: 'md'
      }
    },
    button: {
      slots: {
        base: 'rounded-md font-medium inline-flex flex-row items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors',
        label: 'truncate text-start',
        leadingIcon: 'shrink-0',
        trailingIcon: 'shrink-0'
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'bg-[var(--color-midesk-accent)] text-white hover:bg-[color-mix(in_srgb,var(--color-midesk-accent)_88%,white)]'
        },
        {
          color: 'neutral',
          variant: 'outline',
          class: 'bg-[color-mix(in_srgb,var(--color-midesk-surface)_88%,transparent)] text-[var(--color-midesk-text)] ring-1 ring-inset ring-[var(--color-midesk-border)] hover:bg-white/[0.08]'
        },
        {
          color: 'primary',
          variant: 'soft',
          class: 'bg-[var(--color-midesk-accent-soft)] text-[var(--color-midesk-accent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-midesk-accent)_28%,transparent)]'
        },
        {
          color: 'neutral',
          variant: 'soft',
          class: 'bg-white/[0.06] text-[var(--color-midesk-text)] ring-1 ring-inset ring-white/10'
        }
      ]
    },
    dropdownMenu: {
      slots: {
        item: 'group relative w-full flex flex-row items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75',
        itemLabel: 'truncate text-start',
        itemWrapper: 'flex-1 flex flex-col text-start min-w-0'
      }
    }
  }
})

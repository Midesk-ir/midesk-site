import { apiFetch, createApiContext } from '~/utils/api-fetch'

export function useAuthenticatedDownload() {
  const { t } = useI18n()
  const toast = useToast()
  const getContext = createApiContext()
  const downloading = ref(false)

  async function download(path: string, filename: string) {
    downloading.value = true
    try {
      const blob = await apiFetch<Blob>(getContext(), path, { responseType: 'blob' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.add({ title: t('common.error'), color: 'error' })
    } finally {
      downloading.value = false
    }
  }

  return { download, downloading }
}

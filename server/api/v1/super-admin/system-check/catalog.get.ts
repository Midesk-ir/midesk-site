import { buildSystemCheckCatalog } from '../../../../utils/system-check-catalog'

export default defineEventHandler(() => {
  return { data: buildSystemCheckCatalog() }
})

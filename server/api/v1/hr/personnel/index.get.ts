import type { PersonnelFilters } from '../../../../../app/types/phase2'

export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:personnel:view')
  const query = getQuery(event)
  const filters: PersonnelFilters = {
    status: query.status as PersonnelFilters['status'],
    department: query.department as string,
    search: query.search as string
  }
  const data = db.phase2.listPersonnel(filters)
  const countOnly = query.count === 'true' || query.count === '1'
  if (countOnly) return { data: { count: data.filter(p => p.status === 'active').length } }
  return { data, meta: { total: data.length } }
})

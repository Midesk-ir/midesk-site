export default defineEventHandler((event) => {
  const { db } = requireSaAuth(event)
  const search = getQuery(event).search as string | undefined
  return { data: db.saListTenants(search) }
})

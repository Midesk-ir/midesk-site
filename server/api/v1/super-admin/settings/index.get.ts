export default defineEventHandler((event) => {
  const { db } = requireSaAuth(event)
  return { data: db.saGetSettings() }
})

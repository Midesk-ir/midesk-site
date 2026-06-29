export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const colId = getRouterParam(event, 'colId')!
  db.phase1.deleteColumn(colId)
  return { success: true }
})

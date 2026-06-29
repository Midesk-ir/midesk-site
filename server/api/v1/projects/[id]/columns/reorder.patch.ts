export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ ids: string[] }>(event)
  const columns = db.phase1.reorderColumns(id, body.ids)
  return { data: columns }
})

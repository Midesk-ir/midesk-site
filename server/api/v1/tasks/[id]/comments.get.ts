export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const taskId = getRouterParam(event, 'id')
  return { data: db.comments.get(taskId!) ?? [] }
})

import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')
  const task = db.tasks.find(t => t.id === id)
  if (!task) throw createError({ statusCode: 404, message: 'Not found' })

  const body = await readBody<{ title: string }>(event)
  const item = {
    id: randomUUID(),
    title: body.title,
    is_done: false,
    order_index: task.checklist.length + 1
  }
  task.checklist.push(item)
  return item
})

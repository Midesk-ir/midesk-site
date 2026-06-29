import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  const taskId = getRouterParam(event, 'id')
  const task = db.tasks.find(t => t.id === taskId)
  if (!task) throw createError({ statusCode: 404, message: 'Not found' })

  const body = await readBody<{ body: string }>(event)
  const comment = {
    id: randomUUID(),
    body: body.body,
    user: { id: user.id, name: user.name, avatar_url: user.avatar_url },
    created_at: new Date().toISOString()
  }

  const list = db.comments.get(taskId!) ?? []
  list.push(comment)
  db.comments.set(taskId!, list)
  task.comments_count++

  return comment
})

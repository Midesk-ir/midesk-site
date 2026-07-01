export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string, password?: string }>(event)
  const db = usePhase5Db()
  return db.saLogin(body.email ?? '', body.password ?? '')
})

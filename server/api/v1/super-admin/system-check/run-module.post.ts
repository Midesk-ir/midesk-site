import { runSystemCheckModule } from '../../../../utils/system-check-runner'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ module: string, credentials?: { email?: string, password?: string } }>(event)
  if (!body?.module) {
    throw createError({ statusCode: 400, statusMessage: 'module is required' })
  }

  const data = await runSystemCheckModule(event, body.module, body.credentials)
  return { data }
})

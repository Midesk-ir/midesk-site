import { runSystemCheckFlow } from '../../../../utils/system-check-runner'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ flowId: string, credentials?: { email?: string, password?: string } }>(event)
  if (!body?.flowId) {
    throw createError({ statusCode: 400, statusMessage: 'flowId is required' })
  }

  const data = await runSystemCheckFlow(event, body.flowId, body.credentials)
  return { data }
})

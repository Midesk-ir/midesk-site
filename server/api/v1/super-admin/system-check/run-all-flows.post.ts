import { runAllSystemCheckFlows } from '../../../../utils/system-check-runner'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ credentials?: { email?: string, password?: string } }>(event).catch(() => undefined)
  const data = await runAllSystemCheckFlows(event, body?.credentials)
  return { data }
})

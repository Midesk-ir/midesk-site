import { runSystemCheckProbe } from '../../../../utils/system-check-runner'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = await runSystemCheckProbe(event, body)
  return { data: result.result }
})

import { getSystemCheckHealth } from '../../../../utils/system-check-runner'

export default defineEventHandler((event) => getSystemCheckHealth(event))

export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'hr:recruitment:view')
  const id = getRouterParam(event, 'id')!
  const db = useMockDb()
  const candidate = db.phase2.listCandidates().find(c => c.id === id)
  if (!candidate?.resume_filename) {
    throw createError({ statusCode: 404, message: 'Resume not found' })
  }

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="${candidate.resume_filename}"`)

  return Buffer.from(`Mock resume file for ${candidate.full_name}`)
})

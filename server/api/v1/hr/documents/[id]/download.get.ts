export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:documents:view')
  const id = getRouterParam(event, 'id')!
  const doc = db.phase2.getDocument(id)
  if (!doc) throw createError({ statusCode: 404, message: 'Not found' })
  setHeader(event, 'Content-Disposition', `attachment; filename="${doc.filename}"`)
  setHeader(event, 'Content-Type', doc.mime_type)
  return `# Mock file: ${doc.filename}\nSize: ${doc.size_bytes} bytes`
})

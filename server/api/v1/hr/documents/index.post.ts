import type { DocumentCategory } from '../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:documents:manage')
  const form = await readMultipartFormData(event)
  if (!form) throw createError({ statusCode: 422, message: 'Invalid form data' })

  const getField = (name: string) => form.find(f => f.name === name)?.data?.toString()
  const file = form.find(f => f.name === 'file')

  const personnel_id = getField('personnel_id')
  const category = getField('category') as DocumentCategory
  if (!personnel_id || !category || !file) {
    throw createError({ statusCode: 422, message: 'Missing required fields' })
  }

  const doc = db.phase2.uploadDocument({
    personnel_id,
    category,
    filename: file.filename ?? 'document',
    size_bytes: file.data.length,
    mime_type: file.type ?? 'application/octet-stream'
  })
  return { data: doc }
})

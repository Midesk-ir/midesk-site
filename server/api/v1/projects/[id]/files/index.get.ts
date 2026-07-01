export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'files:view')
  const projectId = getRouterParam(event, 'id')!
  const folderId = getQuery(event).folder_id as string | undefined
  const db = useMockDb()
  const folders = db.phase5.listFolders(projectId)
  const files = db.phase5.listFiles(projectId, folderId === undefined ? undefined : folderId)
  return { data: { folders, files } }
})

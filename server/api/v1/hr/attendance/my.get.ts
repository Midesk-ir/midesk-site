export default defineEventHandler((event) => {
  const { db, user } = requireAuthWithPermission(event, ['hr:attendance:view', 'hr:attendance:clock'])
  const query = getQuery(event)
  const record = db.phase2.getUserTodayRecord(user.id)
  const history = db.phase2.getMyAttendance(
    user.id,
    query.from as string,
    query.to as string
  )
  return {
    data: {
      today: record ?? null,
      clock_status: db.phase2.getClockStatus(record),
      history
    }
  }
})

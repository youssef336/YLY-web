export type ActivityKind = 'report' | 'excuse' | 'points'

export interface Activity {
  id: string
  kind: ActivityKind
  date: string
  title: string
  detail: string
  points?: number
}

export interface Member {
  id: string
  name: string
  role: string
  avatar: string
  joinedAt: string
  activities: Activity[]
}

export type ActivityKind = 'report' | 'excuse' | 'points'
export type ActionStatus = 'Completed' | 'Excuse' | 'Void' | 'Bonus' | 'Penalty'

export interface Activity {
  id: string
  kind: ActivityKind
  actionStatus: ActionStatus
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
  isActive: boolean
  activities: Activity[]
}

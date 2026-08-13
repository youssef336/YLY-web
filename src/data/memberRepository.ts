import type { ActionStatus, Member } from '../domain/entities'
import type { MemberRepository } from '../domain/repositories'

const seed: Member[] = [
  { id: 'kirolos', name: 'Kirolos', role: 'Team Member', avatar: 'K', joinedAt: '2024-01-12', isActive: true, activities: [{ id: 'a1', kind: 'points', actionStatus: 'Else', date: '2024-06-20', title: 'Excellent client handoff', detail: 'Closed the weekly handoff with complete documentation.', points: 12 }] },
  { id: 'maryam', name: 'Maryam', role: 'Team Member', avatar: 'M', joinedAt: '2024-02-04', isActive: true, activities: [] },
  { id: 'basmala', name: 'Basmala', role: 'Team Member', avatar: 'B', joinedAt: '2024-03-18', isActive: true, activities: [] },
  { id: 'menna', name: 'Menna', role: 'Team Member', avatar: 'M', joinedAt: '2024-03-22', isActive: true, activities: [] }
]

export class LocalMemberRepository implements MemberRepository {
  private readonly key = 'team-pulse-members-v2'
  async getAll() {
    const members = JSON.parse(localStorage.getItem(this.key) ?? JSON.stringify(seed)) as Member[]
    return members.map(member => ({ ...member, isActive: member.isActive ?? true, activities: member.activities.map(activity => ({ ...activity, actionStatus: (activity.actionStatus === 'Excuse' ? 'Excuse' : activity.actionStatus === 'Completed' ? 'Completed' : 'Else') as ActionStatus })) }))
  }
  async save(member: Member) {
    const members = await this.getAll()
    const index = members.findIndex(item => item.id === member.id)
    if (index === -1) members.unshift(member); else members[index] = member
    localStorage.setItem(this.key, JSON.stringify(members))
  }
}

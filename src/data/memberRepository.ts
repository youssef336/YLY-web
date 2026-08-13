import type { Member } from '../domain/entities'
import type { MemberRepository } from '../domain/repositories'

const seed: Member[] = [
  { id: 'kirolos', name: 'Kirolos Hanna', role: 'Operations', avatar: 'KH', joinedAt: '2024-01-12', isActive: true, activities: [{ id: 'a1', kind: 'points', actionStatus: 'Bonus', date: '2024-06-20', title: 'Excellent client handoff', detail: 'Closed the weekly handoff with complete documentation.', points: 12 }, { id: 'a2', kind: 'report', actionStatus: 'Completed', date: '2024-06-19', title: 'Daily report submitted', detail: 'All operational tasks are on track.' }] },
  { id: 'ahmed', name: 'Ahmed Samir', role: 'Customer Success', avatar: 'AS', joinedAt: '2024-02-04', isActive: true, activities: [{ id: 'a3', kind: 'points', actionStatus: 'Bonus', date: '2024-06-20', title: 'Positive customer feedback', detail: 'Received excellent customer feedback.', points: 8 }, { id: 'a4', kind: 'excuse', actionStatus: 'Excuse', date: '2024-06-18', title: 'Late arrival', detail: 'Traffic disruption due to road closure.', points: -3 }] },
  { id: 'sara', name: 'Sara Adel', role: 'Design', avatar: 'SA', joinedAt: '2024-03-18', isActive: true, activities: [{ id: 'a5', kind: 'points', actionStatus: 'Bonus', date: '2024-06-20', title: 'Project delivery', detail: 'Delivered the new design system ahead of schedule.', points: 15 }] },
  { id: 'youssef', name: 'Youssef Khaled', role: 'Engineering', avatar: 'YK', joinedAt: '2024-03-22', isActive: true, activities: [{ id: 'a6', kind: 'points', actionStatus: 'Completed', date: '2024-06-17', title: 'Production fix', detail: 'Resolved a critical production issue.', points: 6 }] }
]

export class LocalMemberRepository implements MemberRepository {
  private readonly key = 'team-pulse-members'
  async getAll() {
    const members = JSON.parse(localStorage.getItem(this.key) ?? JSON.stringify(seed)) as Member[]
    return members.map(member => ({ ...member, isActive: member.isActive ?? true, activities: member.activities.map(activity => ({ ...activity, actionStatus: activity.actionStatus ?? (activity.kind === 'excuse' ? 'Excuse' : activity.kind === 'report' ? 'Completed' : (activity.points ?? 0) < 0 ? 'Penalty' : 'Bonus') })) }))
  }
  async save(member: Member) {
    const members = await this.getAll()
    const index = members.findIndex(item => item.id === member.id)
    if (index === -1) members.unshift(member); else members[index] = member
    localStorage.setItem(this.key, JSON.stringify(members))
  }
}

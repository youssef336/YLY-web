import type { Activity, Member } from './entities'
import type { MemberRepository } from './repositories'

export const totalPoints = (member: Member) => member.activities.reduce((total, item) => total + (item.points ?? 0), 0)
export const performanceRate = (member: Member) => Math.min(10, Math.max(0, Math.round(5 + totalPoints(member) / 4)))

export class TeamUseCases {
  constructor(private readonly repository: MemberRepository) {}

  getMembers = () => this.repository.getAll()

  async addMember(name: string) {
    const member: Member = { id: crypto.randomUUID(), name, role: 'Team Member', avatar: name.slice(0, 2).toUpperCase(), joinedAt: new Date().toISOString(), isActive: true, activities: [] }
    await this.repository.save(member)
    return member
  }

  async addActivity(member: Member, activity: Omit<Activity, 'id'>) {
    const updated = { ...member, activities: [{ ...activity, id: crypto.randomUUID() }, ...member.activities] }
    await this.repository.save(updated)
    return updated
  }

  async updateActivity(member: Member, activity: Activity) {
    const updated = { ...member, activities: member.activities.map(current => current.id === activity.id ? activity : current) }
    await this.repository.save(updated)
    return updated
  }

  async deleteActivity(member: Member, activityId: string) {
    const updated = { ...member, activities: member.activities.filter(activity => activity.id !== activityId) }
    await this.repository.save(updated)
    return updated
  }

  async deactivateMember(member: Member) {
    const updated = { ...member, isActive: false }
    await this.repository.save(updated)
    return updated
  }
}

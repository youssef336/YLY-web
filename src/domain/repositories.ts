import type { Member } from './entities'

export interface MemberRepository {
  getAll(): Promise<Member[]>
  save(member: Member): Promise<void>
}

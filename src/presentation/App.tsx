import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import type { Member } from '../domain/entities'
import { performanceRate, TeamUseCases, totalPoints } from '../domain/useCases'
import { LocalMemberRepository } from '../data/memberRepository'
import './styles.css'

const useCases = new TeamUseCases(new LocalMemberRepository())

const Icon = ({ name }: { name: string }) => <span className="icon" aria-hidden="true">{name}</span>
const rateTone = (rate: number) => rate >= 8 ? 'great' : rate >= 6 ? 'good' : 'low'

export default function App() {
  const [members, setMembers] = useState<Member[]>([])
  const [selected, setSelected] = useState<Member | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => { useCases.getMembers().then(setMembers) }, [])
  const replaceMember = (next: Member) => { setMembers(current => current.map(item => item.id === next.id ? next : item)); setSelected(next) }

  const addMember = async (name: string) => { const member = await useCases.addMember(name); setMembers(current => [member, ...current]); setAddOpen(false) }
  const exportExcel = () => {
    const rows = members.flatMap<Record<string, string | number>>(member => member.activities.length ? member.activities.map(activity => ({ Member: member.name, Role: member.role, Rate: `${performanceRate(member)}/10`, 'Total points': totalPoints(member), Date: new Date(activity.date).toLocaleDateString(), Type: activity.kind, Entry: activity.title, Details: activity.detail, 'Point change': activity.points ?? 0 })) : [{ Member: member.name, Role: member.role, Rate: `${performanceRate(member)}/10`, 'Total points': totalPoints(member), Date: '', Type: '', Entry: '', Details: '', 'Point change': '' }])
    const sheet = XLSX.utils.json_to_sheet(rows)
    const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, sheet, 'Team Evaluation')
    XLSX.writeFile(book, `team-evaluation-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }
  const sendLeaderReport = () => {
    const lines = members.map(member => `• ${member.name}: ${performanceRate(member)}/10 (${totalPoints(member)} pts)`).join('\n')
    const message = `Team Pulse evaluation\n${new Date().toLocaleDateString()}\n\n${lines}\n\nShared with you by Team Pulse.`
    window.open(`https://wa.me/201100572740?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  if (selected) return <MemberProfile member={selected} onBack={() => setSelected(null)} onUpdate={replaceMember} />

  const average = members.length ? (members.reduce((sum, member) => sum + performanceRate(member), 0) / members.length).toFixed(1) : '0'
  return <main className="shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">P</span><span>pulse<span>hq</span></span></div><nav><a className="active"><Icon name="▦" />Overview</a><a><Icon name="◉" />My team <b>{members.length}</b></a><a><Icon name="◷" />Activity</a></nav><div className="sidebar-bottom"><a><Icon name="⚙" />Settings</a><div className="user"><span className="avatar violet">M</span><div><strong>Manager</strong><small>Team lead</small></div><span>⌄</span></div></div></aside>
    <section className="content"><header><div><p className="eyebrow">TEAM MANAGEMENT</p><h1>Your team, at a glance.</h1><p className="subhead">Track performance, celebrate progress, and keep every conversation moving.</p></div><div className="header-actions"><button className="button ghost" onClick={exportExcel}><Icon name="↓" />Export</button><button className="button dark" onClick={() => setAddOpen(true)}><Icon name="+" />Add member</button></div></header>
      <section className="metrics"><Metric icon="◉" label="Team members" value={String(members.length)} note="Active this month" /><Metric icon="↗" label="Team average" value={`${average}/10`} note="Performance rate" /><Metric icon="✦" label="Total points" value={String(members.reduce((sum, member) => sum + totalPoints(member), 0))} note="Across your team" /></section>
      <div className="section-heading"><div><h2>Team members</h2><p>Click a member to view their profile and activity.</p></div><button className="leader-button" onClick={sendLeaderReport}><span className="whatsapp">◔</span> Send to Malak <span>↗</span></button></div>
      <section className="member-grid">{members.map(member => <MemberCard key={member.id} member={member} onClick={() => setSelected(member)} />)}</section>
    </section>
    {addOpen && <AddMemberModal onClose={() => setAddOpen(false)} onAdd={addMember} />}
  </main>
}

function Metric({ icon, label, value, note }: { icon: string; label: string; value: string; note: string }) { return <div className="metric"><div className="metric-icon"><Icon name={icon} /></div><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></div> }
function MemberCard({ member, onClick }: { member: Member; onClick: () => void }) { const rate = performanceRate(member); return <button className="member-card" onClick={onClick}><div className="member-top"><span className={`avatar avatar-${member.id}`}>{member.avatar}</span><span className="more">•••</span></div><h3>{member.name}</h3><p>{member.role}</p><div className="rate-row"><span>Performance rate</span><strong className={rateTone(rate)}>{rate}/10</strong></div><div className="progress"><i style={{ width: `${rate * 10}%` }} className={rateTone(rate)} /></div><div className="card-footer"><span><b>{totalPoints(member)}</b> points</span><span>{member.activities.length} updates <b>→</b></span></div></button> }

function AddMemberModal({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string) => void }) { const [name, setName] = useState(''); return <div className="modal-backdrop"><form className="modal" onSubmit={event => { event.preventDefault(); if (name.trim()) onAdd(name.trim()) }}><button type="button" className="close" onClick={onClose}>×</button><p className="eyebrow">NEW TEAM MEMBER</p><h2>Add a person to your team</h2><label>Full name<input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Kirolos Hanna" /></label><button className="button dark wide">Add member <span>→</span></button></form></div> }

function MemberProfile({ member, onBack, onUpdate }: { member: Member; onBack: () => void; onUpdate: (member: Member) => void }) {
  const [type, setType] = useState<'report' | 'excuse' | 'points'>('report'); const [title, setTitle] = useState(''); const [detail, setDetail] = useState(''); const [points, setPoints] = useState('3')
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (!title.trim()) return; const updated = await useCases.addActivity(member, { kind: type, title: title.trim(), detail: detail.trim(), points: type === 'points' || type === 'excuse' ? Number(points) : undefined }); onUpdate(updated); setTitle(''); setDetail(''); setPoints('3') }
  const rate = performanceRate(member)
  return <main className="profile-page"><button className="back" onClick={onBack}>← <span>Back to team</span></button><section className="profile-hero"><span className={`avatar large avatar-${member.id}`}>{member.avatar}</span><div><p className="eyebrow">MEMBER PROFILE</p><h1>{member.name}</h1><p>{member.role} <i /> Team member since {new Date(member.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p></div><div className="profile-score"><span>Performance rate</span><strong className={rateTone(rate)}>{rate}<small>/10</small></strong><em>{totalPoints(member)} total points</em></div></section><section className="profile-layout"><div className="activity-panel"><div className="section-heading"><div><h2>Activity log</h2><p>A complete record of updates and recognition.</p></div></div><div className="timeline">{member.activities.length ? member.activities.map(item => <article key={item.id} className="activity"><span className={`activity-dot ${item.kind}`}>{item.kind === 'report' ? '≡' : item.kind === 'excuse' ? '!' : item.points && item.points > 0 ? '+' : '−'}</span><div><div className="activity-title"><h3>{item.title}</h3>{item.points !== undefined && <b className={item.points >= 0 ? 'positive' : 'negative'}>{item.points >= 0 ? '+' : ''}{item.points} pts</b>}</div><p>{item.detail}</p><time>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time></div></article>) : <p className="empty">No activity recorded yet.</p>}</div></div><form className="log-form" onSubmit={submit}><p className="eyebrow">NEW UPDATE</p><h2>Log an update</h2><div className="type-tabs">{(['report', 'excuse', 'points'] as const).map(item => <button type="button" className={type === item ? 'selected' : ''} onClick={() => { setType(item); if (item === 'excuse' && Number(points) > 0) setPoints('-3') }}>{item === 'report' ? 'Report' : item === 'excuse' ? 'Excuse' : 'Points'}</button>)}</div><label>{type === 'excuse' ? 'Excuse reason' : type === 'points' ? 'Recognition or feedback' : 'Report title'}<input value={title} onChange={event => setTitle(event.target.value)} placeholder={type === 'excuse' ? 'What happened?' : 'Give this update a title'} /></label><label>Details<textarea value={detail} onChange={event => setDetail(event.target.value)} placeholder="Add useful context..." rows={4} /></label>{type !== 'report' && <label>Point change<input type="number" value={points} onChange={event => setPoints(event.target.value)} /></label>}<button className="button dark wide">Save update <span>→</span></button></form></section></main>
}

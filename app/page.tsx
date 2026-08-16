'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  LayoutDashboard, Users, FileText, ClipboardList, Ruler, Factory, Boxes,
  CalendarDays, WalletCards, Bot, Settings, Bell, Search, LogOut, Plus,
  ArrowUpRight, Clock3, AlertTriangle, CheckCircle2, Menu, X
} from 'lucide-react';

type Org = { id: string; name: string; slug: string; plan: string };
type Counts = { leads: number; customers: number; quotes: number; production: number; materials: number; tasks: number };

const emptyCounts: Counts = { leads: 0, customers: 0, quotes: 0, production: 0, materials: 0, tasks: 0 };

const nav = [
  ['Dashboard', LayoutDashboard], ['CRM & Leads', Users], ['Orçamentos', FileText],
  ['Pedidos', ClipboardList], ['Desenho Técnico', Ruler], ['Produção', Factory],
  ['Estoque & Materiais', Boxes], ['Instalações', CalendarDays], ['Financeiro', WalletCards],
  ['Agentes', Bot], ['Configurações', Settings],
] as const;

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [org, setOrg] = useState<Org | null>(null);
  const [counts, setCounts] = useState<Counts>(emptyCounts);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('Dashboard');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !supabase) { setLoading(false); return; }
    loadWorkspace();
  }, [session]);

  async function loadWorkspace() {
    if (!supabase || !session) return;
    setLoading(true);
    const { data: members, error } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', session.user.id);
    if (error) { setMessage(error.message); setLoading(false); return; }
    const ids = (members ?? []).map((m: any) => m.organization_id);
    if (!ids.length) { setOrgs([]); setLoading(false); return; }
    const { data: organizations } = await supabase.from('organizations').select('id,name,slug,plan').in('id', ids).order('name');
    const list = (organizations ?? []) as Org[];
    setOrgs(list);
    const saved = localStorage.getItem('marmopro_org');
    const selected = list.find(o => o.id === saved) ?? list[0] ?? null;
    setOrg(selected);
    if (selected) localStorage.setItem('marmopro_org', selected.id);
    if (selected) await loadCounts(selected.id);
    setLoading(false);
  }

  async function loadCounts(orgId: string) {
    if (!supabase) return;
    const count = async (table: string, filter?: [string, any]) => {
      let q = supabase.from(table).select('*', { count: 'exact', head: true });
      if (filter) q = q.eq(filter[0], filter[1]);
      const { count } = await q;
      return count ?? 0;
    };
    const [leads, customers, quotes, production, materials, tasks] = await Promise.all([
      count('leads', ['organization_id', orgId]),
      count('customers', ['organization_id', orgId]),
      count('quotes'),
      count('production_orders', ['organization_id', orgId]),
      count('materials', ['organization_id', orgId]),
      count('tasks', ['organization_id', orgId]),
    ]);
    setCounts({ leads, customers, quotes, production, materials, tasks });
  }

  async function authenticate(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setAuthError('');
    const result = authMode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (result.error) setAuthError(result.error.message);
    else if (authMode === 'signup') setAuthError('Conta criada. Se a confirmação de e-mail estiver ativa, confirme seu e-mail e entre novamente.');
  }

  async function signOut() { await supabase?.auth.signOut(); setSession(null); setOrg(null); }

  const cards = useMemo(() => [
    { label: 'Leads ativos', value: counts.leads, icon: Users, href: 'CRM & Leads', tone: 'neutral' },
    { label: 'Clientes', value: counts.customers, icon: Users, href: 'CRM & Leads', tone: 'neutral' },
    { label: 'Orçamentos', value: counts.quotes, icon: FileText, href: 'Orçamentos', tone: 'dark' },
    { label: 'Ordens de produção', value: counts.production, icon: Factory, href: 'Produção', tone: 'neutral' },
  ], [counts]);

  if (!isSupabaseConfigured()) return <SetupScreen />;
  if (!session) return <LoginScreen email={email} setEmail={setEmail} password={password} setPassword={setPassword} mode={authMode} setMode={setAuthMode} error={authError} onSubmit={authenticate} />;

  return (
    <div className="shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand"><div className="brand-mark">M</div><div><strong>MarmoPro</strong><span>GESTÃO DE MARMORARIAS</span></div><button className="close-mobile" onClick={() => setMobileOpen(false)}><X size={18}/></button></div>
        <div className="workspace-label">PLATAFORMA</div>
        <nav>{nav.map(([label, Icon]) => <button key={label} className={active === label ? 'active' : ''} onClick={() => { setActive(label); setMobileOpen(false); }}><Icon size={17}/><span>{label}</span></button>)}</nav>
        <div className="sidebar-bottom"><div className="org-mini"><div className="avatar">{(org?.name || 'M').slice(0,1).toUpperCase()}</div><div><b>{org?.name || 'Sem empresa'}</b><small>{org?.plan || 'Plano'}</small></div></div><button className="logout" onClick={signOut}><LogOut size={16}/><span>Sair</span></button></div>
      </aside>
      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} />}
      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={20}/></button>
          <div className="page-title"><div className="eyebrow">{org?.name || 'MarmoPro'}</div><h1>{active}</h1></div>
          <div className="top-actions"><div className="search"><Search size={16}/><input placeholder="Buscar no MarmoPro..." /></div><button className="icon-button"><Bell size={18}/><i /></button><div className="user-chip">{session.user.email?.slice(0,1).toUpperCase()}</div></div>
        </header>

        {active === 'Dashboard' ? <Dashboard cards={cards} org={org} loading={loading} onRefresh={() => org && loadCounts(org.id)} /> : <ModulePlaceholder active={active} counts={counts} />}
      </main>
    </div>
  );
}

function Dashboard({ cards, org, loading, onRefresh }: { cards: any[]; org: Org | null; loading: boolean; onRefresh: () => void }) {
  return <div className="content">
    <section className="hero"><div><div className="eyebrow">CENTRO OPERACIONAL</div><h2>Bom dia. Vamos colocar a operação em ordem.</h2><p>Clientes, vendas, produção e instalação conectados no mesmo fluxo.</p></div><div className="hero-actions"><button className="btn ghost" onClick={onRefresh}><Clock3 size={15}/> Atualizar</button><button className="btn primary"><Plus size={16}/> Novo orçamento</button></div></section>
    <section className="stats">{cards.map(card => { const Icon = card.icon; return <button className={`stat ${card.tone}`} key={card.label} onClick={() => {}}><div className="stat-top"><span>{card.label}</span><Icon size={18}/></div><strong>{loading ? '—' : card.value}</strong><small><ArrowUpRight size={13}/> Dados reais do workspace</small></button>})}</section>
    <section className="grid-2"><div className="panel"><div className="panel-head"><div><span className="eyebrow">FLUXO</span><h3>Operação da marmoraria</h3></div><span className="live"><i/> conectado</span></div><div className="flow">{['Lead / Cliente','Orçamento','Pedido','Desenho','Produção','Instalação'].map((x,i)=><div className="flow-item" key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b>{i < 5 && <ArrowUpRight size={14}/>}</div>)}</div></div><div className="panel"><div className="panel-head"><div><span className="eyebrow">ATENÇÃO</span><h3>Pontos de controle</h3></div></div><div className="checks"><div><AlertTriangle size={17}/><span>Produções atrasadas</span><b>0</b></div><div><Clock3 size={17}/><span>Tarefas pendentes</span><b>{loading ? '—' : 'ver'}</b></div><div><Boxes size={17}/><span>Estoque crítico</span><b>ver</b></div><div><CheckCircle2 size={17}/><span>Instalações hoje</span><b>ver</b></div></div></div></section>
    <section className="panel roadmap"><div><span className="eyebrow">PRÓXIMA FASE</span><h3>O núcleo já está preparado para crescer</h3><p>A base atual usa empresa, membros, CRM, orçamentos, produção, materiais, tarefas, auditoria e agentes no mesmo banco.</p></div><div className="roadmap-tags"><span>Multiempresa</span><span>RLS</span><span>Dados persistentes</span><span>Agentes</span></div></section>
  </div>;
}

function ModulePlaceholder({ active, counts }: { active: string; counts: Counts }) {
  const descriptions: Record<string,string> = {
    'CRM & Leads': 'Clientes e funil comercial conectados ao workspace.', 'Orçamentos': 'Orçamentos e itens persistidos no banco.',
    'Pedidos': 'Pedidos serão derivados do orçamento aprovado.', 'Desenho Técnico': 'Módulo técnico preparado para versões e aprovação.',
    'Produção': `${counts.production} ordens de produção no workspace.`, 'Estoque & Materiais': `${counts.materials} materiais cadastrados.`,
    'Instalações': 'Agenda operacional de instalação.', 'Financeiro': 'Contas, parcelas e recebimentos conectados ao comercial.',
    'Agentes': 'Agentes especializados por empresa e regras internas.', 'Configurações': 'Identidade visual, documentos, preços e regras da empresa.'
  };
  return <div className="content"><section className="module-header"><div><span className="eyebrow">MÓDULO</span><h2>{active}</h2><p>{descriptions[active] || 'Módulo MarmoPro.'}</p></div><button className="btn primary"><Plus size={16}/> Novo</button></section><div className="panel empty-module"><div className="module-icon"><LayoutDashboard size={22}/></div><h3>Núcleo conectado</h3><p>A interface deste módulo será construída sobre a mesma base multiempresa, mantendo os dados ligados ao cliente, orçamento, pedido e produção.</p></div></div>;
}

function LoginScreen({ email, setEmail, password, setPassword, mode, setMode, error, onSubmit }: any) {
  return <div className="auth-page"><div className="auth-card"><div className="brand auth-brand"><div className="brand-mark">M</div><div><strong>MarmoPro</strong><span>GESTÃO DE MARMORARIAS</span></div></div><div className="eyebrow">ACESSO À PLATAFORMA</div><h1>{mode === 'login' ? 'Entrar no MarmoPro' : 'Criar acesso'}</h1><p>Seu ambiente de gestão, operação e automação.</p><form onSubmit={onSubmit}><label>E-mail<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@empresa.com"/></label><label>Senha<input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/></label>{error && <div className="auth-error">{error}</div>}<button className="btn primary full">{mode === 'login' ? 'Entrar' : 'Criar conta'}</button></form><button className="switch-auth" onClick={()=>setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Ainda não tenho acesso' : 'Já tenho uma conta'}</button></div></div>;
}

function SetupScreen() { return <div className="auth-page"><div className="auth-card"><div className="brand auth-brand"><div className="brand-mark">M</div><div><strong>MarmoPro</strong><span>GESTÃO DE MARMORARIAS</span></div></div><div className="eyebrow">CONFIGURAÇÃO</div><h1>Conecte o banco do MarmoPro</h1><p>Defina <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> no ambiente de produção.</p><div className="setup-note">A estrutura do banco multiempresa já existe no projeto Supabase conectado ao núcleo, com RLS para isolamento entre organizações.</div></div></div>; }

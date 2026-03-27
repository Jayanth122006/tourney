import { useState, useEffect } from 'react';
import { 
    Users, Sword, RefreshCw, Trophy, ShieldAlert, Lock, Save, 
    Trash2, Copy, Check, LayoutDashboard, MessageSquare, 
    Settings, LogOut, Search, UserCheck, AlertCircle, Clock
} from 'lucide-react';
import '../styles/forms.css';

/**
 * Adam Portal - Supreme Version
 * Ultra-premium tournament director interface.
 */
const Adam = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pinEntry, setPinEntry] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    
    // Global States
    const [confirmAction, setConfirmAction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);

    // Data Buffers
    const [squads, setSquads] = useState([]);
    const [matches, setMatches] = useState([]);
    const [queries, setQueries] = useState([]);
    const [config, setConfig] = useState({ registration_open: 'true' });
    
    // UI Interaction
    const [searchQuery, setSearchQuery] = useState('');
    const [justCopiedId, setJustCopiedId] = useState(null);

    // Security Verification: PIN Required on Refresh (User Request "direct access")
    useEffect(() => {
        // We explicitly do NOT auto-login here to satisfy the security requirement.
    }, []);

    useEffect(() => {
        if (isAuthenticated) syncTerminalData();
    }, [isAuthenticated]);

    const syncTerminalData = async () => {
        if (syncing) return;
        setSyncing(true);
        try {
            const fetchWrap = (url) => fetch(url).then(r => r.ok ? r.json() : []).catch(() => []);
            const [s, m, q, c] = await Promise.all([
                fetchWrap('http://localhost:8081/api/squads'),
                fetchWrap('http://localhost:8081/api/matches'),
                fetchWrap('http://localhost:8081/api/support'),
                fetch('http://localhost:8081/api/admin/registration-status').then(r => r.json()).catch(() => ({ status: 'true' }))
            ]);
            setSquads(s);
            setMatches(m);
            setQueries(q);
            setConfig({ registration_open: c.status });
        } finally {
            setSyncing(false);
        }
    };

    const handleDoorAccess = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8081/api/admin/verify-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: pinEntry })
            });
            const data = await res.json();
            if (data.success) {
                setIsAuthenticated(true);
            } else {
                alert(data.message || 'Access Denied.');
                setPinEntry('');
            }
        } catch (err) {
            alert('Security System Offline.');
        }
    };

    const handleTerminalLock = () => {
        setIsAuthenticated(false);
        setPinEntry('');
    };

    // --- Admin Handlers ---

    const togglePortalGate = async () => {
        const next = config.registration_open === 'true' ? 'false' : 'true';
        try {
            const res = await fetch('http://localhost:8081/api/admin/registration-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: next })
            });
            if (res.ok) setConfig({ registration_open: next });
        } catch (e) { alert('Gate Control Failure.'); }
    };

    const updatePaymentStatus = async (id, status) => {
        try {
            const res = await fetch(`http://localhost:8081/api/admin/squads/${id}/payment`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) syncTerminalData();
        } catch (e) { alert('Payment Update Failed.'); }
    };

    const deleteMatchPair = (id) => {
        setConfirmAction({
            message: "Are you sure you want to delete this match pairing?",
            onConfirm: async () => {
                await fetch(`http://localhost:8081/api/matches/${id}`, { method: 'DELETE' });
                setMatches(prev => prev.filter(m => m.id !== id));
            }
        });
    };

    const resolveQuery = async (id) => {
        const res = await fetch(`http://localhost:8081/api/support/${id}/resolve`, { method: 'PUT' });
        if (res.ok) syncTerminalData();
    };

    const deleteQuery = (id) => {
        setConfirmAction({
            message: "Are you sure you want to permanently delete this support ticket?",
            onConfirm: async () => {
                await fetch(`http://localhost:8081/api/support/${id}`, { method: 'DELETE' });
                syncTerminalData();
            }
        });
    };

    const generateMatches = () => {
        setConfirmAction({
            message: "Generate new matches? This will overwrite all existing matches.",
            onConfirm: async () => {
                setLoading(true);
                await fetch('http://localhost:8081/api/matches/generate', { method: 'POST' });
                await syncTerminalData();
                setLoading(false);
            }
        });
    };

    const systemPurge = () => {
        setConfirmAction({
            message: "FACTORY RESET: This will wipe all teams, matches, and support tickets from the database.",
            onConfirm: async () => {
                const check = window.prompt('Type "DELETE" to confirm factory reset:');
                if (check !== 'DELETE') return;
                setLoading(true);
                await fetch('http://localhost:8081/api/admin/reset', { method: 'DELETE' });
                await syncTerminalData();
                setLoading(false);
                setActiveTab('overview');
            }
        });
    };

    // --- Components ---

    const SideNavItem = ({ id, label, icon, badge }) => (
        <button 
            className={`nav-btn-tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
        >
            <span style={{ opacity: activeTab === id ? 1 : 0.6 }}>{icon}</span>
            <span style={{ fontSize: '0.9rem', letterSpacing: '0.3px' }}>{label}</span>
            {badge > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--danger)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px' }}>
                    {badge}
                </span>
            )}
            {activeTab === id && <div style={{ position: 'absolute', left: 0, width: '3px', height: '20px', background: 'var(--primary)', borderRadius: '0 4px 4px 0' }} />}
        </button>
    );

    const MetricCard = ({ label, value, color, icon }) => (
        <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ padding: '10px', background: `${color}15`, borderRadius: '12px', color }}>{icon}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>{value}</div>
            <div style={{ width: '40px', height: '3px', background: color, marginTop: '15px', borderRadius: '10px', opacity: 0.5 }} />
        </div>
    );

    if (!isAuthenticated) {
        return (
            <div className="app-wrapper animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel-heavy" style={{ padding: '60px 45px', width: '100%', maxWidth: '420px', textAlign: 'center', borderRadius: '32px' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Lock size={32} color="var(--primary)" />
                    </div>
                    <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Admin Login</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '40px' }}>Enter your security PIN</p>
                    <form onSubmit={handleDoorAccess}>
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="ENTER PIN" 
                            value={pinEntry}
                            onChange={e => setPinEntry(e.target.value)}
                            style={{ textAlign: 'center', fontSize: '1.8rem', letterSpacing: '12px', borderRadius: '16px', background: '#000', height: '70px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.1)' }}
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary w-full" style={{ height: '60px', borderRadius: '16px' }}>LOGIN TO DASHBOARD</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="app-wrapper animate-fade-in" style={{ display: 'flex' }}>
            {confirmAction && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel-heavy" style={{ maxWidth: '440px', width: '100%', padding: '40px', textAlign: 'center', borderRadius: '28px' }}>
                        <ShieldAlert size={48} color="var(--danger)" style={{ marginBottom: '25px' }} />
                        <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>Terminal Confirmation</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '35px', lineHeight: '1.6' }}>{confirmAction.message}</p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setConfirmAction(null)}>Abort</button>
                            <button className="btn btn-primary" style={{ flex: 1, background: 'var(--danger)' }} onClick={() => { confirmAction.onConfirm(); setConfirmAction(null); }}>Proceed</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Supreme Sidebar */}
            <aside style={{ width: '280px', position: 'fixed', height: '100vh', padding: '40px 24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-glass)', background: 'rgba(5, 5, 8, 0.4)', backdropFilter: 'blur(40px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '50px', padding: '0 10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trophy size={20} color="#fff" />
                    </div>
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '0.5px' }}>ADMIN</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: '900', textTransform: 'uppercase' }}>Dashboard</div>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <SideNavItem id="overview" label="Dashboard" icon={<LayoutDashboard size={18} />} />
                    <SideNavItem id="squads" label="Teams" icon={<Users size={18} />} />
                    <SideNavItem id="matches" label="Matches" icon={<Sword size={18} />} />
                    <SideNavItem id="support" label="Support" icon={<MessageSquare size={18} />} badge={queries.filter(q => q.status === 'PENDING').length} />
                    <SideNavItem id="settings" label="Settings" icon={<Settings size={18} />} />
                </div>

                <button onClick={handleTerminalLock} className="btn btn-outline hover-danger" style={{ width: '100%', border: 'none', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '14px' }}>
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* Main Portal View */}
            <main style={{ marginLeft: '280px', flex: 1, padding: '50px 60px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
                    <div>
                        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                            {activeTab === 'overview' ? 'Admin Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Active User: Admin</p>
                    </div>
                    <button className="btn btn-outline" onClick={syncTerminalData} disabled={syncing}>
                        <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} /> Refresh Data
                    </button>
                </header>

                <div key={activeTab}>
                    {activeTab === 'overview' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                                <MetricCard label="Squads" value={squads.length} color="var(--primary)" icon={<Users size={20} />} />
                                <MetricCard label="Fighters" value={squads.length * 5} color="var(--accent)" icon={<UserCheck size={20} />} />
                                <MetricCard label="Matches" value={matches.length} color="#ff9f43" icon={<Sword size={20} />} />
                                <MetricCard label="Tickets" value={queries.filter(q => q.status === 'PENDING').length} color="#ff4757" icon={<MessageSquare size={20} />} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                                <div className="glass-panel" style={{ padding: '35px', borderRadius: '24px' }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '30px', fontWeight: '800' }}>Registration Control</h3>
                                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: config.registration_open === 'true' ? 'var(--success)' : 'var(--danger)', boxShadow: `0 0 15px ${config.registration_open === 'true' ? 'var(--success)' : 'var(--danger)'}` }} />
                                            <div>
                                                <div style={{ fontWeight: '800', fontSize: '1rem' }}>Registration Status</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{config.registration_open === 'true' ? 'Currently open and receiving entries.' : 'Registration is currently closed.'}</div>
                                            </div>
                                        </div>
                                        <button className={`btn ${config.registration_open === 'true' ? 'btn-primary' : 'btn-outline'}`} onClick={togglePortalGate} style={{ padding: '10px 20px', fontSize: '0.8rem' }}>
                                            {config.registration_open === 'true' ? 'Close Registration' : 'Open Registration'}
                                        </button>
                                    </div>
                                </div>
                                <div className="glass-panel" style={{ padding: '35px', borderRadius: '24px' }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '25px', fontWeight: '800' }}>System Health</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Database Latency</span>
                                            <span>0.4ms</span>
                                        </div>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                            <div style={{ height: '100%', width: '100%', background: 'var(--accent)', borderRadius: 'inherit' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>API Stability</span>
                                            <span>99.9%</span>
                                        </div>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                            <div style={{ height: '100%', width: '99%', background: 'var(--primary)', borderRadius: 'inherit' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'squads' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} size={20} />
                                <input className="form-input" placeholder="Search team names..." style={{ paddingLeft: '55px' }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                            </div>
                            <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', fontWeight: '800', opacity: 0.4 }}>
                                        <tr>
                                            <th style={{ padding: '20px 25px' }}>SQUAD DETAILS</th>
                                            <th>CONTACT</th>
                                            <th>TIMESTAMP</th>
                                            <th style={{ textAlign: 'center' }}>PAYMENT STATUS</th>
                                            <th style={{ textAlign: 'center' }}>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: '0.95rem' }}>
                                        {squads.filter(s => s.squadName.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                                            <tr key={s.id} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                <td style={{ padding: '20px 25px' }}>
                                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800' }}>#{s.id}</div>
                                                        <div>
                                                            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>{s.squadName}</div>
                                                            <div style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.5px' }}>Leader: {s.leaderName} ({s.p1Name})</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--text-muted)' }}>
                                                    <div style={{ fontSize: '0.85rem' }}>{s.phone}</div>
                                                    <div style={{ fontSize: '0.75rem', opacity: 0.4 }}>{s.email}</div>
                                                </td>
                                                <td style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                                                    <div>{new Date(s.createdAt).toLocaleDateString()}</div>
                                                    <div>{new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button 
                                                        onClick={() => updatePaymentStatus(s.id, s.paymentStatus === 'SUCCESS' ? 'PENDING' : 'SUCCESS')}
                                                        className={`btn ${s.paymentStatus === 'SUCCESS' ? 'btn-success' : 'btn-outline-danger'}`}
                                                        style={{ borderRadius: '10px', fontSize: '0.65rem', padding: '6px 12px', minWidth: '90px' }}
                                                    >
                                                        {s.paymentStatus === 'SUCCESS' ? 'PAID ✅' : 'NOT PAID ❌'}
                                                    </button>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span style={{ background: 'rgba(0,242,254,0.1)', color: 'var(--accent)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900' }}>VERIFIED</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'matches' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                            <div className="glass-panel" style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,242,254,0.03)', borderRadius: '24px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Match Generator</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px' }}>Generate randomized pairings from all registered squads.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button className="btn btn-primary" onClick={generateMatches}>Generate Matches</button>
                                    <button className="btn btn-outline" onClick={() => { navigator.clipboard.writeText(matches.map(m => `${m.squad1} vs ${m.squad2}`).join('\n')); alert('Copied.'); }}>Copy Matches</button>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                                {matches.map(m => (
                                    <div key={m.id} className="matches-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                                <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)', flex: 1, textAlign: 'right' }}>{m.squad1}</div>
                                                <div style={{ padding: '6px 14px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '900', border: '1px solid rgba(0, 242, 254, 0.2)' }}>VS</div>
                                                <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)', flex: 1, textAlign: 'left' }}>{m.squad2}</div>
                                            </div>
                                            <button onClick={() => deleteMatchPair(m.id)} className="btn hover-danger" style={{ padding: '8px', background: 'transparent', border: 'none', marginLeft: '10px' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        
                                        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Manual Room Access</div>
                                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Share Room ID/Pass with teams manually.</div>
                                        </div>

                                        <button className="btn btn-outline" style={{ width: '100%', height: '48px', borderRadius: '14px', fontSize: '0.85rem' }} onClick={() => { navigator.clipboard.writeText(`Match: ${m.squad1} vs ${m.squad2}`); setJustCopiedId(m.id); setTimeout(() => setJustCopiedId(null), 2000); }}>
                                            {justCopiedId === m.id ? <><Check size={16} /> COPIED</> : <><Copy size={16} /> COPY PAIRING</>}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'support' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {queries.map(q => (
                                <div key={q.id} className="glass-panel" style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderRadius: '24px', borderLeft: `4px solid ${q.status === 'PENDING' ? 'var(--accent)' : 'var(--success)'}` }}>
                                    <div style={{ flex: 1, paddingRight: '30px' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '15px' }}>
                                            <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#fff' }}>{q.squadName}</span>
                                            <span style={{ fontSize: '0.65rem', padding: '6px 12px', background: q.status === 'PENDING' ? 'rgba(0, 242, 254, 0.1)' : 'rgba(0, 255, 136, 0.1)', color: q.status === 'PENDING' ? 'var(--accent)' : 'var(--success)', borderRadius: '12px', fontWeight: '900', letterSpacing: '1px' }}>
                                                {q.status}
                                            </span>
                                        </div>
                                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>"{q.message}"</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                            <span>{q.phone}</span>
                                            <span style={{ opacity: 0.5 }}>•</span>
                                            <span>{new Date(q.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '120px' }}>
                                        {q.status === 'PENDING' && (
                                            <button className="btn btn-primary" style={{ padding: '12px', fontSize: '0.85rem', width: '100%', borderRadius: '14px' }} onClick={() => resolveQuery(q.id)}>
                                                <Check size={16} /> RESOLVE
                                            </button>
                                        )}
                                        <button className="btn btn-outline hover-danger" style={{ padding: '12px', fontSize: '0.85rem', width: '100%', borderRadius: '14px', border: 'none', background: 'rgba(255,255,255,0.03)' }} onClick={() => deleteQuery(q.id)}>
                                            <Trash2 size={16} /> DELETE
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '600px' }}>
                            <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                                <h3 style={{ marginBottom: '20px', fontWeight: '800' }}>Factory Reset</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>Admin access required: Permanently delete all current teams, matches, and support tickets from the system.</p>
                                <button className="btn btn-outline hover-danger" style={{ width: '100%', height: '60px', borderRadius: '16px', fontWeight: '800' }} onClick={systemPurge}>DELETE ALL SYSTEM DATA</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Adam;

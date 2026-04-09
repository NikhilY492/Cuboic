import React, { useEffect, useState, useRef } from 'react';
import { adminApi } from '../api/admin';

interface SystemLog {
    id: string;
    severity: string;
    source: string;
    message: string;
    createdAt: string;
    restaurant?: { name: string };
}

const LogsPage: React.FC = () => {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [loading, setLoading] = useState(true);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const loadLogs = async () => {
        try {
            // Using alerts endpoint to retrieve system logs
            const res = await adminApi.getAlerts(200); 
            // Reverse so oldest is top, newest is bottom
            setLogs(res.data.reverse());
        } catch (err) {
            console.error('Failed to load logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadLogs(); }, []);

    useEffect(() => {
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    return (
        <div className="scifi-page" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
            <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem' }}>System Log Archives</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Historical terminal output from the global neural net</p>
                </div>
                <button className="tech-btn" onClick={loadLogs}>Poll Server</button>
            </header>

            <div className="glass-panel tech-border" style={{ 
                flex: 1, 
                background: 'var(--bg-primary)', 
                overflowY: 'auto',
                padding: '24px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
            }}>
                {loading ? (
                    <div style={{ color: 'var(--text-muted)' }}>[root@thambi-core ~]# initializing log decryption stream...</div>
                ) : (
                    <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                            [root@thambi-core ~]# tail -n 200 /var/log/neural_net.log
                        </div>
                        {logs.map(log => (
                            <div key={log.id} style={{ 
                                display: 'flex', 
                                gap: '16px', 
                                marginBottom: '8px',
                                borderBottom: '1px dashed var(--border-color)',
                                paddingBottom: '4px'
                            }}>
                                <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                    {new Date(log.createdAt).toISOString().split('T')[1].slice(0, 8)}
                                </span>
                                <span style={{ 
                                    color: log.severity === 'CRITICAL' ? 'var(--severity-critical)' : 
                                           log.severity === 'WARNING' ? 'var(--severity-warning)' : 'var(--accent-primary)',
                                    width: '80px'
                                }}>
                                    [{log.severity}]
                                </span>
                                <span style={{ color: 'var(--text-secondary)', width: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {log.restaurant?.name || 'SYS_CORE'}
                                </span>
                                <span style={{ color: 'var(--text-primary)' }}>
                                    {log.source}: {log.message}
                                </span>
                            </div>
                        ))}
                        <div ref={terminalEndRef} style={{ height: '20px' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogsPage;

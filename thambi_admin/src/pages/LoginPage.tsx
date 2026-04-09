import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(userId, password)
            navigate('/dashboard')
        } catch {
            setError('Invalid credentials. Access Denied.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--bg-primary)'
        }}>
            <div className="scanline"></div>

            {/* Neural Background Glow */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vw',
                height: '60vw',
                background: 'var(--accent-primary)',
                filter: 'blur(150px)',
                opacity: 0.05,
                pointerEvents: 'none',
                borderRadius: '50%',
                zIndex: 0
            }}></div>

            <div className="glass-panel tech-border" style={{ 
                width: '100%', 
                maxWidth: '420px', 
                padding: '40px',
                zIndex: 10,
                position: 'relative'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        width: '80px', height: '80px', 
                        margin: '0 auto 16px',
                        border: '2px solid var(--accent-primary)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 229, 255, 0.1)',
                        boxShadow: '0 0 20px var(--border-glow)'
                    }}>
                        <img src="/pic1.png" alt="Thambi Logo" style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
                    </div>
                    <h1 className="font-display" style={{ fontSize: '1.8rem', color: 'var(--accent-primary)', letterSpacing: '8px' }}>THAMBI</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '8px' }}>Admin Protocol</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label className="font-display" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Operator ID</label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="e.g. root_override"
                            required
                            autoFocus
                            style={{
                                width: '100%',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '12px 16px',
                                fontFamily: 'var(--font-mono)',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    <div>
                        <label className="font-display" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Access Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: '100%',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '12px 16px',
                                fontFamily: 'var(--font-mono)',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    {error && (
                        <div style={{ 
                            padding: '12px', 
                            background: 'rgba(255, 0, 85, 0.1)', 
                            border: '1px dashed var(--severity-critical)', 
                            color: 'var(--severity-critical)',
                            fontSize: '0.8rem',
                            textAlign: 'center',
                            fontFamily: 'var(--font-mono)'
                        }}>
                            [!] {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="tech-btn" 
                        disabled={loading}
                        style={{ marginTop: '16px', padding: '16px', fontWeight: 'bold' }}
                    >
                        {loading ? 'Authenticating...' : 'Initialize Decryption'}
                    </button>
                </form>
            </div>
        </div>
    )
}

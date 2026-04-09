import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';

interface Restaurant {
    id: string;
    name: string;
    location: string;
    is_active: boolean;
    createdAt: string;
    _count: {
        orders: number;
        robots: number;
        users: number;
    };
}

const RestaurantsPage: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    const loadRestaurants = async () => {
        try {
            const res = await adminApi.getRestaurants();
            setRestaurants(res.data);
        } catch (err) {
            console.error('Failed to load restaurants:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadRestaurants(); }, []);

    if (loading) return <div className="font-display">Querying Global Matrix...</div>;

    return (
        <div className="scifi-page">
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem' }}>Restaurant Network</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Global overview of connected dining operations</p>
                </div>
                <button className="tech-btn" onClick={loadRestaurants}>Refresh Matrix</button>
            </header>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '24px' 
            }}>
                {restaurants.map(rest => (
                    <div key={rest.id} className="glass-panel tech-border" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: rest.is_active ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                                    {rest.name}
                                </h3>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    {rest.location || "Location Unknown"}
                                </div>
                            </div>
                            <div style={{ 
                                padding: '4px 8px', 
                                background: rest.is_active ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 0, 85, 0.1)',
                                color: rest.is_active ? 'var(--accent-primary)' : 'var(--severity-critical)',
                                border: `1px solid ${rest.is_active ? 'var(--accent-primary)' : 'var(--severity-critical)'}`,
                                fontSize: '0.6rem',
                                textTransform: 'uppercase',
                                fontFamily: 'var(--font-display)'
                            }}>
                                {rest.is_active ? 'Active' : 'Offline'}
                            </div>
                        </div>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr 1fr', 
                            gap: '12px',
                            background: 'var(--bg-tertiary)',
                            padding: '16px',
                            borderRadius: '4px',
                            border: '1px dashed var(--border-color)',
                            marginBottom: '16px'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders</div>
                                <div className="font-display" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{rest._count.orders}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Robots</div>
                                <div className="font-display" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{rest._count.robots}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Staff</div>
                                <div className="font-display" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{rest._count.users}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>System ID</span>
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{rest.id}</span>
                        </div>
                        <div style={{ display: 'flex', justifyItems: 'center', marginTop: '16px'}}>
                             <button className="tech-btn" style={{ width: '100%', borderColor: rest.is_active ? 'var(--severity-warning)': 'var(--accent-primary)', color: rest.is_active ? 'var(--severity-warning)' : 'var(--accent-primary)' }}>
                                {rest.is_active ? 'Suspend Node' : 'Activate Node'}
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantsPage;

import type { Order } from '../api/orders';
import './StatusTimeline.css';

const STEPS: { key: Order['order_status']; label: string; icon: string }[] = [
    { key: 'Received', label: 'Order Received', icon: '📋' },
    { key: 'Preparing', label: 'Being Prepared', icon: '👨‍🍳' },
    { key: 'Ready', label: 'Ready to Serve', icon: '✅' },
    { key: 'Assigned', label: 'On the Way', icon: '🤖' },
    { key: 'Delivered', label: 'Delivered!', icon: '🎉' },
];

function stepIndex(status: Order['order_status']) {
    return STEPS.findIndex(s => s.key === status);
}

interface Props { status: Order['order_status']; }

export function StatusTimeline({ status }: Props) {
    const current = stepIndex(status);
    return (
        <div className="timeline">
            {STEPS.map((step, i) => {
                const done = i <= current;
                const active = i === current;
                return (
                    <div key={step.key} className={`timeline__step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                        <div className="timeline__dot">
                            {done ? <span className="dot-icon">{step.icon}</span> : <span className="dot-num">{i + 1}</span>}
                        </div>
                        {i < STEPS.length - 1 && <div className="timeline__line" />}
                        <p className="timeline__label">{step.label}</p>
                    </div>
                );
            })}
        </div>
    );
}

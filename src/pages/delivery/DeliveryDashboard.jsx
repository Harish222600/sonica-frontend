import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deliveryAPI } from '../../services/api';
import { FiPackage, FiTruck, FiCheck, FiMapPin, FiChevronRight } from 'react-icons/fi';

const DeliveryDashboard = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchDeliveries();
    }, [filter]);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await deliveryAPI.getAssigned(params);
            setDeliveries(response.data.data);
        } catch (error) {
            console.error('Failed to fetch deliveries:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            assigned: 'badge-secondary',
            picked: 'badge-primary',
            in_transit: 'badge-warning',
            delivered: 'badge-success',
            failed: 'badge-danger'
        };
        return styles[status] || 'badge-secondary';
    };

    const filters = [
        { key: 'all', label: 'All', icon: FiPackage },
        { key: 'assigned', label: 'New', icon: FiPackage },
        { key: 'picked', label: 'Picked Up', icon: FiTruck },
        { key: 'delivered', label: 'Delivered', icon: FiCheck },
    ];

    if (loading) {
        return (
            <div>
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>My Deliveries</h1>
                <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card skeleton" style={{ height: 120 }}></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 'var(--spacing-2xl)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1>My Deliveries</h1>
                    <p style={{ color: 'var(--gray-500)' }}>Manage your assigned deliveries.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-sm flex-col-mobile overflow-x-auto-mobile" style={{ marginBottom: 'var(--spacing-lg)' }}>
                {filters.map((f) => (
                    <button
                        key={f.key}
                        className={`btn ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilter(f.key)}
                    >
                        <f.icon /> {f.label}
                    </button>
                ))}
            </div>

            {/* Deliveries List */}
            {deliveries.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {deliveries.map((delivery) => (
                        <Link
                            key={delivery._id}
                            to={`/delivery/${delivery._id}`}
                            className="card hover-card"
                            style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="flex justify-between items-center w-full-mobile flex-col-mobile items-start-mobile gap-sm-mobile" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Order #{delivery.order?.orderNumber}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                                        {new Date(delivery.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-md w-full-mobile justify-between-mobile">
                                    <span className={`badge ${getStatusBadge(delivery.status)}`}>
                                        {delivery.status.replace('_', ' ')}
                                    </span>
                                    <FiChevronRight style={{ color: 'var(--gray-400)' }} />
                                </div>
                            </div>

                            <div className="flex items-center gap-md" style={{
                                padding: 'var(--spacing-md)',
                                background: 'var(--gray-50)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <FiMapPin size={20} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontWeight: 500 }}>{delivery.order?.shippingAddress?.street}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                                        {delivery.order?.shippingAddress?.city}, {delivery.order?.shippingAddress?.state}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                    <FiPackage size={48} style={{ color: 'var(--gray-300)', marginBottom: 'var(--spacing-md)' }} />
                    <h3>No deliveries found</h3>
                    <p style={{ color: 'var(--gray-500)' }}>
                        {filter === 'all' ? 'Your assigned deliveries will appear here.' : `No ${filter} deliveries.`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DeliveryDashboard;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { FiPackage, FiTruck, FiCheck, FiChevronRight, FiStar } from 'react-icons/fi';
import ReviewModal from '../../components/common/ReviewModal';
import InvoiceButton from '../../components/common/InvoiceButton';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewOrder, setReviewOrder] = useState(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getAll({ sort: '-createdAt' });
            setOrders(response.data.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRateOrder = (e, order) => {
        e.preventDefault();
        e.stopPropagation();
        setReviewOrder(order);
        setIsReviewOpen(true);
    };

    const getStatusColor = (status) => {
        const colors = {
            created: 'badge-secondary',
            paid: 'badge-primary',
            packed: 'badge-primary',
            shipped: 'badge-warning',
            delivered: 'badge-success',
            completed: 'badge-success',
            cancelled: 'badge-danger'
        };
        return colors[status] || 'badge-secondary';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'shipped':
                return <FiTruck />;
            case 'delivered':
            case 'completed':
                return <FiCheck />;
            default:
                return <FiPackage />;
        }
    };

    if (loading) {
        return (
            <div className="page container">
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>My Orders</h1>
                {[1, 2, 3].map(i => (
                    <div key={i} className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div className="skeleton" style={{ height: 100 }}></div>
                    </div>
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="page container text-center">
                <div style={{ fontSize: '6rem', marginBottom: 'var(--spacing-lg)' }}>📦</div>
                <h2>No orders yet</h2>
                <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--spacing-xl)' }}>
                    Your order history will appear here
                </p>
                <Link to="/products" className="btn btn-primary btn-lg">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="page container">
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>My Orders</h1>

            {orders.map((order) => (
                <div
                    key={order._id}
                    className="card fade-in"
                    onClick={() => navigate(`/orders/${order._id}`)}
                    style={{
                        marginBottom: 'var(--spacing-md)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        position: 'relative'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div>
                            <p style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                                Order #{order.orderNumber}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-md">
                            <span className={`badge ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span style={{ marginLeft: 4 }}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </span>
                            <FiChevronRight style={{ color: 'var(--gray-400)' }} />
                        </div>
                    </div>

                    <div className="flex gap-md" style={{ overflowX: 'auto', marginBottom: 'var(--spacing-md)' }}>
                        {order.items.slice(0, 4).map((item, i) => (
                            <img
                                key={i}
                                src={item.product?.images?.[0] || 'https://via.placeholder.com/60x60'}
                                alt=""
                                style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: 'cover',
                                    borderRadius: 'var(--radius-md)',
                                    flexShrink: 0
                                }}
                            />
                        ))}
                        {order.items.length > 4 && (
                            <div style={{
                                width: 60,
                                height: 60,
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--gray-100)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                color: 'var(--gray-500)',
                                flexShrink: 0
                            }}>
                                +{order.items.length - 4}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center" style={{
                        paddingTop: 'var(--spacing-md)',
                        borderTop: '1px solid var(--gray-100)'
                    }}>
                        <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                            {order.items.length} item{order.items.length > 1 ? 's' : ''} • <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>₹{order.totalAmount.toLocaleString()}</span>
                        </span>

                        <div className="flex gap-sm" onClick={(e) => e.stopPropagation()}>
                            <InvoiceButton order={order} className="btn-sm btn-outline" />
                            {['delivered', 'completed'].includes(order.status) && (
                                <button
                                    className="btn btn-outline btn-sm flex items-center gap-xs"
                                    onClick={(e) => handleRateOrder(e, order)}
                                >
                                    <FiStar /> Rate Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                order={reviewOrder}
                onSuccess={() => {
                    // Refresh orders or show success toast?
                    // For now just close
                    setIsReviewOpen(false);
                }}
            />
        </div>
    );
};

export default OrdersPage;

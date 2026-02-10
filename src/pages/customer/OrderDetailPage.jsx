import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { FiPackage, FiCheck, FiTruck, FiArrowLeft, FiX } from 'react-icons/fi';
import InvoiceButton from '../../components/common/InvoiceButton';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const isSuccess = searchParams.get('success') === 'true';

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await orderAPI.getById(id);
            setOrder(response.data.data);
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusSteps = [
        { key: 'created', label: 'Order Placed', icon: FiPackage },
        { key: 'paid', label: 'Payment Confirmed', icon: FiCheck },
        { key: 'packed', label: 'Packed', icon: FiPackage },
        { key: 'shipped', label: 'Shipped', icon: FiTruck },
        { key: 'delivered', label: 'Delivered', icon: FiCheck },
    ];

    const getStatusIndex = (status) => {
        if (status === 'cancelled') return -1;
        if (status === 'completed') return 4;
        return statusSteps.findIndex(s => s.key === status);
    };

    if (loading) {
        return (
            <div className="page container">
                <div className="skeleton" style={{ height: 40, width: 200, marginBottom: 'var(--spacing-lg)' }}></div>
                <div className="skeleton" style={{ height: 200, marginBottom: 'var(--spacing-lg)' }}></div>
                <div className="skeleton" style={{ height: 300 }}></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="page container text-center">
                <h2>Order not found</h2>
                <Link to="/orders" className="btn btn-primary mt-lg">View All Orders</Link>
            </div>
        );
    }

    const currentStep = getStatusIndex(order.status);

    return (
        <div className="page container">
            {isSuccess && (
                <div className="card fade-in" style={{
                    background: 'linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%)',
                    color: 'white',
                    marginBottom: 'var(--spacing-xl)',
                    textAlign: 'center',
                    padding: 'var(--spacing-xl)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🎉</div>
                    <h2 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>Order Placed Successfully!</h2>
                    <p style={{ opacity: 0.9, marginBottom: 'var(--spacing-lg)' }}>Thank you for your purchase. Your order is being processed.</p>
                    <InvoiceButton
                        order={order}
                        className="btn-white"
                        buttonStyle={{ color: 'var(--success-600)', background: 'white', border: 'none' }}
                    />
                </div>
            )}

            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Link to="/orders" className="btn btn-ghost">
                    <FiArrowLeft /> Back to Orders
                </Link>
                {!isSuccess && <InvoiceButton order={order} />}
            </div>

            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1>Order #{order.orderNumber}</h1>
                    <p style={{ color: 'var(--gray-500)' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>

            {/* Status Timeline */}
            {order.status !== 'cancelled' ? (
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-xl)' }}>Order Status</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: 20,
                            left: 40,
                            right: 40,
                            height: 4,
                            background: 'var(--gray-200)',
                            zIndex: 0
                        }}>
                            <div style={{
                                width: `${(currentStep / 4) * 100}%`,
                                height: '100%',
                                background: 'var(--success-500)',
                                transition: 'width 0.5s ease'
                            }}></div>
                        </div>
                        {statusSteps.map((step, i) => (
                            <div key={step.key} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 'var(--radius-full)',
                                    background: i <= currentStep ? 'var(--success-500)' : 'var(--gray-200)',
                                    color: i <= currentStep ? 'white' : 'var(--gray-400)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--spacing-sm)',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {i < currentStep ? <FiCheck /> : <step.icon size={18} />}
                                </div>
                                <span style={{
                                    fontSize: '0.85rem',
                                    fontWeight: i <= currentStep ? 600 : 400,
                                    color: i <= currentStep ? 'var(--gray-900)' : 'var(--gray-400)'
                                }}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="card" style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'var(--error-500)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    <div className="flex items-center gap-md" style={{ color: 'var(--error-600)' }}>
                        <FiX size={24} />
                        <div>
                            <h4 style={{ marginBottom: 4 }}>Order Cancelled</h4>
                            <p style={{ fontSize: '0.9rem' }}>{order.cancellation?.reason || 'This order has been cancelled'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Delivery Partner Info - Show when assigned/shipped */}
            {order.delivery?.partner && ['shipped', 'delivered', 'completed'].includes(order.status) && (
                <div className="card" style={{
                    marginBottom: 'var(--spacing-xl)',
                    background: 'var(--primary-50)',
                    borderColor: 'var(--primary-200)'
                }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiTruck /> Delivery Details
                    </h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{order.delivery.partner.name}</p>
                            <p style={{ color: 'var(--gray-600)' }}>Your Delivery Partner</p>
                        </div>
                        <div className="text-right">
                            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{order.delivery.partner.phone}</p>
                            <a href={`tel:${order.delivery.partner.phone}`} className="btn btn-sm btn-primary" style={{ marginTop: '4px' }}>
                                Call Partner
                            </a>
                        </div>
                    </div>
                    {order.status === 'shipped' && (
                        <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--primary-200)' }}>
                            <p style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
                                🚚 Out for Delivery - Arriving Soon!
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--spacing-xl)' }}>
                {/* Order Items */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Items</h3>
                    {order.items.map((item, i) => (
                        <div key={i} className="flex gap-md" style={{
                            padding: 'var(--spacing-md) 0',
                            borderBottom: i < order.items.length - 1 ? '1px solid var(--gray-100)' : 'none'
                        }}>
                            <img
                                src={item.product?.images?.[0] || 'https://via.placeholder.com/80x80'}
                                alt={item.product?.name}
                                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                            />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600 }}>{item.product?.name || 'Product'}</p>
                                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                                    Quantity: {item.quantity}
                                </p>
                            </div>
                            <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div>
                    <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Shipping Address</h4>
                        <p>{order.shippingAddress?.street}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                        <p>{order.shippingAddress?.pincode}</p>
                        <p style={{ marginTop: 'var(--spacing-sm)' }}>{order.shippingAddress?.phone}</p>
                    </div>

                    <div className="card">
                        <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Payment Summary</h4>
                        <div className="flex justify-between" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            <span style={{ color: 'var(--gray-500)' }}>Subtotal</span>
                            <span>₹{(order.totalAmount - (order.totalAmount >= 10000 ? 0 : 500)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            <span style={{ color: 'var(--gray-500)' }}>Shipping</span>
                            <span>{order.totalAmount >= 10000 ? 'FREE' : '₹500'}</span>
                        </div>
                        <div className="flex justify-between" style={{
                            paddingTop: 'var(--spacing-md)',
                            borderTop: '2px solid var(--gray-100)',
                            marginTop: 'var(--spacing-md)'
                        }}>
                            <span style={{ fontWeight: 700 }}>Total</span>
                            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-600)' }}>
                                ₹{order.totalAmount.toLocaleString()}
                            </span>
                        </div>
                        {order.payment?.status === 'completed' && (
                            <p style={{
                                marginTop: 'var(--spacing-md)',
                                fontSize: '0.85rem',
                                color: 'var(--success-600)'
                            }}>
                                <FiCheck style={{ marginRight: 4 }} /> Paid via {order.payment.method || 'Razorpay'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deliveryAPI } from '../../services/api';
import { FiArrowLeft, FiMapPin, FiPhone, FiUser, FiPackage, FiCheck } from 'react-icons/fi';

const DeliveryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [podData, setPodData] = useState({ signature: '', note: '' });
    const [podModalOpen, setPodModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) fetchDelivery();
    }, [id]);

    const fetchDelivery = async () => {
        try {
            const response = await deliveryAPI.getById(id);
            setDelivery(response.data.data);
        } catch (error) {
            console.error('Failed to fetch delivery:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await deliveryAPI.updateStatus(id, { status: newStatus });
            toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
            fetchDelivery();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const openGoogleMaps = () => {
        if (!delivery?.order?.shippingAddress) return;
        const { street, city, state, pincode } = delivery.order.shippingAddress;
        const address = `${street}, ${city}, ${state}, ${pincode}`;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    };

    const handleConfirmDelivery = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await deliveryAPI.confirm(id, {
                signature: podData.signature,
                note: podData.note,
                actualDeliveryDate: new Date().toISOString()
            });
            setPodModalOpen(false);
            toast.success('Delivery confirmed successfully');
            fetchDelivery();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to confirm delivery');
        } finally {
            setUpdating(false);
        }
    };

    const getNextStatus = () => {
        switch (delivery?.status) {
            case 'assigned':
                return { action: 'Pick Up Order', status: 'picked' };
            case 'picked':
                return { action: 'Start Delivery', status: 'in_transit' };
            case 'in_transit':
                return { action: 'Mark as Delivered', status: 'delivered', isConfirm: true };
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div>
                <div className="skeleton" style={{ height: 40, width: 200, marginBottom: 'var(--spacing-lg)' }}></div>
                <div className="skeleton" style={{ height: 300 }}></div>
            </div>
        );
    }

    if (!delivery) {
        return (
            <div className="text-center">
                <h2>Delivery not found</h2>
                <button className="btn btn-primary mt-lg" onClick={() => navigate('/delivery')}>
                    Back to Deliveries
                </button>
            </div>
        );
    }

    const nextStatus = getNextStatus();

    return (
        <div>
            {/* Headers and Back button remain same */}
            <button className="btn btn-ghost" onClick={() => navigate('/delivery')} style={{ marginBottom: 'var(--spacing-lg)' }}>
                <FiArrowLeft /> Back to Deliveries
            </button>

            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1>Order #{delivery.order?.orderNumber}</h1>
                    <span className={`badge ${delivery.status === 'delivered' ? 'badge-success' :
                        delivery.status === 'in_transit' ? 'badge-warning' :
                            delivery.status === 'failed' ? 'badge-danger' : 'badge-primary'
                        }`} style={{ marginTop: 'var(--spacing-sm)' }}>
                        {delivery.status.replace('_', ' ')}
                    </span>
                </div>

                {nextStatus && (
                    <div className="flex gap-sm">
                        {delivery.status !== 'delivered' && (
                            <button className="btn btn-secondary" onClick={openGoogleMaps}>
                                <FiMapPin /> Navigate
                            </button>
                        )}
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => nextStatus.isConfirm ? setPodModalOpen(true) : updateStatus(nextStatus.status)}
                            disabled={updating}
                        >
                            {updating ? 'Updating...' : nextStatus.action}
                        </button>
                    </div>
                )}

                {delivery.status === 'delivered' && (
                    <div className="badge badge-success" style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontSize: '1rem' }}>
                        <FiCheck /> Delivered
                    </div>
                )}
            </div>

            {/* Address and Items (existing code) */}
            <div className="grid grid-2" style={{ gap: 'var(--spacing-xl)' }}>
                {/* Customer & Address */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <FiMapPin style={{ marginRight: 8 }} /> Delivery Address
                    </h3>

                    <div style={{
                        padding: 'var(--spacing-lg)',
                        background: 'var(--gray-50)',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        <p style={{ fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                            {delivery.order?.shippingAddress?.street}
                        </p>
                        <p>{delivery.order?.shippingAddress?.city}, {delivery.order?.shippingAddress?.state}</p>
                        <p style={{ fontWeight: 600 }}>{delivery.order?.shippingAddress?.pincode}</p>
                    </div>

                    <div className="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--primary-100)',
                            color: 'var(--primary-600)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FiUser />
                        </div>
                        <div>
                            <p style={{ fontWeight: 600 }}>{delivery.order?.user?.name || 'Customer'}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{delivery.order?.user?.email}</p>
                        </div>
                    </div>

                    {delivery.order?.shippingAddress?.phone && (
                        <a
                            href={`tel:${delivery.order.shippingAddress.phone}`}
                            className="btn btn-secondary w-full"
                        >
                            <FiPhone /> Call Customer: {delivery.order.shippingAddress.phone}
                        </a>
                    )}
                </div>

                {/* Order Items */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <FiPackage style={{ marginRight: 8 }} /> Order Items
                    </h3>

                    {delivery.order?.items?.map((item, i) => (
                        <div key={i} className="flex gap-md items-center" style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--gray-50)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            <img
                                src={item.product?.images?.[0] || 'https://via.placeholder.com/60'}
                                alt=""
                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                            />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600 }}>{item.product?.name}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between" style={{
                        marginTop: 'var(--spacing-lg)',
                        paddingTop: 'var(--spacing-lg)',
                        borderTop: '2px solid var(--gray-100)'
                    }}>
                        <span style={{ fontWeight: 600 }}>Total Items</span>
                        <span style={{ fontWeight: 700 }}>
                            {delivery.order?.items?.reduce((sum, item) => sum + item.quantity, 0)} items
                        </span>
                    </div>
                </div>
            </div>

            {/* Delivery Timeline */}
            {delivery.status === 'delivered' && delivery.actualDeliveryDate && (
                <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Delivery Completed</h3>
                    <p style={{ color: 'var(--gray-500)' }}>
                        Delivered on {new Date(delivery.actualDeliveryDate).toLocaleString()}
                    </p>
                    {delivery.notes && (
                        <p style={{ marginTop: 'var(--spacing-sm)' }}><strong>Note:</strong> {delivery.notes}</p>
                    )}
                    {delivery.customerSignature && (
                        <p style={{ marginTop: 'var(--spacing-sm)' }}><strong>Signed by:</strong> {delivery.customerSignature}</p>
                    )}
                </div>
            )}

            {/* POD Modal */}
            {podModalOpen && (
                <div className="modal-overlay" onClick={() => setPodModalOpen(false)}>
                    <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Complete Delivery</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setPodModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleConfirmDelivery}>
                                <div className="form-group">
                                    <label className="form-label">Customer Name / Signature</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter customer name who received"
                                        value={podData.signature}
                                        onChange={(e) => setPodData({ ...podData, signature: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Delivery Notes</label>
                                    <textarea
                                        className="form-input"
                                        placeholder="Any notes about the delivery..."
                                        rows="3"
                                        value={podData.note}
                                        onChange={(e) => setPodData({ ...podData, note: e.target.value })}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={updating}
                                >
                                    {updating ? 'Proccessing...' : 'Confirm Delivery'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryDetail;

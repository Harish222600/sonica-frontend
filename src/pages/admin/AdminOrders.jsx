import { useState, useEffect } from 'react';
import { adminAPI, deliveryAPI } from '../../services/api';
import { FiSearch, FiEye, FiTruck } from 'react-icons/fi';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', search: '' });
    const [partners, setPartners] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [assignData, setAssignData] = useState({ orderId: null, partnerId: '', estimatedDate: '' });
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchPartners();
    }, [filters]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Increased limit to show more orders
            const params = { ...filters, limit: 100 };
            const response = await adminAPI.getOrders(params);
            setOrders(response.data.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPartners = async () => {
        try {
            const response = await adminAPI.getDeliveryPartners();
            setPartners(response.data.data);
        } catch (error) {
            console.error('Failed to fetch partners:', error);
        }
    };

    const openAssignModal = (order) => {
        setAssignData({
            orderId: order._id,
            partnerId: order.delivery?.partner?._id || '',
            estimatedDate: order.delivery?.estimatedDate ? new Date(order.delivery.estimatedDate).toISOString().split('T')[0] : ''
        });
        setAssignModalOpen(true);
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        setAssigning(true);
        try {
            await deliveryAPI.assign(assignData);
            setAssignModalOpen(false);
            fetchOrders(); // Refresh list
            alert('Delivery assigned successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to assign delivery');
        } finally {
            setAssigning(false);
        }
    };

    const statuses = ['created', 'paid', 'packed', 'shipped', 'delivered', 'completed', 'cancelled'];

    const getStatusBadge = (status) => {
        const styles = {
            created: 'badge-secondary',
            paid: 'badge-primary',
            packed: 'badge-primary',
            shipped: 'badge-warning',
            delivered: 'badge-success',
            completed: 'badge-success',
            cancelled: 'badge-danger'
        };
        return styles[status] || 'badge-secondary';
    };

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Orders</h1>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="flex gap-md">
                    <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
                        <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search order #..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            style={{ paddingLeft: 40 }}
                        />
                    </div>
                    <select
                        className="form-input"
                        style={{ width: 'auto' }}
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Status</option>
                        {statuses.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            {loading ? (
                <div className="card">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="skeleton" style={{ height: 60, marginBottom: 'var(--spacing-md)' }}></div>
                    ))}
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Delivery</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td style={{ fontWeight: 600 }}>{order.orderNumber}</td>
                                    <td>
                                        <div>
                                            <p>{order.user?.name || 'Guest'}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{order.user?.email}</p>
                                        </div>
                                    </td>
                                    <td>{order.items?.length || 0} items</td>
                                    <td style={{ fontWeight: 600 }}>₹{order.totalAmount?.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        {order.delivery?.partner ? (
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FiTruck size={14} color="var(--primary-600)" />
                                                    <span>{order.delivery.partner.name}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>Unassigned</span>
                                        )}
                                    </td>
                                    <td style={{ color: 'var(--gray-500)' }}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="flex gap-sm">
                                            <button
                                                className="btn btn-ghost btn-icon btn-sm"
                                                onClick={() => setSelectedOrder(order)}
                                                title="View Details"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-icon btn-sm"
                                                onClick={() => openAssignModal(order)}
                                                title="Assign Delivery"
                                                style={{ color: 'var(--primary-600)' }}
                                            >
                                                <FiTruck />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order #{selectedOrder.orderNumber}</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="grid grid-2" style={{ gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                                <div>
                                    <h5>Customer</h5>
                                    <p>{selectedOrder.user?.name}</p>
                                    <p style={{ color: 'var(--gray-500)' }}>{selectedOrder.user?.email}</p>
                                    <p style={{ color: 'var(--gray-500)' }}>{selectedOrder.user?.phone}</p>
                                </div>
                                <div>
                                    <h5>Shipping Address</h5>
                                    <p>{selectedOrder.shippingAddress?.street}</p>
                                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                                    <p>{selectedOrder.shippingAddress?.pincode}</p>
                                </div>
                            </div>

                            <h5 style={{ marginBottom: 'var(--spacing-md)' }}>Items</h5>
                            {selectedOrder.items?.map((item, i) => (
                                <div key={i} className="flex gap-md items-center" style={{
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--gray-50)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    <img
                                        src={item.product?.images?.[0] || 'https://via.placeholder.com/50'}
                                        alt=""
                                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600 }}>{item.product?.name}</p>
                                        <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Qty: {item.quantity}</p>
                                    </div>
                                    <p style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}

                            <div className="flex justify-between" style={{
                                marginTop: 'var(--spacing-lg)',
                                paddingTop: 'var(--spacing-lg)',
                                borderTop: '2px solid var(--gray-100)'
                            }}>
                                <span style={{ fontWeight: 700 }}>Total</span>
                                <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-600)' }}>
                                    ₹{selectedOrder.totalAmount?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Delivery Modal */}
            {assignModalOpen && (
                <div className="modal-overlay" onClick={() => setAssignModalOpen(false)}>
                    <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Assign Delivery Partner</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setAssignModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAssign}>
                                <div className="form-group">
                                    <label className="form-label">Delivery Partner</label>
                                    <select
                                        className="form-input"
                                        value={assignData.partnerId}
                                        onChange={(e) => setAssignData({ ...assignData, partnerId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Partner</option>
                                        {partners.map(p => (
                                            <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Estimated Delivery Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={assignData.estimatedDate}
                                        onChange={(e) => setAssignData({ ...assignData, estimatedDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={assigning}
                                >
                                    {assigning ? 'Assigning...' : 'Assign Delivery'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;

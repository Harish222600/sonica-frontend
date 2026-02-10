import { useState, useEffect } from 'react';
import { inventoryAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSearch, FiPlus, FiMinus, FiX } from 'react-icons/fi';

const StockManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, [search]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await inventoryAPI.getAll({ search });
            setInventory(response.data.data);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item, type) => {
        setSelectedProduct(item);
        setModalType(type);
        setQuantity('');
        setReason('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (modalType === 'add') {
                await inventoryAPI.addStock({
                    productId: selectedProduct.product._id,
                    quantity: Number(quantity),
                    reason: reason || 'Stock added'
                });
            } else {
                await inventoryAPI.removeStock(selectedProduct.product._id, {
                    quantity: Number(quantity),
                    reason: reason || 'Stock removed'
                });
            }
            setShowModal(false);
            fetchInventory();
            toast.success(modalType === 'add' ? 'Stock added successfully' : 'Stock removed successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update stock');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Stock Management</h1>

            {/* Search */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ position: 'relative', maxWidth: 400 }}>
                    <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: 40 }}
                    />
                </div>
            </div>

            {/* Inventory Table */}
            {loading ? (
                <div className="card">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="skeleton" style={{ height: 60, marginBottom: 'var(--spacing-md)' }}></div>
                    ))}
                </div>
            ) : (
                <div className="table-container" style={{ overflowX: 'auto' }}>
                    <table className="table table-responsive-stack" style={{ minWidth: '600px' }}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Total Stock</th>
                                <th>Reserved</th>
                                <th>Available</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => {
                                const available = item.totalStock - item.reservedStock;
                                const isLow = item.totalStock <= item.lowStockThreshold;
                                const isOut = item.totalStock === 0;

                                return (
                                    <tr key={item._id}>
                                        <td data-label="Product">
                                            <div className="flex items-center gap-md">
                                                <img
                                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/40'}
                                                    alt=""
                                                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                                />
                                                <span style={{ fontWeight: 600 }}>{item.product?.name}</span>
                                            </div>
                                        </td>
                                        <td data-label="Category">
                                            <span className="badge badge-secondary">{item.product?.category}</span>
                                        </td>
                                        <td data-label="Total Stock" style={{ fontWeight: 600 }}>{item.totalStock}</td>
                                        <td data-label="Reserved" style={{ color: 'var(--warning-500)' }}>{item.reservedStock}</td>
                                        <td data-label="Available" style={{ fontWeight: 600, color: 'var(--success-600)' }}>{available}</td>
                                        <td data-label="Status">
                                            <span className={`badge ${isOut ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'}`}>
                                                {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                        <td data-label="Actions">
                                            <div className="flex gap-sm">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => openModal(item, 'add')}
                                                >
                                                    <FiPlus /> Add
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => openModal(item, 'remove')}
                                                    disabled={item.totalStock === 0}
                                                >
                                                    <FiMinus /> Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '95%', margin: '0 auto' }}>
                        <div className="modal-header">
                            <h3>{modalType === 'add' ? 'Add Stock' : 'Remove Stock'}</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div style={{
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--gray-50)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--spacing-lg)'
                                }}>
                                    <div className="flex items-center gap-md">
                                        <img
                                            src={selectedProduct?.product?.images?.[0] || 'https://via.placeholder.com/50'}
                                            alt=""
                                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                        />
                                        <div>
                                            <p style={{ fontWeight: 600 }}>{selectedProduct?.product?.name}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                                                Current stock: {selectedProduct?.totalStock} units
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        min="1"
                                        max={modalType === 'remove' ? selectedProduct?.totalStock : undefined}
                                        required
                                        placeholder={`Enter quantity to ${modalType}`}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Reason (Optional)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder={modalType === 'add' ? 'e.g., New shipment received' : 'e.g., Damaged goods'}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`btn ${modalType === 'add' ? 'btn-primary' : 'btn-danger'}`}
                                    disabled={saving}
                                >
                                    {saving ? 'Processing...' : (modalType === 'add' ? 'Add Stock' : 'Remove Stock')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockManagement;

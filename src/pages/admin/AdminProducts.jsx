import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminAPI, productAPI } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiX } from 'react-icons/fi';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'mountain',
        price: '',
        discountPrice: '',
        shippingFees: 0,
        stock: '',
        specifications: {}
    });
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [saving, setSaving] = useState(false);

    const categories = ['mountain', 'road', 'electric', 'hybrid', 'kids', 'accessories'];

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productAPI.getAll({ search, limit: 50 });
            setProducts(response.data.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setExistingImages(product.images || []);
            setFormData({
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                discountPrice: product.discountPrice || '',
                shippingFees: product.shippingFees || 0,
                stock: product.stock,
                specifications: product.specifications || {}
            });
        } else {
            setEditingProduct(null);
            setExistingImages([]);
            setFormData({
                name: '',
                description: '',
                category: 'mountain',
                price: '',
                discountPrice: '',
                shippingFees: 0,
                stock: '',
                specifications: {}
            });
        }
        setImages([]);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const form = new FormData();
            form.append('data', JSON.stringify(formData));
            form.append('keepImages', JSON.stringify(existingImages));
            images.forEach((img) => form.append('images', img));

            if (editingProduct) {
                await adminAPI.updateProduct(editingProduct._id, form);
            } else {
                await adminAPI.createProduct(form);
            }

            setShowModal(false);
            fetchProducts();
            toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await adminAPI.deleteProduct(id);
            fetchProducts();
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>Products</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <FiPlus /> Add Product
                </button>
            </div>

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

            {/* Products Table */}
            {loading ? (
                <div className="card">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton" style={{ height: 60, marginBottom: 'var(--spacing-md)' }}></div>
                    ))}
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <div className="flex items-center gap-md">
                                            <img
                                                src={product.images?.[0] || 'https://via.placeholder.com/50x50'}
                                                alt=""
                                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                            />
                                            <div>
                                                <p style={{ fontWeight: 600 }}>{product.name}</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                                                    {product.ratings?.count || 0} reviews
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-secondary">{product.category}</span>
                                    </td>
                                    <td>
                                        <div>
                                            <p style={{ fontWeight: 600 }}>₹{(product.discountPrice || product.price).toLocaleString()}</p>
                                            {product.discountPrice > 0 && product.discountPrice < product.price && (
                                                <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', textDecoration: 'line-through' }}>
                                                    ₹{product.price.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${product.stock === 0 ? 'badge-danger' : product.stock < 10 ? 'badge-warning' : 'badge-success'}`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-sm">
                                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openModal(product)}>
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-icon btn-sm"
                                                style={{ color: 'var(--error-500)' }}
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-input"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-input"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Stock</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Price (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Discount Price (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.discountPrice}
                                            onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                            placeholder="Optional"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Shipping Fees (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.shippingFees}
                                            onChange={(e) => setFormData({ ...formData, shippingFees: e.target.value })}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Product Images</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setImages(Array.from(e.target.files))}
                                        className="form-input"
                                    />
                                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 4 }}>
                                        Select up to 5 images
                                    </p>
                                </div>

                                {existingImages.length > 0 && (
                                    <div className="form-group">
                                        <label className="form-label">Current Images</label>
                                        <div className="flex gap-md wrap">
                                            {existingImages.map((img, index) => (
                                                <div key={index} style={{ position: 'relative', width: 80, height: 80 }}>
                                                    <img
                                                        src={img}
                                                        alt={`Product ${index + 1}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}
                                                        style={{
                                                            position: 'absolute',
                                                            top: -5,
                                                            right: -5,
                                                            background: 'var(--error-500)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: 20,
                                                            height: 20,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;

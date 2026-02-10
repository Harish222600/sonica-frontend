import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import { FiPlus, FiEdit2, FiSearch, FiX, FiCheck, FiUser } from 'react-icons/fi';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ role: '', search: '', status: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'customer' });
    const [saving, setSaving] = useState(false);

    const roles = ['customer', 'admin', 'inventory_manager', 'delivery_partner'];

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getUsers(filters);
            setUsers(response.data.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                password: '',
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', phone: '', password: '', role: 'customer' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingUser) {
                await adminAPI.updateUser(editingUser._id, formData);
            } else {
                await adminAPI.createUser(formData);
            }
            setShowModal(false);
            fetchUsers();
            toast.success(editingUser ? 'User updated successfully' : 'User created successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save user');
        } finally {
            setSaving(false);
        }
    };

    const toggleUserStatus = async (user) => {
        try {
            await adminAPI.updateUser(user._id, { isActive: !user.isActive });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center flex-col-mobile items-start-mobile gap-md-mobile" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>Users</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <FiPlus /> Add User
                </button>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="flex gap-md flex-col-mobile">
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search users..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            style={{ paddingLeft: 40, width: '100%' }}
                        />
                    </div>
                    <div className="flex gap-md w-full-mobile flex-col-mobile">
                        <select
                            className="form-input w-full-mobile"
                            style={{ width: 'auto' }}
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                        >
                            <option value="">All Roles</option>
                            {roles.map(r => (
                                <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
                            ))}
                        </select>
                        <select
                            className="form-input w-full-mobile"
                            style={{ width: 'auto' }}
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="card">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="skeleton" style={{ height: 60, marginBottom: 'var(--spacing-md)' }}></div>
                    ))}
                </div>
            ) : (
                <div className="table-container" style={{ overflowX: 'auto' }}>
                    <table className="table table-responsive-stack" style={{ minWidth: '700px' }}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td data-label="User">
                                        <div className="flex items-center gap-md">
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 'var(--radius-full)',
                                                background: 'var(--primary-100)',
                                                color: 'var(--primary-600)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700
                                            }}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600 }}>{user.name}</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Role">
                                        <span className={`badge ${user.role === 'admin' ? 'badge-primary' :
                                            user.role === 'inventory_manager' ? 'badge-warning' :
                                                user.role === 'delivery_partner' ? 'badge-success' : 'badge-secondary'
                                            }`}>
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td data-label="Phone">{user.phone || '-'}</td>
                                    <td data-label="Status">
                                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td data-label="Joined" style={{ color: 'var(--gray-500)' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td data-label="Actions">
                                        <div className="flex gap-sm">
                                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openModal(user)}>
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className={`btn btn-icon btn-sm ${user.isActive ? 'btn-ghost' : 'btn-primary'}`}
                                                onClick={() => toggleUserStatus(user)}
                                                style={{ color: user.isActive ? 'var(--error-500)' : undefined }}
                                            >
                                                {user.isActive ? <FiX /> : <FiCheck />}
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
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingUser ? 'Edit User' : 'Add User'}</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        disabled={!!editingUser}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                {!editingUser && (
                                    <div className="form-group">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required={!editingUser}
                                            minLength={6}
                                        />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <select
                                        className="form-input"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        {roles.map(r => (
                                            <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingUser ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;

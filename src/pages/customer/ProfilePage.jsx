import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiSave, FiCheck } from 'react-icons/fi';

const ProfilePage = () => {
    const { user, updateProfile, uploadAvatar } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPEG, PNG, etc.)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        const data = new FormData();
        data.append('avatar', file);

        setUploading(true);
        setError('');

        try {
            await uploadAvatar(data);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await updateProfile(formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page container">
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>My Profile</h1>

                <div className="card">
                    {/* Avatar */}
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 'var(--radius-full)',
                                    background: user?.avatar ? `url(${user.avatar}) center/cover` : 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
                                    color: 'white',
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--spacing-md)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onClick={() => document.getElementById('avatar-upload').click()}
                            >
                                {!user?.avatar && user?.name?.charAt(0).toUpperCase()}
                                {uploading && (
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }}></div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="avatar-upload"
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 16,
                                    right: 0,
                                    background: 'var(--white)',
                                    borderRadius: '50%',
                                    padding: 6,
                                    boxShadow: 'var(--shadow-md)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => document.getElementById('avatar-upload').click()}
                            >
                                <FiUser style={{ color: 'var(--primary-600)' }} />
                            </div>
                        </div>
                        <h3>{user?.name}</h3>
                        <p style={{ color: 'var(--gray-500)' }}>{user?.email}</p>
                        <span className="badge badge-primary" style={{ marginTop: 'var(--spacing-sm)' }}>
                            {user?.role?.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--error-500)',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            {error}
                        </div>
                    )}

                    {saved && (
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: 'var(--success-600)',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)'
                        }}>
                            <FiCheck /> Profile updated successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <FiUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ paddingLeft: 40 }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                <input
                                    type="email"
                                    className="form-input"
                                    value={user?.email}
                                    disabled
                                    style={{ paddingLeft: 40, background: 'var(--gray-100)' }}
                                />
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 4 }}>
                                Email cannot be changed
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <FiPhone style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    style={{ paddingLeft: 40 }}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : <><FiSave /> Save Changes</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

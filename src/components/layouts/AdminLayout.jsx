import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiHome, FiBox, FiShoppingBag, FiUsers, FiBarChart2,
    FiLogOut, FiSettings, FiTruck
} from 'react-icons/fi';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: FiBox, label: 'Products' },
        { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
        { path: '/admin/users', icon: FiUsers, label: 'Users' },
        { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    🚴 <span>Sonica</span> Admin
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}

                    <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--dark-border)' }}>
                        <Link to="/inventory" className="sidebar-link">
                            <FiBox size={20} />
                            Inventory Portal
                        </Link>
                        <Link to="/delivery" className="sidebar-link">
                            <FiTruck size={20} />
                            Delivery Portal
                        </Link>
                    </div>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--dark-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-sm)' }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--primary-500)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700
                        }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{user?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Administrator</div>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="sidebar-link w-full" style={{ cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}>
                        <FiLogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-with-sidebar" style={{ padding: 'var(--spacing-xl)' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

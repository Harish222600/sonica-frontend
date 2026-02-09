import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiPackage, FiAlertTriangle, FiLogOut } from 'react-icons/fi';

const InventoryLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/inventory', icon: FiHome, label: 'Dashboard', exact: true },
        { path: '/inventory/stock', icon: FiPackage, label: 'Stock Management' },
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
            <aside className="sidebar">
                <div className="sidebar-logo">
                    📦 <span>Inventory</span>
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
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--dark-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-sm)' }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--secondary-500)',
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
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Inventory Manager</div>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="sidebar-link w-full" style={{ cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}>
                        <FiLogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="main-with-sidebar" style={{ padding: 'var(--spacing-xl)' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default InventoryLayout;

import { Link, useLocation } from 'react-router-dom';
import { FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const DashboardSidebar = ({
    title,
    menuItems,
    user,
    logout,
    roleLabel,
    isCollapsed,
    toggleSidebar,
    isMobileOpen,
    toggleMobileSidebar,
    children
}) => {
    const location = useLocation();

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        {title}
                        {/* Mobile close button */}
                        <button
                            className="hidden-desktop btn btn-ghost btn-sm"
                            onClick={toggleMobileSidebar}
                            style={{ position: 'absolute', right: '10px', top: '20px' }}
                        >
                            <FiChevronLeft size={24} />
                        </button>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="sidebar-toggle hidden-mobile"
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                            title={isCollapsed ? item.label : ''}
                            onClick={() => isMobileOpen && toggleMobileSidebar()}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    {children}
                </nav>

                <div className="sidebar-footer">
                    <Link
                        to="/profile"
                        className="user-profile-link"
                        title={isCollapsed ? user?.name : ''}
                    >
                        <div className="user-avatar" style={{
                            backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none',
                            backgroundColor: user?.avatar ? 'transparent' : 'var(--primary-500)'
                        }}>
                            {!user?.avatar && user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user?.name}</div>
                            <div className="user-role">{roleLabel}</div>
                        </div>
                    </Link>

                    <button
                        onClick={logout}
                        className="sidebar-link logout-btn"
                        title={isCollapsed ? 'Logout' : ''}
                        style={{ cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left', width: '100%' }}
                    >
                        <FiLogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <style jsx>{`
                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                        width: 280px;
                        transition: transform 0.3s ease-in-out;
                        z-index: 1000;
                    }
                    .sidebar.mobile-open {
                        transform: translateX(0);
                    }
                    .sidebar-toggle.hidden-mobile {
                        display: none;
                    }
                    .hidden-desktop {
                        display: block;
                    }
                }
                @media (min-width: 769px) {
                    .hidden-desktop {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
};

export default DashboardSidebar;

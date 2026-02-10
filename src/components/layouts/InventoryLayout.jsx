import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import DashboardSidebar from '../common/DashboardSidebar';
import { useState } from 'react';
import { FiHome, FiPackage, FiMenu } from 'react-icons/fi';

const InventoryLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    const menuItems = [
        { path: '/inventory', icon: FiHome, label: 'Dashboard', exact: true },
        { path: '/inventory/stock', icon: FiPackage, label: 'Stock Management' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout-container">
            {/* Navbar Wrapper */}
            <div className={`admin-navbar-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
                <Navbar />
            </div>

            <DashboardSidebar
                title={
                    <>
                        📦 <span>Inventory</span>
                    </>
                }
                menuItems={menuItems}
                user={user}
                logout={handleLogout}
                roleLabel="Inventory Manager"
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                isMobileOpen={isMobileOpen}
                toggleMobileSidebar={toggleMobileSidebar}
            />

            <main
                className={`main-with-sidebar ${isCollapsed ? 'collapsed' : ''}`}
                style={{
                    padding: 'var(--spacing-xl)',
                }}
            >
                {/* Mobile Sidebar Toggle - Visible only on mobile */}
                <div className="hidden-desktop mb-md">
                    <button onClick={toggleMobileSidebar} className="btn btn-ghost btn-sm flex items-center gap-sm">
                        <FiMenu size={24} />
                        <span style={{ fontWeight: 600 }}>Inventory Menu</span>
                    </button>
                </div>

                <Outlet />
            </main>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black-50 z-40 hidden-desktop"
                    onClick={() => setIsMobileOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900 }}
                ></div>
            )}
        </div>
    );
};

export default InventoryLayout;

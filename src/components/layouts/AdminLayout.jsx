import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import DashboardSidebar from '../common/DashboardSidebar';
import { useState } from 'react';
import {
    FiHome, FiBox, FiShoppingBag, FiUsers, FiBarChart2,
    FiBox as FiInventory, FiTruck, FiMenu
} from 'react-icons/fi';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    const menuItems = [
        { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: FiBox, label: 'Products' },
        { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
        { path: '/admin/users', icon: FiUsers, label: 'Users' },
        { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
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
                        🚴 <span>SS Square</span> Admin
                    </>
                }
                menuItems={menuItems}
                user={user}
                logout={handleLogout}
                roleLabel="Administrator"
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
                        <span style={{ fontWeight: 600 }}>Admin Menu</span>
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

export default AdminLayout;

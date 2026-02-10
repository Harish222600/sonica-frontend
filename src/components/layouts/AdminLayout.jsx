import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import DashboardSidebar from '../common/DashboardSidebar';
import { useState } from 'react';
import {
    FiHome, FiBox, FiShoppingBag, FiUsers, FiBarChart2,
    FiBox as FiInventory, FiTruck
} from 'react-icons/fi';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

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
        <div>
            <div style={{
                marginLeft: isCollapsed ? '80px' : '260px',
                transition: 'margin-left var(--transition-base)'
            }}>
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
            />

            <main
                className="main-with-sidebar"
                style={{
                    padding: 'var(--spacing-xl)',
                    marginLeft: isCollapsed ? '80px' : '260px',
                    transition: 'margin-left var(--transition-base)'
                }}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

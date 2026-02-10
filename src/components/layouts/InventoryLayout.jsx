import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import DashboardSidebar from '../common/DashboardSidebar';
import { useState } from 'react';
import { FiHome, FiPackage } from 'react-icons/fi';

const InventoryLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const menuItems = [
        { path: '/inventory', icon: FiHome, label: 'Dashboard', exact: true },
        { path: '/inventory/stock', icon: FiPackage, label: 'Stock Management' },
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
                        📦 <span>Inventory</span>
                    </>
                }
                menuItems={menuItems}
                user={user}
                logout={handleLogout}
                roleLabel="Inventory Manager"
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

export default InventoryLayout;

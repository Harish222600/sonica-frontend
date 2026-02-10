import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../common/DashboardSidebar';
import { useState } from 'react';
import { FiHome, FiBarChart2 } from 'react-icons/fi';

const DeliveryLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const menuItems = [
        { path: '/delivery', icon: FiHome, label: 'My Deliveries', exact: true },
        { path: '/delivery/performance', icon: FiBarChart2, label: 'My Performance', exact: true },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <DashboardSidebar
                title={
                    <>
                        🚚 <span>Delivery</span>
                    </>
                }
                menuItems={menuItems}
                user={user}
                logout={handleLogout}
                roleLabel="Delivery Partner"
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

export default DeliveryLayout;

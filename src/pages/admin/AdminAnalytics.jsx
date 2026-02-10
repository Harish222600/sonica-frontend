import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import { FiUsers, FiDollarSign, FiPackage, FiTruck, FiTrendingUp, FiStar } from 'react-icons/fi';

const AdminAnalytics = () => {
    const [activeTab, setActiveTab] = useState('sales');
    const [salesData, setSalesData] = useState(null);
    const [usersData, setUsersData] = useState(null);
    const [inventoryData, setInventoryData] = useState(null);
    const [deliveryData, setDeliveryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'sales':
                    const sales = await analyticsAPI.getSales();
                    setSalesData(sales.data.data);
                    break;
                case 'users':
                    const users = await analyticsAPI.getUsers();
                    setUsersData(users.data.data);
                    break;
                case 'inventory':
                    const inventory = await analyticsAPI.getInventory();
                    setInventoryData(inventory.data.data);
                    break;
                case 'delivery':
                    const delivery = await analyticsAPI.getDelivery();
                    setDeliveryData(delivery.data.data);
                    break;
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { key: 'sales', label: 'Sales', icon: FiTrendingUp },
        { key: 'users', label: 'Users', icon: FiUsers },
        { key: 'inventory', label: 'Inventory', icon: FiPackage },
        { key: 'delivery', label: 'Delivery', icon: FiTruck },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Analytics</h1>

            {/* Tabs */}
            <div className="flex gap-sm flex-col-mobile overflow-x-auto-mobile" style={{ marginBottom: 'var(--spacing-xl)' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        <tab.icon /> {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card skeleton" style={{ height: 120 }}></div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Sales Tab */}
                    {activeTab === 'sales' && salesData && (
                        <div className="fade-in">
                            <div className="grid grid-4 grid-2-mobile" style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <div className="stat-card card">
                                    <p className="stat-label">Total Orders</p>
                                    <p className="stat-value">{salesData.totalOrders}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">Total Revenue</p>
                                    <p className="stat-value">₹{salesData.totalRevenue?.toLocaleString()}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">Pending Orders</p>
                                    <p className="stat-value">{(salesData.ordersByStatus?.created || 0) + (salesData.ordersByStatus?.paid || 0)}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">Completed</p>
                                    <p className="stat-value">{salesData.ordersByStatus?.completed || 0}</p>
                                </div>
                            </div>

                            <div className="grid grid-2 grid-1-mobile" style={{ gap: 'var(--spacing-xl)' }}>
                                <div className="card">
                                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Top Selling Products</h3>
                                    {salesData.topProducts?.length > 0 ? (
                                        <div>
                                            {salesData.topProducts.slice(0, 5).map((product, i) => (
                                                <div key={i} className="flex justify-between items-center" style={{
                                                    padding: 'var(--spacing-md)',
                                                    background: 'var(--gray-50)',
                                                    borderRadius: 'var(--radius-md)',
                                                    marginBottom: 'var(--spacing-sm)'
                                                }}>
                                                    <div className="flex items-center gap-md">
                                                        <span style={{ fontWeight: 700, color: 'var(--primary-500)' }}>#{i + 1}</span>
                                                        <div>
                                                            <p style={{ fontWeight: 600 }}>{product.name}</p>
                                                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{product.category}</p>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <p style={{ fontWeight: 600 }}>{product.totalQuantity} sold</p>
                                                        <p style={{ fontSize: '0.85rem', color: 'var(--success-600)' }}>₹{product.totalRevenue?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: 'var(--gray-500)', textAlign: 'center' }}>No sales data yet</p>
                                    )}
                                </div>

                                <div className="card">
                                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Sales by Category</h3>
                                    {salesData.salesByCategory?.length > 0 ? (
                                        <div>
                                            {salesData.salesByCategory.map((cat, i) => (
                                                <div key={i} style={{ marginBottom: 'var(--spacing-md)' }}>
                                                    <div className="flex justify-between" style={{ marginBottom: 4 }}>
                                                        <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{cat._id}</span>
                                                        <span style={{ color: 'var(--primary-600)' }}>₹{cat.revenue?.toLocaleString()}</span>
                                                    </div>
                                                    <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 'var(--radius-full)' }}>
                                                        <div style={{
                                                            width: `${(cat.revenue / salesData.totalRevenue) * 100}%`,
                                                            height: '100%',
                                                            background: 'var(--primary-500)',
                                                            borderRadius: 'var(--radius-full)'
                                                        }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: 'var(--gray-500)', textAlign: 'center' }}>No category data yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && usersData && (
                        <div className="fade-in">
                            <div className="grid grid-4 grid-2-mobile" style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <div className="stat-card card">
                                    <p className="stat-label">Total Users</p>
                                    <p className="stat-value">{usersData.totalUsers}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">Active Users</p>
                                    <p className="stat-value">{usersData.activeUsers}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">Inactive Users</p>
                                    <p className="stat-value">{usersData.inactiveUsers}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">New This Month</p>
                                    <p className="stat-value">{usersData.newUsersThisMonth}</p>
                                </div>
                            </div>

                            <div className="card">
                                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Users by Role</h3>
                                <div className="grid grid-4 grid-2-mobile">
                                    {Object.entries(usersData.usersByRole || {}).map(([role, count]) => (
                                        <div key={role} style={{
                                            padding: 'var(--spacing-lg)',
                                            background: 'var(--gray-50)',
                                            borderRadius: 'var(--radius-lg)',
                                            textAlign: 'center'
                                        }}>
                                            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-600)' }}>{count}</p>
                                            <p style={{ color: 'var(--gray-500)', textTransform: 'capitalize' }}>{role.replace('_', ' ')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inventory Tab */}
                    {activeTab === 'inventory' && inventoryData && (
                        <div className="fade-in">
                            <div className="grid grid-4 grid-2-mobile" style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <div className="stat-card card">
                                    <p className="stat-label">Total Products</p>
                                    <p className="stat-value">{inventoryData.totalProducts}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">Total Stock</p>
                                    <p className="stat-value">{inventoryData.totalStock}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">Low Stock</p>
                                    <p className="stat-value" style={{ color: 'var(--warning-500)' }}>{inventoryData.lowStockCount}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">Out of Stock</p>
                                    <p className="stat-value" style={{ color: 'var(--error-500)' }}>{inventoryData.outOfStockCount}</p>
                                </div>
                            </div>

                            <div className="card">
                                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Stock by Category</h3>
                                {Object.keys(inventoryData.categoryBreakdown || {}).length > 0 ? (
                                    <div className="grid grid-3 grid-1-mobile">
                                        {Object.entries(inventoryData.categoryBreakdown).map(([category, data]) => (
                                            <div key={category} style={{
                                                padding: 'var(--spacing-lg)',
                                                background: 'var(--gray-50)',
                                                borderRadius: 'var(--radius-lg)'
                                            }}>
                                                <h5 style={{ marginBottom: 'var(--spacing-sm)', textTransform: 'capitalize' }}>{category}</h5>
                                                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{data.count} products</p>
                                                <p style={{ fontWeight: 600 }}>{data.stock} units in stock</p>
                                                <p style={{ color: 'var(--success-600)', fontSize: '0.9rem' }}>Value: ₹{data.value?.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--gray-500)', textAlign: 'center' }}>No inventory data</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Delivery Tab */}
                    {activeTab === 'delivery' && deliveryData && (
                        <div className="fade-in">
                            <div className="grid grid-4 grid-2-mobile" style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <div className="stat-card card">
                                    <p className="stat-label">Total Deliveries</p>
                                    <p className="stat-value">{deliveryData.totalDeliveries}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">Avg Delivery Time</p>
                                    <p className="stat-value">{deliveryData.averageDeliveryTime} days</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">Delayed</p>
                                    <p className="stat-value" style={{ color: 'var(--warning-500)' }}>{deliveryData.delayedDeliveries}</p>
                                </div>
                                <div className="stat-card card">
                                    <p className="stat-label">In Transit</p>
                                    <p className="stat-value">{deliveryData.deliveriesByStatus?.shipped || 0}</p>
                                </div>
                            </div>

                            <div className="card">
                                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Delivery Partner Performance</h3>
                                {deliveryData.partnerPerformance?.length > 0 ? (
                                    <div className="table-container" style={{ overflowX: 'auto' }}>
                                        <table className="table" style={{ minWidth: '600px' }}>
                                            <thead>
                                                <tr>
                                                    <th>Partner</th>
                                                    <th>Total</th>
                                                    <th>Completed</th>
                                                    <th>Failed</th>
                                                    <th>Success Rate</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {deliveryData.partnerPerformance.map((partner, i) => (
                                                    <tr key={i}>
                                                        <td style={{ fontWeight: 600 }}>{partner.name}</td>
                                                        <td>{partner.totalDeliveries}</td>
                                                        <td style={{ color: 'var(--success-600)' }}>{partner.completed}</td>
                                                        <td style={{ color: 'var(--error-500)' }}>{partner.failed}</td>
                                                        <td>
                                                            <span className={`badge ${partner.successRate >= 90 ? 'badge-success' : partner.successRate >= 70 ? 'badge-warning' : 'badge-danger'}`}>
                                                                {partner.successRate?.toFixed(1)}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--gray-500)', textAlign: 'center' }}>No delivery data yet</p>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminAnalytics;

import { useState, useEffect } from 'react';
import { inventoryAPI } from '../../services/api';
import { FiPackage, FiAlertTriangle, FiTrendingDown, FiDollarSign, FiActivity } from 'react-icons/fi';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const InventoryDashboard = () => {
    const [data, setData] = useState(null);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [analyticsRes, lowStockRes] = await Promise.all([
                inventoryAPI.getAnalytics(),
                inventoryAPI.getLowStock()
            ]);
            setData(analyticsRes.data.data);
            setLowStock(lowStockRes.data.data);
        } catch (error) {
            console.error('Failed to fetch inventory data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Inventory Dashboard</h1>
                <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card skeleton" style={{ height: 120 }}></div>
                    ))}
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Total Products', value: data?.totalProducts || 0, icon: FiPackage, color: 'var(--secondary-500)' },
        { label: 'Total Stock', value: data?.totalStock || 0, icon: FiPackage, color: 'var(--success-500)' },
        { label: 'Inventory Value', value: `₹${data?.totalInventoryValue?.toLocaleString() || 0}`, icon: FiDollarSign, color: 'var(--primary-500)' },
        { label: 'Low Stock Items', value: data?.lowStockCount || 0, icon: FiAlertTriangle, color: 'var(--warning-500)' },
        { label: 'Out of Stock', value: data?.outOfStockCount || 0, icon: FiTrendingDown, color: 'var(--error-500)' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Inventory Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-5" style={{ marginBottom: 'var(--spacing-xl)', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--spacing-md)' }}>
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card card">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="stat-label">{stat.label}</p>
                                <p className="stat-value" style={{ fontSize: '1.5rem' }}>{stat.value}</p>
                            </div>
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 'var(--radius-lg)',
                                background: `${stat.color}20`,
                                color: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-2" style={{ marginBottom: 'var(--spacing-xl)', gap: 'var(--spacing-lg)' }}>
                {/* Stock Trend */}
                <div className="card" style={{ height: 400 }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Stock Value Trend (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={data?.stockTrend || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                            <Area type="monotone" dataKey="value" stroke="var(--primary-600)" fill="var(--primary-100)" name="Value" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="card" style={{ height: 400 }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Stock by Category</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={data?.categoryBreakdown || []}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {(data?.categoryBreakdown || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3>
                        <FiAlertTriangle style={{ color: 'var(--warning-500)', marginRight: 8 }} />
                        Low Stock Alerts
                    </h3>
                </div>

                {lowStock.length > 0 ? (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Current Stock</th>
                                    <th>Threshold</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStock.map((item) => (
                                    <tr key={item.product?._id || item._id}>
                                        <td>
                                            <div className="flex items-center gap-md">
                                                <img
                                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/40'}
                                                    alt=""
                                                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                                />
                                                <span style={{ fontWeight: 600 }}>{item.product?.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-secondary">{item.product?.category}</span>
                                        </td>
                                        <td style={{ fontWeight: 600, color: item.totalStock === 0 ? 'var(--error-500)' : 'var(--warning-500)' }}>
                                            {item.totalStock} units
                                        </td>
                                        <td>{item.lowStockThreshold} units</td>
                                        <td>
                                            <span className={`badge ${item.totalStock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                                                {item.totalStock === 0 ? 'Out of Stock' : 'Low Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--gray-500)' }}>
                        <FiPackage size={48} style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5 }} />
                        <p>No low stock alerts. All products are well stocked!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryDashboard;

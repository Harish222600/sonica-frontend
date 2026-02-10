import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../../services/api';
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign, FiTrendingUp, FiAlertTriangle, FiTruck, FiActivity, FiTarget } from 'react-icons/fi';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, ComposedChart, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await analyticsAPI.getDashboard();
            setData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Command Center</h1>
                <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card skeleton" style={{ height: 120 }}></div>
                    ))}
                </div>
            </div>
        );
    }

    const { overview, charts, pending, recentOrders } = data || {};

    const stats = [
        { label: 'Total Revenue', value: `₹${(overview?.totalRevenue || 0).toLocaleString()}`, sub: `+${overview?.growth?.revenue}%`, icon: FiDollarSign, color: 'var(--primary-500)' },
        { label: 'Total Orders', value: overview?.totalOrders, sub: `+${overview?.growth?.orders}%`, icon: FiShoppingBag, color: 'var(--secondary-500)' },
        { label: 'Total Users', value: overview?.totalUsers, sub: `+${overview?.growth?.users}%`, icon: FiUsers, color: 'var(--success-500)' },
        { label: 'Active Users', value: overview?.activeUsers, sub: 'Currently active', icon: FiActivity, color: 'var(--warning-500)' },
        { label: 'AOV', value: `₹${overview?.aov || 0}`, sub: 'Avg. Order Value', icon: FiTarget, color: 'var(--info-500)' },
        { label: 'Conversion', value: `${overview?.conversionRate}%`, sub: 'Visit to Purchase', icon: FiTrendingUp, color: 'var(--error-500)' },
    ];

    return (
        <div style={{ paddingBottom: 'var(--spacing-2xl)' }}>
            <div className="flex justify-between items-center flex-col-mobile items-start-mobile gap-md-mobile" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1>Command Center</h1>
                    <p style={{ color: 'var(--gray-500)' }}>Real-time overview of your business performance.</p>
                </div>
                <div className="flex gap-sm">
                    <button className="btn btn-primary" onClick={fetchDashboard}>Refresh Data</button>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-6 grid-2-mobile" style={{ marginBottom: 'var(--spacing-xl)', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card card">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="stat-label">{stat.label}</p>
                                <p className="stat-value" style={{ fontSize: '1.5rem' }}>{stat.value}</p>
                                <p style={{ fontSize: '0.8rem', color: stat.sub.includes('+') ? 'var(--success-600)' : 'var(--gray-500)' }}>
                                    {stat.sub}
                                </p>
                            </div>
                            <div style={{
                                width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                                background: `${stat.color}20`, color: stat.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-2 grid-1-mobile" style={{ marginBottom: 'var(--spacing-xl)', gap: 'var(--spacing-lg)' }}>
                {/* Revenue Trend */}
                <div className="card" style={{ height: 400 }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Revenue & Profit Trend (7 Days)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <ComposedChart data={charts?.revenueTrend || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="var(--primary-500)" barSize={20} radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="profit" name="Profit" stroke="var(--success-500)" strokeWidth={3} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Order Funnel */}
                <div className="card" style={{ height: 400 }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Fulfillment Funnel</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={charts?.funnel || []} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" barSize={30} radius={[0, 4, 4, 0]}>
                                {charts?.funnel?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-3 grid-1-mobile" style={{ marginBottom: 'var(--spacing-xl)', gap: 'var(--spacing-lg)' }}>
                {/* Customer Acquisition */}
                <div className="card" style={{ height: 300, gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Customer Growth</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={charts?.acquisition || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="users" stroke="var(--secondary-600)" fill="var(--secondary-100)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Pending Tasks */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Attention Needed</h3>
                    <div className="flex flex-col gap-md">
                        <div className="flex justify-between items-center p-md bg-warning-50 rounded-lg border-l-4 border-warning-500">
                            <div className="flex items-center gap-sm">
                                <FiShoppingBag className="text-warning-600" />
                                <span>Pending Orders</span>
                            </div>
                            <span className="font-bold text-lg">{pending?.orders || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-md bg-secondary-50 rounded-lg border-l-4 border-secondary-500">
                            <div className="flex items-center gap-sm">
                                <FiTruck className="text-secondary-600" />
                                <span>Pending Deliveries</span>
                            </div>
                            <span className="font-bold text-lg">{pending?.deliveries || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-md bg-error-50 rounded-lg border-l-4 border-error-500">
                            <div className="flex items-center gap-sm">
                                <FiAlertTriangle className="text-error-600" />
                                <span>Low Stock Alerts</span>
                            </div>
                            <span className="font-bold text-lg">{pending?.lowStock || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Recent Transactions</h3>
                    <Link to="/admin/orders" className="btn btn-ghost btn-sm">View All Orders</Link>
                </div>

                <div className="table-container" style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ minWidth: '600px' }}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders?.map((order) => (
                                <tr key={order._id}>
                                    <td className="font-semi">{order.orderNumber}</td>
                                    <td>{order.user?.name || 'Guest'}</td>
                                    <td>₹{order.totalAmount?.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${order.status === 'delivered' ? 'badge-success' :
                                            order.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

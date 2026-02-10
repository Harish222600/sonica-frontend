import { useState, useEffect } from 'react';
import { deliveryAPI, reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiDollarSign, FiCheck, FiActivity, FiClock, FiStar, FiUser } from 'react-icons/fi';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const DeliveryPerformance = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsRes, reviewsRes] = await Promise.all([
                    deliveryAPI.getStats(),
                    user ? reviewAPI.getByDelivery(user._id) : Promise.resolve({ data: { data: [] } })
                ]);
                setStats(statsRes.data.data);
                setReviews(reviewsRes.data.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    if (loading) {
        return (
            <div>
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>My Performance</h1>
                <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card skeleton" style={{ height: 120 }}></div>
                    ))}
                </div>
            </div>
        );
    }

    const { metrics, charts } = stats || {};

    return (
        <div style={{ paddingBottom: 'var(--spacing-2xl)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1>My Performance</h1>
                    <p style={{ color: 'var(--gray-500)' }}>Track your earnings, delivery success, and customer feedback.</p>
                </div>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh</button>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-5 grid-2-mobile" style={{ marginBottom: 'var(--spacing-xl)', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div className="stat-card card">
                    <p className="stat-label">Total Earnings</p>
                    <p className="stat-value" style={{ color: 'var(--primary-500)' }}>₹{metrics?.totalEarnings || 0}</p>
                    <FiDollarSign className="stat-icon" style={{ opacity: 0.2 }} />
                </div>
                <div className="stat-card card">
                    <p className="stat-label">Completed</p>
                    <p className="stat-value">{metrics?.totalDeliveries || 0}</p>
                    <FiCheck className="stat-icon" style={{ opacity: 0.2 }} />
                </div>
                <div className="stat-card card">
                    <p className="stat-label">Success Rate</p>
                    <p className="stat-value">{metrics?.successRate || 0}%</p>
                    <FiActivity className="stat-icon" style={{ opacity: 0.2 }} />
                </div>
                <div className="stat-card card">
                    <p className="stat-label">Avg Time</p>
                    <p className="stat-value" style={{ fontSize: '1.2rem' }}>{metrics?.avgDeliveryTime || '--'}</p>
                    <FiClock className="stat-icon" style={{ opacity: 0.2 }} />
                </div>
                <div className="stat-card card">
                    <p className="stat-label">Rating</p>
                    <div className="flex items-center gap-xs">
                        <p className="stat-value">{user?.rating?.average || metrics?.rating || 'N/A'}</p>
                        <FiStar style={{ fill: 'var(--warning-500)', color: 'var(--warning-500)' }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>({user?.rating?.count || 0} reviews)</p>
                    <FiStar className="stat-icon" style={{ opacity: 0.2, color: 'var(--warning-500)' }} />
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-2 grid-1-mobile" style={{ marginBottom: 'var(--spacing-xl)', gap: 'var(--spacing-lg)' }}>
                {/* Earnings History */}
                <div className="card" style={{ height: 350 }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Weekly Earnings</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={charts?.earningsHistory || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₹${value}`} />
                            <Bar dataKey="earnings" fill="var(--primary-500)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Distribution */}
                <div className="card" style={{ height: 350 }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Delivery Outcomes</h3>
                    <div className="flex items-center justify-center h-full">
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie
                                    data={charts?.statusDistribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(charts?.statusDistribution || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Reviews Section */}
            <div>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Recent Reviews</h3>
                {reviews.length === 0 ? (
                    <div className="card text-center p-xl">
                        <p style={{ color: 'var(--gray-500)' }}>No reviews yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-1 gap-md">
                        {reviews.map((review) => (
                            <div key={review._id} className="card">
                                <div className="flex justify-between items-start mb-sm">
                                    <div className="flex items-center gap-sm">
                                        {review.user?.avatar ? (
                                            <img src={review.user.avatar} alt="" className="avatar-sm" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                        ) : (
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FiUser />
                                            </div>
                                        )}
                                        <div>
                                            <p style={{ fontWeight: 600 }}>{review.user?.name || 'Customer'}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-xs badge badge-warning">
                                        <span style={{ fontWeight: 700 }}>{review.rating}</span> <FiStar style={{ fill: 'currentColor' }} />
                                    </div>
                                </div>
                                {review.title && <p style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>{review.title}</p>}
                                <p style={{ color: 'var(--gray-700)' }}>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryPerformance;

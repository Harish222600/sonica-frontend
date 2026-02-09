import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw, FiAward, FiHeart, FiZap } from 'react-icons/fi';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCustomers: 0,
        avgRating: '0.0',
        citiesDelivered: 0
    });
    const [loading, setLoading] = useState(true);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    // Category icons and colors mapping
    const categoryMeta = {
        'mountain': { icon: '🏔️', color: '#22c55e' },
        'road': { icon: '🛣️', color: '#3b82f6' },
        'electric': { icon: '⚡', color: '#eab308' },
        'hybrid': { icon: '🔄', color: '#8b5cf6' },
        'kids': { icon: '👶', color: '#ec4899' },
        'accessories': { icon: '🔧', color: '#6b7280' },
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [featuredRes, categoriesRes, statsRes] = await Promise.all([
                productAPI.getFeatured(),
                productAPI.getCategories(),
                productAPI.getStats()
            ]);
            setFeaturedProducts(featuredRes.data.data || []);
            setCategories(categoriesRes.data.data || []);
            // Ensure stats is always an object with expected properties
            const apiStats = statsRes.data.data || {};
            setStats({
                totalProducts: apiStats.totalProducts || 0,
                totalCustomers: apiStats.totalCustomers || 0,
                avgRating: apiStats.avgRating || '0.0',
                citiesDelivered: apiStats.citiesDelivered || 0
            });
        } catch (error) {
            console.error('Failed to fetch homepage data:', error);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over ₹10,000', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
        { icon: FiShield, title: '2 Year Warranty', desc: 'Full coverage guarantee', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
        { icon: FiRefreshCw, title: '30 Day Returns', desc: 'No questions asked', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
    ];

    const heroStats = [
        { value: stats.totalCustomers > 0 ? `${stats.totalCustomers}+` : '0', label: 'Happy Riders' },
        { value: stats.totalProducts > 0 ? `${stats.totalProducts}+` : '0', label: 'Bicycle Models' },
        { value: stats.avgRating, label: 'Average Rating' },
        { value: stats.citiesDelivered > 0 ? `${stats.citiesDelivered}+` : '0', label: 'Cities Delivered' },
    ];

    return (
        <div>
            {/* Hero Section - Premium */}
            <section className="hero-premium" style={{ minHeight: '85vh' }}>
                {/* Animated particles background */}
                <div className="particles">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 15}s`,
                                animationDuration: `${15 + Math.random() * 10}s`
                            }}
                        />
                    ))}
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="hero-content">
                        <div className="fade-in">
                            <span className="badge badge-primary" style={{
                                marginBottom: 'var(--spacing-lg)',
                                background: 'rgba(249, 115, 22, 0.2)',
                                border: '1px solid var(--primary-500)'
                            }}>
                                <FiZap /> New 2024 Collection Available
                            </span>
                            <h1 className="hero-title" style={{ color: 'white' }}>
                                Ride Into <span className="gradient-text">Adventure</span> <br />
                                With Premium Bikes
                            </h1>
                            <p className="hero-subtitle">
                                Discover our collection of high-performance bicycles crafted for
                                every terrain and every rider. From mountain trails to city streets.
                            </p>
                            <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                                <Link to="/products" className="btn btn-primary btn-lg btn-ripple glow">
                                    <span>Shop Now</span> <FiArrowRight />
                                </Link>
                                <Link to="/products?category=electric" className="btn btn-lg glass-premium" style={{ color: 'white' }}>
                                    Explore Electric
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-xl stagger">
                                {heroStats.map((stat, i) => (
                                    <div key={i} style={{ textAlign: 'center' }}>
                                        <p style={{
                                            fontSize: '2rem',
                                            fontWeight: 800,
                                            color: 'white',
                                            lineHeight: 1
                                        }}>{stat.value}</p>
                                        <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }} className="float">
                            <div style={{
                                fontSize: '14rem',
                                filter: 'drop-shadow(0 20px 60px rgba(249, 115, 22, 0.4))',
                            }}>
                                🚴
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories - With hover effects */}
            <section className="page container">
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }} className="fade-in">
                    <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
                        Shop by Category
                    </h2>
                    <p style={{ color: 'var(--gray-500)', maxWidth: 500, margin: '0 auto' }}>
                        Find the perfect bike for your riding style
                    </p>
                </div>

                <div className="grid stagger" style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(categories.length, 5))}, 1fr)`, gap: 'var(--spacing-lg)' }}>
                    {categories.length > 0 ? categories.map((cat) => {
                        const meta = categoryMeta[cat.name?.toLowerCase()] || { icon: '🚲', color: '#6b7280' };
                        return (
                            <Link
                                key={cat.name}
                                to={`/products?category=${cat.name?.toLowerCase()}`}
                                className="feature-card hover-lift"
                                style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}
                            >
                                <div className="feature-icon" style={{
                                    fontSize: '2.5rem',
                                    background: `${meta.color}15`,
                                    width: 80,
                                    height: 80,
                                }}>
                                    {meta.icon}
                                </div>
                                <h4 style={{ marginTop: 'var(--spacing-md)', textTransform: 'capitalize' }}>{cat.name}</h4>
                                <span className="badge badge-secondary" style={{ marginTop: 'var(--spacing-sm)' }}>
                                    {cat.count} bikes
                                </span>
                            </Link>
                        );
                    }) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                            <p style={{ color: 'var(--gray-500)' }}>Loading categories...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products - Premium cards */}
            <section className="container" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem' }}>Featured <span className="gradient-text">Bicycles</span></h2>
                        <p style={{ color: 'var(--gray-500)' }}>Our most popular picks handcrafted for excellence</p>
                    </div>
                    <Link to="/products" className="btn btn-outline btn-ripple">
                        View All <FiArrowRight />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="card">
                                <div className="skeleton shimmer" style={{ aspectRatio: '1', marginBottom: 'var(--spacing-md)' }}></div>
                                <div className="skeleton" style={{ height: 20, marginBottom: 'var(--spacing-sm)' }}></div>
                                <div className="skeleton" style={{ height: 16, width: '60%' }}></div>
                            </div>
                        ))}
                    </div>
                ) : featuredProducts.length > 0 ? (
                    <div className="grid grid-4 stagger">
                        {featuredProducts.slice(0, 8).map((product) => (
                            <Link
                                key={product._id}
                                to={`/products/${product._id}`}
                                className="product-card-premium card"
                                onMouseEnter={() => setHoveredProduct(product._id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            >
                                {/* Discount badge */}
                                {product.discountPrice > 0 && product.discountPrice < product.price && (
                                    <span style={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 12,
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        zIndex: 3
                                    }}>
                                        {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                                    </span>
                                )}

                                {/* Wishlist button */}
                                <button
                                    className="btn btn-icon"
                                    style={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        background: 'white',
                                        boxShadow: 'var(--shadow-md)',
                                        zIndex: 3,
                                        opacity: hoveredProduct === product._id ? 1 : 0,
                                        transform: hoveredProduct === product._id ? 'scale(1)' : 'scale(0.8)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <FiHeart />
                                </button>

                                <div className="img-zoom-container" style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=Bicycle'}
                                        alt={product.name}
                                        style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                                    />
                                </div>

                                <div style={{ padding: 'var(--spacing-sm)' }}>
                                    <span className="badge badge-primary" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                        {product.category}
                                    </span>
                                    <h4 className="product-name underline-animate" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                        {product.name}
                                    </h4>
                                    <div className="flex justify-between items-center">
                                        <div className="product-price">
                                            <span className="current" style={{ fontSize: '1.25rem' }}>
                                                ₹{(product.discountPrice || product.price).toLocaleString()}
                                            </span>
                                            {product.discountPrice > 0 && product.discountPrice < product.price && (
                                                <span className="original">₹{product.price.toLocaleString()}</span>
                                            )}
                                        </div>
                                        {product.ratings?.count > 0 && (
                                            <div className="flex items-center gap-sm" style={{ color: 'var(--warning-500)' }}>
                                                <FiStar fill="currentColor" size={14} />
                                                <span style={{ fontWeight: 600 }}>{product.ratings.average.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center" style={{ padding: 'var(--spacing-3xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🚲</div>
                        <h3>No products yet</h3>
                        <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--spacing-lg)' }}>
                            Please run the seed script to populate sample data
                        </p>
                        <Link to="/products" className="btn btn-primary">
                            Browse All Products
                        </Link>
                    </div>
                )}
            </section>

            {/* Features - Premium design */}
            <section style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: 'var(--spacing-3xl) 0'
            }}>
                <div className="container">
                    <div className="grid grid-3 stagger">
                        {features.map((feature, i) => (
                            <div key={i} className="glass-premium hover-lift" style={{
                                padding: 'var(--spacing-xl)',
                                borderRadius: 'var(--radius-2xl)',
                                color: 'white'
                            }}>
                                <div style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 'var(--radius-xl)',
                                    background: feature.gradient,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 'var(--spacing-lg)',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                                }}>
                                    <feature.icon size={28} />
                                </div>
                                <h4 style={{ marginBottom: 'var(--spacing-sm)', color: 'white' }}>{feature.title}</h4>
                                <p style={{ color: 'var(--gray-400)', fontSize: '0.95rem' }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
                <div className="grid grid-2" style={{ gap: 'var(--spacing-3xl)', alignItems: 'center' }}>
                    <div className="fade-in">
                        <span className="badge badge-primary" style={{ marginBottom: 'var(--spacing-md)' }}>
                            <FiAward /> Why Choose Us
                        </span>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-lg)' }}>
                            Quality That <span className="gradient-text">Speaks</span> For Itself
                        </h2>
                        <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-xl)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                            At Sonica Bicycles, we believe every ride should be extraordinary.
                            Our expert craftsmen combine cutting-edge technology with traditional
                            craftsmanship to create bicycles that perform as beautifully as they look.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                            {[
                                { icon: '🏆', title: 'Award Winning', desc: 'Best Bicycle Brand 2024' },
                                { icon: '🔧', title: 'Expert Service', desc: 'Free lifetime tune-ups' },
                                { icon: '🌍', title: 'Eco Friendly', desc: 'Sustainable materials' },
                                { icon: '💯', title: 'Satisfaction', desc: '100% money back guarantee' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-md hover-scale" style={{ cursor: 'default' }}>
                                    <div style={{
                                        fontSize: '2rem',
                                        width: 50,
                                        height: 50,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--gray-100)',
                                        borderRadius: 'var(--radius-lg)'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h5 style={{ fontWeight: 600 }}>{item.title}</h5>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="float" style={{ textAlign: 'center' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary-100), var(--secondary-100))',
                            borderRadius: 'var(--radius-2xl)',
                            padding: 'var(--spacing-2xl)',
                            position: 'relative'
                        }}>
                            <div style={{ fontSize: '15rem' }}>🚵</div>
                            <div className="glow" style={{
                                position: 'absolute',
                                bottom: -20,
                                left: '10%',
                                right: '10%',
                                height: 40,
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--primary-500)',
                                filter: 'blur(30px)',
                                opacity: 0.5
                            }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA - Premium gradient */}
            <section className="container" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
                <div className="gradient-border" style={{
                    background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)',
                    color: 'white',
                    textAlign: 'center',
                    padding: 'var(--spacing-3xl)',
                    borderRadius: 'var(--radius-2xl)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Background decoration */}
                    <div style={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 300,
                        height: 300,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        bottom: -50,
                        left: -50,
                        width: 200,
                        height: 200,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>
                            Ready to Start Your Journey?
                        </h2>
                        <p style={{ maxWidth: 600, margin: 'var(--spacing-md) auto var(--spacing-xl)', opacity: 0.9, fontSize: '1.1rem' }}>
                            Join thousands of happy cyclists who found their perfect ride with Sonica Bicycles.
                            Create your free account today and get exclusive deals!
                        </p>
                        <div className="flex gap-md justify-center">
                            <Link to="/register" className="btn btn-lg btn-3d" style={{
                                background: 'white',
                                color: 'var(--primary-600)',
                                boxShadow: '0 6px 0 var(--gray-300), 0 8px 20px rgba(0,0,0,0.3)'
                            }}>
                                Create Free Account
                            </Link>
                            <Link to="/products" className="btn btn-lg glass-premium" style={{ color: 'white' }}>
                                Browse Collection
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;

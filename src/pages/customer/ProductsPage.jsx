import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { FiSearch, FiFilter, FiStar, FiX, FiHeart, FiShoppingCart, FiGrid, FiList } from 'react-icons/fi';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [hoveredProduct, setHoveredProduct] = useState(null);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || '-createdAt'
    });

    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const categories = [
        { slug: 'mountain', icon: '🏔️', label: 'Mountain' },
        { slug: 'road', icon: '🛣️', label: 'Road' },
        { slug: 'electric', icon: '⚡', label: 'Electric' },
        { slug: 'hybrid', icon: '🔄', label: 'Hybrid' },
        { slug: 'kids', icon: '👶', label: 'Kids' },
        { slug: 'accessories', icon: '🎒', label: 'Accessories' }
    ];

    // Sync local filters state with URL search params
    useEffect(() => {
        setFilters({
            search: searchParams.get('search') || '',
            category: searchParams.get('category') || '',
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            sort: searchParams.get('sort') || '-createdAt'
        });
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = Object.fromEntries(searchParams.entries());
            const response = await productAPI.getAll(params);
            setProducts(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateSearchParams({ ...filters, page: 1 });
    };

    const updateSearchParams = (newFilters) => {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: '-createdAt' });
        setSearchParams({});
    };

    return (
        <div className="page container">
            {/* Page Header with Gradient */}
            <div className="fade-in" style={{
                textAlign: 'center',
                marginBottom: 'var(--spacing-2xl)',
                padding: 'var(--spacing-2xl) 0'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
                    Discover <span className="gradient-text">Premium</span> Bicycles
                </h1>
                <p style={{ color: 'var(--gray-500)', maxWidth: 500, margin: '0 auto' }}>
                    {pagination.total} high-quality bikes for every adventure
                </p>
            </div>

            {/* Search Bar - Premium */}
            <form onSubmit={handleSearch} style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="glass-premium" style={{
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-2xl)',
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    alignItems: 'center',
                    background: 'white',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <FiSearch style={{
                            position: 'absolute',
                            left: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--gray-400)',
                            fontSize: '1.25rem'
                        }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search bicycles, accessories..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            style={{
                                paddingLeft: 50,
                                border: 'none',
                                background: 'var(--gray-50)',
                                borderRadius: 'var(--radius-xl)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-ripple" style={{ padding: '12px 24px' }}>
                        Search
                    </button>
                    <button
                        type="button"
                        className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FiFilter /> Filters
                    </button>
                </div>
            </form>

            {/* Filters - Expandable */}
            {showFilters && (
                <div className="card fade-in hover-lift" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div className="grid grid-4 grid-1-mobile" style={{ gap: 'var(--spacing-md)' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Category</label>
                            <select
                                className="form-input"
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.slug} value={cat.slug}>
                                        {cat.icon} {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Min Price</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="₹0"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Max Price</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="₹999999"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Sort By</label>
                            <select
                                className="form-input"
                                value={filters.sort}
                                onChange={(e) => {
                                    setFilters({ ...filters, sort: e.target.value });
                                    updateSearchParams({ ...filters, sort: e.target.value });
                                }}
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                                <option value="-ratings.average">Top Rated</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-md flex-col-mobile" style={{ marginTop: 'var(--spacing-lg)' }}>
                        <button
                            type="button"
                            className="btn btn-primary btn-ripple"
                            onClick={() => updateSearchParams({ ...filters, page: 1 })}
                        >
                            Apply Filters
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={clearFilters}>
                            <FiX /> Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Category Pills - Scrollable */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-sm)',
                overflowX: 'auto',
                paddingBottom: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <button
                    className={`btn ${!filters.category ? 'btn-primary glow' : 'btn-outline'}`}
                    onClick={() => updateSearchParams({ ...filters, category: '' })}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    ✨ All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.slug}
                        className={`btn ${filters.category === cat.slug ? 'btn-primary glow' : 'btn-outline'}`}
                        onClick={() => updateSearchParams({ ...filters, category: filters.category === cat.slug ? '' : cat.slug })}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            {/* View Toggle & Results Count */}
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <p style={{ color: 'var(--gray-500)' }}>
                    Showing <strong>{products.length}</strong> of <strong>{pagination.total}</strong> products
                </p>
                <div className="flex gap-sm">
                    <button
                        className={`btn btn-icon ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <FiGrid />
                    </button>
                    <button
                        className={`btn btn-icon ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setViewMode('list')}
                    >
                        <FiList />
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-4 grid-1-mobile">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="card">
                            <div className="skeleton shimmer" style={{ aspectRatio: '1', marginBottom: 'var(--spacing-md)' }}></div>
                            <div className="skeleton" style={{ height: 20, marginBottom: 'var(--spacing-sm)' }}></div>
                            <div className="skeleton" style={{ height: 16, width: '60%' }}></div>
                        </div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <>
                    <div className={viewMode === 'grid' ? 'grid grid-4 grid-1-mobile stagger' : 'stagger'} style={{ gap: 'var(--spacing-lg)' }}>
                        {products.map((product) => (
                            <Link
                                key={product._id}
                                to={`/products/${product._id}`}
                                className={`product-card-premium card hover-lift ${viewMode === 'list' ? 'flex items-center gap-lg flex-col-mobile' : ''}`}
                                onMouseEnter={() => setHoveredProduct(product._id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                style={viewMode === 'list' ? { flexDirection: 'row', marginBottom: 'var(--spacing-md)' } : {}}
                            >
                                {/* Image Container */}
                                <div className="img-zoom-container" style={{
                                    position: 'relative',
                                    ...(viewMode === 'list' ? { width: 200, minWidth: 200 } : { marginBottom: 'var(--spacing-md)' })
                                }}>
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=Bicycle'}
                                        alt={product.name}
                                        style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                                    />

                                    {/* Badges */}
                                    {product.stock === 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            background: 'var(--error-500)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                            Out of Stock
                                        </span>
                                    )}
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
                                            fontWeight: 700
                                        }}>
                                            {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                                        </span>
                                    )}

                                    {/* Quick Actions */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 12,
                                        right: 12,
                                        display: 'flex',
                                        gap: 8,
                                        opacity: hoveredProduct === product._id ? 1 : 0,
                                        transform: hoveredProduct === product._id ? 'translateY(0)' : 'translateY(10px)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <button
                                            className="btn btn-icon btn-sm"
                                            style={{ background: 'white', boxShadow: 'var(--shadow-md)' }}
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <FiHeart />
                                        </button>
                                        <button
                                            className="btn btn-icon btn-sm btn-primary"
                                            style={{ boxShadow: 'var(--shadow-md)' }}
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <FiShoppingCart />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, padding: viewMode === 'list' ? '0' : 'var(--spacing-sm)' }}>
                                    <span className="badge badge-primary" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                        {product.category}
                                    </span>
                                    <h4 className="product-name underline-animate" style={{
                                        marginBottom: 'var(--spacing-sm)',
                                        fontSize: viewMode === 'list' ? '1.25rem' : '1rem'
                                    }}>
                                        {product.name}
                                    </h4>

                                    {viewMode === 'list' && (
                                        <p style={{
                                            color: 'var(--gray-500)',
                                            fontSize: '0.9rem',
                                            marginBottom: 'var(--spacing-md)',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {product.description}
                                        </p>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <div className="product-price">
                                            <span className="current" style={{ fontSize: viewMode === 'list' ? '1.5rem' : '1.25rem' }}>
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
                                                <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                                                    ({product.ratings.count})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination - Premium */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center items-center gap-md flex-col-mobile" style={{ marginTop: 'var(--spacing-3xl)' }}>
                            <button
                                className="btn btn-outline"
                                disabled={pagination.page === 1}
                                onClick={() => updateSearchParams({ ...filters, page: pagination.page - 1 })}
                            >
                                Previous
                            </button>
                            <div className="flex gap-sm">
                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`btn btn-sm ${pagination.page === i + 1 ? 'btn-primary glow' : 'btn-ghost'}`}
                                        onClick={() => updateSearchParams({ ...filters, page: i + 1 })}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="btn btn-outline"
                                disabled={pagination.page === pagination.pages}
                                onClick={() => updateSearchParams({ ...filters, page: pagination.page + 1 })}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="card text-center" style={{ padding: 'var(--spacing-3xl)' }}>
                    <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-lg)' }}>🔍</div>
                    <h3>No products found</h3>
                    <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--spacing-lg)', maxWidth: 400, margin: '0 auto var(--spacing-lg)' }}>
                        We couldn't find any products matching your criteria. Try adjusting your filters.
                    </p>
                    <button className="btn btn-primary btn-ripple" onClick={clearFilters}>
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;

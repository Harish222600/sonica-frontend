import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, reviewAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiStar, FiShoppingCart, FiCheck, FiMinus, FiPlus, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await productAPI.getById(id);
            setProduct(response.data.data);
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await reviewAPI.getByProduct(id, { limit: 10 });
            setReviews(response.data.data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        setAddingToCart(true);
        try {
            console.log('Adding to cart:', product._id, quantity);
            await addToCart(product._id, quantity);
            toast.success('Added to cart successfully!');
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="page container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)' }}>
                    <div className="skeleton" style={{ aspectRatio: '1' }}></div>
                    <div>
                        <div className="skeleton" style={{ height: 40, marginBottom: 'var(--spacing-md)' }}></div>
                        <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 'var(--spacing-lg)' }}></div>
                        <div className="skeleton" style={{ height: 100, marginBottom: 'var(--spacing-lg)' }}></div>
                        <div className="skeleton" style={{ height: 48 }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page container text-center">
                <h2>Product not found</h2>
                <Link to="/products" className="btn btn-primary mt-lg">Back to Products</Link>
            </div>
        );
    }

    const price = product.discountPrice || product.price;
    const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

    return (
        <div className="page container">
            <Link to="/products" className="btn btn-ghost" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <FiArrowLeft /> Back to Products
            </Link>

            <div className="grid grid-2 grid-1-mobile" style={{ gap: 'var(--spacing-2xl)' }}>
                {/* Images */}
                <div>
                    <div className="card" style={{ overflow: 'hidden', marginBottom: 'var(--spacing-md)' }}>
                        <img
                            src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x600?text=Bicycle'}
                            alt={product.name}
                            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                        />
                    </div>
                    {product.images?.length > 1 && (
                        <div className="flex gap-sm" style={{ overflowX: 'auto', paddingBottom: 'var(--spacing-sm)' }}>
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden',
                                        border: selectedImage === i ? '3px solid var(--primary-500)' : '3px solid transparent',
                                        cursor: 'pointer',
                                        padding: 0,
                                        flexShrink: 0
                                    }}
                                >
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div>
                    <span className="badge badge-primary">{product.category}</span>
                    <h1 style={{ marginTop: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>{product.name}</h1>

                    {product.ratings?.count > 0 && (
                        <div className="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <div className="flex items-center gap-sm" style={{ color: 'var(--warning-500)' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FiStar
                                        key={star}
                                        fill={star <= Math.round(product.ratings.average) ? 'currentColor' : 'none'}
                                        size={18}
                                    />
                                ))}
                            </div>
                            <span style={{ color: 'var(--gray-500)' }}>
                                {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
                            </span>
                        </div>
                    )}

                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <div className="flex items-center gap-md">
                            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                                ₹{price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span style={{ fontSize: '1.25rem', color: 'var(--gray-400)', textDecoration: 'line-through' }}>
                                        ₹{product.price.toLocaleString()}
                                    </span>
                                    <span className="badge badge-success">
                                        {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 'var(--spacing-lg)' }}>
                        {product.description}
                    </p>

                    {/* Specifications */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="card" style={{ marginBottom: 'var(--spacing-lg)', background: 'var(--gray-50)' }}>
                            <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Specifications</h4>
                            <div className="grid grid-2 grid-1-mobile" style={{ gap: 'var(--spacing-sm)' }}>
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} className="flex justify-between" style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--gray-200)' }}>
                                        <span style={{ color: 'var(--gray-500)', textTransform: 'capitalize' }}>{key}</span>
                                        <span style={{ fontWeight: 600 }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stock & Add to Cart */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        {product.stock > 0 ? (
                            <p style={{ color: 'var(--success-600)', fontWeight: 600 }}>
                                <FiCheck /> In Stock ({product.stock} available)
                            </p>
                        ) : (
                            <p style={{ color: 'var(--error-500)', fontWeight: 600 }}>Out of Stock</p>
                        )}
                    </div>

                    {product.stock > 0 && (
                        <div className="flex gap-md flex-col-mobile" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <div className="flex items-center justify-center" style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-lg)' }}>
                                <button
                                    className="btn btn-ghost btn-icon"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <FiMinus />
                                </button>
                                <span style={{ width: 50, textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
                                <button
                                    className="btn btn-ghost btn-icon"
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                >
                                    <FiPlus />
                                </button>
                            </div>

                            <button
                                className="btn btn-primary btn-lg"
                                style={{ flex: 1 }}
                                onClick={handleAddToCart}
                                disabled={addingToCart || addedToCart}
                            >
                                {addedToCart ? (
                                    <><FiCheck /> Added to Cart</>
                                ) : addingToCart ? (
                                    'Adding...'
                                ) : (
                                    <><FiShoppingCart /> Add to Cart</>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Features */}
                    <div className="grid grid-2 grid-1-mobile" style={{ gap: 'var(--spacing-md)' }}>
                        <div className="flex items-center gap-md" style={{ padding: 'var(--spacing-md)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
                            <FiTruck size={24} style={{ color: 'var(--primary-500)' }} />
                            <div>
                                <div style={{ fontWeight: 600 }}>Free Delivery</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>On orders over ₹10,000</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-md" style={{ padding: 'var(--spacing-md)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
                            <FiShield size={24} style={{ color: 'var(--primary-500)' }} />
                            <div>
                                <div style={{ fontWeight: 600 }}>2 Year Warranty</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Full coverage</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <section style={{ marginTop: 'var(--spacing-3xl)' }}>
                <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Customer Reviews</h2>

                {reviews.length > 0 ? (
                    <div className="grid grid-2 grid-1-mobile" style={{ gap: 'var(--spacing-lg)' }}>
                        {reviews.map((review) => (
                            <div key={review._id} className="card">
                                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <div className="flex items-center gap-md">
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 'var(--radius-full)',
                                            background: 'var(--primary-100)',
                                            color: 'var(--primary-600)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700
                                        }}>
                                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{review.user?.name || 'Anonymous'}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-xs" style={{ color: 'var(--warning-500)' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <FiStar key={star} fill={star <= review.rating ? 'currentColor' : 'none'} size={16} />
                                        ))}
                                    </div>
                                </div>
                                {review.title && <h5 style={{ marginBottom: 'var(--spacing-sm)' }}>{review.title}</h5>}
                                <p style={{ color: 'var(--gray-600)' }}>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                        <p style={{ color: 'var(--gray-500)' }}>No reviews yet. Be the first to review this product!</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProductDetailPage;

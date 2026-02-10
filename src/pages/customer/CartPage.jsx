import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, loading } = useCart();

    if (loading) {
        return (
            <div className="page container">
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Shopping Cart</h1>
                <div className="card">
                    <div className="skeleton" style={{ height: 100, marginBottom: 'var(--spacing-md)' }}></div>
                    <div className="skeleton" style={{ height: 100, marginBottom: 'var(--spacing-md)' }}></div>
                    <div className="skeleton" style={{ height: 100 }}></div>
                </div>
            </div>
        );
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="page container text-center">
                <div style={{ maxWidth: 400, margin: '0 auto' }}>
                    <div style={{ fontSize: '6rem', marginBottom: 'var(--spacing-lg)' }}>🛒</div>
                    <h2>Your cart is empty</h2>
                    <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--spacing-xl)' }}>
                        Looks like you haven't added any bicycles yet.
                    </p>
                    <Link to="/products" className="btn btn-primary btn-lg">
                        <FiShoppingBag /> Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page container">
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Shopping Cart</h1>

            <div className="grid grid-3 grid-1-mobile" style={{ gap: 'var(--spacing-xl)' }}>
                {/* Cart Items */}
                <div style={{ gridColumn: 'span 2' }}>
                    {cart.items.map((item) => (
                        <div key={item.product._id} className="card flex flex-col-mobile items-center gap-lg" style={{
                            marginBottom: 'var(--spacing-md)',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <img
                                src={item.product.images?.[0] || 'https://via.placeholder.com/100x100?text=Bicycle'}
                                alt={item.product.name}
                                style={{ width: 100, height: 100, aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                            />

                            <div style={{ flex: 1 }}>
                                <Link to={`/products/${item.product._id}`} style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                                    {item.product.name}
                                </Link>
                                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 4 }}>
                                    {item.product.category}
                                </p>
                                <p style={{ fontWeight: 600, color: 'var(--primary-600)', marginTop: 'var(--spacing-sm)' }}>
                                    ₹{(item.price).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-md w-full-mobile justify-between-mobile">
                                <div className="flex items-center" style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-lg)' }}>
                                    <button
                                        className="btn btn-ghost btn-icon btn-sm"
                                        onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                                        disabled={item.quantity <= 1}
                                    >
                                        <FiMinus size={14} />
                                    </button>
                                    <span style={{ width: 32, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                                    <button
                                        className="btn btn-ghost btn-icon btn-sm"
                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                    >
                                        <FiPlus size={14} />
                                    </button>
                                </div>

                                <div style={{ fontWeight: 700, minWidth: 100, textAlign: 'right' }}>
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </div>

                                <button
                                    className="btn btn-ghost btn-icon"
                                    style={{ color: 'var(--error-500)' }}
                                    onClick={() => removeFromCart(item.product._id)}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div style={{ gridColumn: 'span 1' }}>
                    <div className="card" style={{ position: 'sticky', top: 100 }}>
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Summary</h3>

                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <div className="flex justify-between" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                <span style={{ color: 'var(--gray-500)' }}>Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                <span>₹{cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                <span style={{ color: 'var(--gray-500)' }}>Shipping</span>
                                <span style={{ color: 'var(--success-600)' }}>
                                    ₹{cart.items.reduce((sum, item) => sum + ((item.shippingFees || 0) * item.quantity), 0).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between" style={{
                            padding: 'var(--spacing-md) 0',
                            borderTop: '2px solid var(--gray-100)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-600)' }}>
                                ₹{cart.totalAmount.toLocaleString()}
                            </span>
                        </div>

                        <Link to="/checkout" className="btn btn-primary btn-lg w-full">
                            Proceed to Checkout <FiArrowRight />
                        </Link>

                        <Link to="/products" className="btn btn-ghost w-full" style={{ marginTop: 'var(--spacing-md)' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, paymentAPI } from '../../services/api';
import { FiMapPin, FiCreditCard, FiCheck, FiLock } from 'react-icons/fi';

const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: user?.phone || ''
    });

    useEffect(() => {
        if (!cart.items || cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Create order
            const orderResponse = await orderAPI.create({
                items: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: address
            });

            const order = orderResponse.data.data;

            // Create Razorpay order
            const paymentResponse = await paymentAPI.createOrder(order._id);
            const razorpayOrder = paymentResponse.data.data;

            // Open Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'SS Square Industries',
                description: `Order #${order.orderNumber}`,
                order_id: razorpayOrder.orderId,
                handler: async (response) => {
                    try {
                        // Verify payment
                        await paymentAPI.verify({
                            orderId: order._id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        await clearCart();
                        toast.success('Payment successful! Order placed.');
                        navigate(`/orders/${order._id}?success=true`);
                    } catch (error) {
                        toast.error('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: address.phone
                },
                theme: {
                    color: '#f97316'
                },
                image: 'https://cdn.razorpay.com/logos/GhRQcyean79PqE_medium.png', // Public placeholder to prevent CORS/mixed content issues with localhost
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to process payment');
        } finally {
            setLoading(false);
        }
    };

    const total = cart.totalAmount;

    return (
        <div className="page container">
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Checkout</h1>

            {/* Steps */}
            <div className="flex gap-lg" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                {[
                    { num: 1, label: 'Shipping', icon: FiMapPin },
                    { num: 2, label: 'Payment', icon: FiCreditCard },
                ].map((s) => (
                    <div
                        key={s.num}
                        className="flex items-center gap-sm"
                        style={{ opacity: step >= s.num ? 1 : 0.5 }}
                    >
                        <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: 'var(--radius-full)',
                            background: step >= s.num ? 'var(--primary-500)' : 'var(--gray-200)',
                            color: step >= s.num ? 'white' : 'var(--gray-500)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600
                        }}>
                            {step > s.num ? <FiCheck /> : s.num}
                        </div>
                        <span style={{ fontWeight: 600 }}>{s.label}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-3 grid-1-mobile" style={{ gap: 'var(--spacing-xl)' }}>
                {/* Forms */}
                <div style={{ gridColumn: 'span 2' }}>
                    {step === 1 && (
                        <div className="card fade-in">
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <FiMapPin style={{ marginRight: 8 }} /> Shipping Address
                            </h3>

                            <form onSubmit={handleAddressSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Street Address</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="123 Main Street, Apt 4"
                                        value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-2 grid-1-mobile" style={{ gap: 'var(--spacing-md)' }}>
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Mumbai"
                                            value={address.city}
                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Maharashtra"
                                            value={address.state}
                                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-2 grid-1-mobile" style={{ gap: 'var(--spacing-md)' }}>
                                    <div className="form-group">
                                        <label className="form-label">PIN Code</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="400001"
                                            value={address.pincode}
                                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            placeholder="+91 98765 43210"
                                            value={address.phone}
                                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg w-full" style={{ marginTop: 'var(--spacing-md)' }}>
                                    Continue to Payment
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="card fade-in">
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <FiCreditCard style={{ marginRight: 8 }} /> Payment
                            </h3>

                            <div style={{
                                padding: 'var(--spacing-lg)',
                                background: 'var(--gray-50)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                <h5 style={{ marginBottom: 'var(--spacing-md)' }}>Shipping to:</h5>
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} - {address.pincode}</p>
                                <p>{address.phone}</p>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setStep(1)}
                                    style={{ marginTop: 'var(--spacing-sm)' }}
                                >
                                    Edit Address
                                </button>
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', marginBottom: 'var(--spacing-md)' }}>
                                    <FiLock style={{ marginRight: 4 }} />
                                    Your payment is secured with Razorpay
                                </p>
                                <div className="flex gap-sm">
                                    <span className="badge badge-secondary">UPI</span>
                                    <span className="badge badge-secondary">Cards</span>
                                    <span className="badge badge-secondary">Net Banking</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-lg w-full"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : `Pay ₹${cart.totalAmount.toLocaleString()}`}
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div style={{ gridColumn: 'span 1' }}>
                    <div className="card" style={{ position: 'sticky', top: 100 }}>
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Summary</h3>

                        <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 'var(--spacing-lg)' }}>
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="flex gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <img
                                        src={item.product.images?.[0] || 'https://via.placeholder.com/60x60'}
                                        alt={item.product.name}
                                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.product.name}</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Qty: {item.quantity}</p>
                                    </div>
                                    <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 'var(--spacing-md)' }}>
                            <div className="flex justify-between" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                <span style={{ color: 'var(--gray-500)' }}>Subtotal</span>
                                <span>₹{cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                <span style={{ color: 'var(--gray-500)' }}>Shipping</span>
                                <span style={{ color: 'var(--success-600)' }}>
                                    ₹{cart.items.reduce((sum, item) => sum + ((item.shippingFees || 0) * item.quantity), 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between" style={{
                                paddingTop: 'var(--spacing-md)',
                                borderTop: '2px solid var(--gray-100)',
                                marginTop: 'var(--spacing-md)'
                            }}>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-600)' }}>
                                    ₹{cart.totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

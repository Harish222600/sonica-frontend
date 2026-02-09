import { useState } from 'react';
import { FiStar, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { reviewAPI } from '../../services/api';

const ReviewModal = ({ isOpen, onClose, order, onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Delivery, 2: Products
    const [submitting, setSubmitting] = useState(false);

    // Delivery Review State
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [deliveryComment, setDeliveryComment] = useState('');

    // Product Review State
    // Map productId -> { rating, comment }
    const [productReviews, setProductReviews] = useState({});

    if (!isOpen || !order) return null;

    const handleProductRatingChange = (productId, rating) => {
        setProductReviews(prev => ({
            ...prev,
            [productId]: { ...prev[productId], rating }
        }));
    };

    const handleProductCommentChange = (productId, comment) => {
        setProductReviews(prev => ({
            ...prev,
            [productId]: { ...prev[productId], comment }
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const promises = [];

            // 1. Submit Delivery Review (if rated)
            if (deliveryRating > 0) {
                promises.push(reviewAPI.create({
                    type: 'delivery',
                    orderId: order._id,
                    rating: deliveryRating,
                    title: 'Delivery Review',
                    comment: deliveryComment || 'Great delivery!'
                }));
            }

            // 2. Submit Product Reviews
            Object.keys(productReviews).forEach(productId => {
                const review = productReviews[productId];
                if (review.rating > 0) {
                    promises.push(reviewAPI.create({
                        type: 'product',
                        productId: productId,
                        rating: review.rating,
                        title: 'Product Review',
                        comment: review.comment || 'Great product!'
                    }));
                }
            });

            const results = await Promise.allSettled(promises);

            const rejected = results.filter(r => r.status === 'rejected');
            const fulfilled = results.filter(r => r.status === 'fulfilled');

            if (rejected.length > 0) {
                console.error('Some reviews failed:', rejected.map(r => r.reason));
                // Extract error message safe for duplicate key error
                const errorMessages = rejected.map(r => r.reason.response?.data?.message || r.reason.message || 'Unknown error').join(', ');

                if (fulfilled.length > 0) {
                    alert(`Some reviews were submitted successfully, but others failed: ${errorMessages}`);
                    if (onSuccess) onSuccess();
                    onClose();
                } else {
                    alert(`Failed to submit reviews: ${errorMessages}`);
                }
            } else {
                if (onSuccess) onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Unexpected error during review submission:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ rating, onChange, size = 24 }) => {
        return (
            <div className="flex gap-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer' }}
                    >
                        <FaStar
                            size={size}
                            color={star <= rating ? '#FFBB28' : '#e4e5e9'}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="modal-content card" style={{
                width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
                padding: 'var(--spacing-xl)', position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: 'var(--spacing-md)', right: 'var(--spacing-md)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <FiX size={24} />
                </button>

                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Rate your Experience</h2>

                {/* Delivery Review Section */}
                <div style={{ marginBottom: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--gray-200)' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)' }}>How was the delivery?</h3>
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <StarRating rating={deliveryRating} onChange={setDeliveryRating} size={32} />
                    </div>
                    <textarea
                        className="input"
                        placeholder="Tell us about the delivery experience..."
                        value={deliveryComment}
                        onChange={(e) => setDeliveryComment(e.target.value)}
                        rows={3}
                    />
                </div>

                {/* Products Review Section */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)' }}>Rate Items</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                        {order.items.map((item) => (
                            <div key={item.product._id || item.product}>
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                                    {/* Ideally show product image here if available */}
                                    <div>
                                        <p style={{ fontWeight: 600 }}>{item.name}</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                                    <StarRating
                                        rating={productReviews[item.product._id || item.product]?.rating || 0}
                                        onChange={(r) => handleProductRatingChange(item.product._id || item.product, r)}
                                    />
                                </div>
                                <input
                                    className="input"
                                    placeholder="Write a review for this product..."
                                    value={productReviews[item.product._id || item.product]?.comment || ''}
                                    onChange={(e) => handleProductCommentChange(item.product._id || item.product, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-md" style={{ marginTop: 'var(--spacing-xl)' }}>
                    <button className="btn btn-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || (deliveryRating === 0 && Object.keys(productReviews).length === 0)}>
                        {submitting ? 'Submitting...' : 'Submit Reviews'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;

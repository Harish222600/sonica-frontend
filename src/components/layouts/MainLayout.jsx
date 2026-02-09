import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const MainLayout = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { itemCount } = useCart();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <div>
            {/* Navigation */}
            <nav className="navbar">
                <div className="container navbar-content">
                    <Link to="/" className="navbar-logo">
                        🚴 <span>Sonica</span>
                    </Link>

                    <ul className="navbar-nav">
                        <li>
                            <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/products" className={`navbar-link ${isActive('/products') ? 'active' : ''}`}>
                                Bicycles
                            </Link>
                        </li>
                        {isAuthenticated && (
                            <li>
                                <Link to="/orders" className={`navbar-link ${isActive('/orders') ? 'active' : ''}`}>
                                    My Orders
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="navbar-actions">
                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className="btn btn-ghost btn-icon cart-icon">
                                    <FiShoppingCart size={20} />
                                    {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                                </Link>

                                <Link to="/profile" className="btn btn-ghost btn-icon">
                                    <FiUser size={20} />
                                </Link>

                                <button onClick={logout} className="btn btn-ghost btn-icon">
                                    <FiLogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost">Login</Link>
                                <Link to="/register" className="btn btn-primary">Sign Up</Link>
                            </>
                        )}

                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{ display: 'none' }}
                        >
                            <FiMenu size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer style={{
                background: 'var(--gray-900)',
                color: 'var(--gray-400)',
                padding: 'var(--spacing-2xl) 0',
                marginTop: 'var(--spacing-2xl)'
            }}>
                <div className="container">
                    <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>
                                🚴 Sonica Bicycles
                            </h4>
                            <p>Premium bicycles for every adventure. Quality, performance, and style.</p>
                        </div>
                        <div>
                            <h5 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>Shop</h5>
                            <ul style={{ listStyle: 'none' }}>
                                <li><Link to="/products?category=mountain">Mountain Bikes</Link></li>
                                <li><Link to="/products?category=road">Road Bikes</Link></li>
                                <li><Link to="/products?category=electric">Electric Bikes</Link></li>
                                <li><Link to="/products?category=hybrid">Hybrid Bikes</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>Support</h5>
                            <ul style={{ listStyle: 'none' }}>
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">Shipping Info</a></li>
                                <li><a href="#">Returns</a></li>
                                <li><a href="#">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>Contact</h5>
                            <p>📧 support@sonica.com</p>
                            <p>📞 +91 98765 43210</p>
                        </div>
                    </div>
                    <div style={{
                        borderTop: '1px solid var(--gray-700)',
                        paddingTop: 'var(--spacing-lg)',
                        textAlign: 'center'
                    }}>
                        <p>© 2026 Sonica Bicycles. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

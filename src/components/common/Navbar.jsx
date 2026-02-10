import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { itemCount } = useCart();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.svg" alt="SS Square Logo" style={{ height: '40px', width: '40px', marginRight: '10px' }} />
                    <span>SS Square</span>
                </Link>

                <ul className="navbar-nav">
                    {user?.role !== 'delivery_partner' && (
                        <>
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
                        </>
                    )}

                    {isAuthenticated && (
                        <>
                            {user?.role === 'admin' && (
                                <li>
                                    <Link to="/admin" className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}>
                                        Admin Dashboard
                                    </Link>
                                </li>
                            )}
                            {user?.role === 'inventory_manager' && (
                                <li>
                                    <Link to="/inventory" className={`navbar-link ${isActive('/inventory') ? 'active' : ''}`}>
                                        Inventory Dashboard
                                    </Link>
                                </li>
                            )}
                            {user?.role === 'delivery_partner' && (
                                <li>
                                    <Link to="/delivery" className={`navbar-link ${isActive('/delivery') ? 'active' : ''}`}>
                                        Delivery Dashboard
                                    </Link>
                                </li>
                            )}
                            {user?.role === 'customer' && (
                                <li>
                                    <Link to="/orders" className={`navbar-link ${isActive('/orders') ? 'active' : ''}`}>
                                        My Orders
                                    </Link>
                                </li>
                            )}
                        </>
                    )}
                </ul>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            {user?.role === 'customer' && (
                                <Link to="/cart" className="btn btn-ghost btn-icon cart-icon">
                                    <FiShoppingCart size={20} />
                                    {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                                </Link>
                            )}

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
                        className="btn btn-ghost btn-icon mobile-menu-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ zIndex: 1100 }}
                    >
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>

                    {/* Mobile Menu Overlay */}
                    <div
                        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>

                    {/* Mobile Menu Sidebar */}
                    <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                        <div className="mobile-menu-header">
                            <span className="navbar-logo">
                                <span>SS Square</span>
                            </span>
                        </div>

                        <ul className="mobile-nav-list">
                            {user?.role !== 'delivery_partner' && (
                                <>
                                    <li>
                                        <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/products" className={`mobile-nav-link ${isActive('/products') ? 'active' : ''}`}>
                                            Bicycles
                                        </Link>
                                    </li>
                                </>
                            )}

                            {isAuthenticated && (
                                <>
                                    {user?.role === 'admin' && (
                                        <li>
                                            <Link to="/admin" className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`}>
                                                Admin Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    {user?.role === 'inventory_manager' && (
                                        <li>
                                            <Link to="/inventory" className={`mobile-nav-link ${isActive('/inventory') ? 'active' : ''}`}>
                                                Inventory Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    {user?.role === 'delivery_partner' && (
                                        <li>
                                            <Link to="/delivery" className={`mobile-nav-link ${isActive('/delivery') ? 'active' : ''}`}>
                                                Delivery Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    {user?.role === 'customer' && (
                                        <li>
                                            <Link to="/orders" className={`mobile-nav-link ${isActive('/orders') ? 'active' : ''}`}>
                                                My Orders
                                            </Link>
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>

                        {isAuthenticated ? (
                            <div className="mobile-menu-footer">
                                <div className="flex items-center gap-md mb-md">
                                    <div className="avatar-placeholder">
                                        <FiUser />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{user.email}</div>
                                    </div>
                                </div>
                                <button onClick={logout} className="btn btn-outline w-full justify-center">
                                    <FiLogOut size={16} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="mobile-menu-footer flex-col gap-sm">
                                <Link to="/login" className="btn btn-ghost w-full justify-center">Login</Link>
                                <Link to="/register" className="btn btn-primary w-full justify-center">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

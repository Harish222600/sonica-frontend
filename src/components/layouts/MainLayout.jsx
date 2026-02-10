import { Outlet, Link } from 'react-router-dom';
import Navbar from '../common/Navbar';

const MainLayout = () => {
    return (
        <div>
            {/* Navigation */}
            <Navbar />

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
                                🚴 SS Square Industries
                            </h4>
                            <p style={{ marginBottom: 'var(--spacing-sm)' }}>Premium bicycles for every adventure. Quality, performance, and style.</p>
                            <p>2/177, Gandhi Street, Nazarethpet,<br />Chennai – 600 123, India</p>
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
                            <p>📧 ssquaretestingmachine@gmail.com</p>
                            <p>📞 +91 98413 94925</p>
                            <p>📞 +91 99620 02826</p>
                        </div>
                    </div>
                    <div style={{
                        borderTop: '1px solid var(--gray-700)',
                        paddingTop: 'var(--spacing-lg)',
                        textAlign: 'center'
                    }}>
                        <p>© 2026 SS Square Industries. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

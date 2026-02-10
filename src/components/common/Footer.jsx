import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Company Info */}
                    <div className="footer-section">
                        <Link to="/" className="footer-logo">
                            <span>SS Square</span>
                        </Link>
                        <p className="footer-text">
                            Premium bicycle store offering the best selection of road, mountain, and city bikes for all your adventures.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Instagram"><FiInstagram /></a>
                            <a href="#" className="social-link" aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" className="social-link" aria-label="Facebook"><FiFacebook /></a>
                            <a href="#" className="social-link" aria-label="Youtube"><FiYoutube /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/products">Bicycles</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h4 className="footer-title">Contact Us</h4>
                        <ul className="contact-list">
                            <li>
                                <FiMapPin className="contact-icon" />
                                <span>2/177, Gandhi Street, Nazarethpet, Chennai – 600 123</span>
                            </li>
                            <li>
                                <FiPhone className="contact-icon" />
                                <span>+91 9841394925, +91 9962002826</span>
                            </li>
                            <li>
                                <FiMail className="contact-icon" />
                                <span>ssquaretestingmachine@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} SS Square Industries. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

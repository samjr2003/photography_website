import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-main">Lens</span>
          <span className="logo-sub">STUDIO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/about">
            About
          </NavLink>

          <NavLink to="/portfolio">
            Portfolio
          </NavLink>

          <NavLink to="/services">
            Services
          </NavLink>

          <NavLink to="/pricing">
            Pricing
          </NavLink>

          <NavLink to="/testimonials">
            Testimonials
          </NavLink>

          <NavLink to="/booking">
            Booking
          </NavLink>

          <NavLink to="/contact">
            Contact
          </NavLink>
        </nav>

        {/* Desktop CTA */}
        <Link to="/booking" className="navbar-cta">
          Book a Session
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation */}
        <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

          <NavLink to="/portfolio" onClick={closeMenu}>
            Portfolio
          </NavLink>

          <NavLink to="/services" onClick={closeMenu}>
            Services
          </NavLink>

          <NavLink to="/pricing" onClick={closeMenu}>
            Pricing
          </NavLink>

          <NavLink to="/testimonials" onClick={closeMenu}>
            Testimonials
          </NavLink>

          <NavLink to="/booking" onClick={closeMenu}>
            Booking
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          <Link
            to="/booking"
            className="mobile-booking-button"
            onClick={closeMenu}
          >
            Book a Session
          </Link>
        </nav>

      </div>
    </header>
  );
};

export default Navbar;
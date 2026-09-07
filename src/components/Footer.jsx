import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-main">

        {/* Brand */}
        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            Lens Studio
          </Link>

          <p>
            Capturing genuine moments,
            <br />
            beautifully and timelessly.
          </p>

        </div>


        {/* Navigation */}
        <div className="footer-column">

          <h3>Explore</h3>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/services">Services</Link>

        </div>


        {/* More */}
        <div className="footer-column">

          <h3>More</h3>

          <Link to="/pricing">Pricing</Link>
          <Link to="/testimonials">Testimonials</Link>
          <Link to="/booking">Booking</Link>
          <Link to="/contact">Contact</Link>

        </div>


        {/* Contact */}
        <div className="footer-column footer-contact">

          <h3>Contact</h3>

          <a href="mailto:hello@lensstudio.com">
            hello@lensstudio.com
          </a>

          <a href="tel:+919876543210">
            +91 98765 43210
          </a>

          <p>
            Coimbatore, Tamil Nadu
          </p>

        </div>

      </div>


      {/* Bottom */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Lens Studio. All rights reserved.
        </p>

        <div className="footer-socials">

          <a href="#" aria-label="Instagram">
            Instagram
          </a>

          <a href="#" aria-label="Facebook">
            Facebook
          </a>

          <a href="#" aria-label="Pinterest">
            Pinterest
          </a>

        </div>

      </div>

    </footer>
  );
};

export default Footer;
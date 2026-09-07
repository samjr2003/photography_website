import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact form data:", formData);

    alert("Thank you! Your message has been sent.");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="contact-page">

      {/* =========================
          CONTACT HERO
      ========================= */}
      <section className="contact-hero">

        <div className="contact-hero-content">

          <p className="section-label">
            GET IN TOUCH
          </p>

          <h1>
            Let's start a
            <br />
            <span>conversation.</span>
          </h1>

          <p>
            Have a question, an idea, or simply want to say hello?
            We'd love to hear from you.
          </p>

        </div>

      </section>


      {/* =========================
          CONTACT MAIN
      ========================= */}
      <section className="contact-main">

        {/* Contact Information */}
        <div className="contact-details">

          <p className="section-label">
            CONTACT
          </p>

          <h2>
            We'd love to
            <br />
            <span>hear from you.</span>
          </h2>

          <p className="contact-description">
            Whether you're planning a wedding, portrait session,
            celebration, or simply have a question about our work,
            feel free to reach out.
          </p>


          <div className="contact-info-list">

            <div className="contact-info-item">
              <span>Email</span>

              <a href="mailto:hello@lensstudio.com">
                hello@lensstudio.com
              </a>
            </div>

            <div className="contact-info-item">
              <span>Phone</span>

              <a href="tel:+919876543210">
                +91 98765 43210
              </a>
            </div>

            <div className="contact-info-item">
              <span>Studio</span>

              <p>
                Chennai, Tamil Nadu
              </p>
            </div>

            <div className="contact-info-item">
              <span>Working Hours</span>

              <p>
                Monday — Saturday
                <br />
                10:00 AM — 7:00 PM
              </p>
            </div>

          </div>


          {/* Social Links */}
          <div className="contact-socials">

            <span>FOLLOW ALONG</span>

            <div>
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

        </div>


        {/* Contact Form */}
        <div className="contact-form-wrapper">

          <div className="contact-form-header">

            <p className="section-label">
              SEND A MESSAGE
            </p>

            <h2>
              How can we
              <span> help?</span>
            </h2>

          </div>


          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="contact-form-group">

              <label htmlFor="contact-name">
                Full Name *
              </label>

              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />

            </div>


            <div className="contact-form-group">

              <label htmlFor="contact-email">
                Email Address *
              </label>

              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

            </div>


            <div className="contact-form-group">

              <label htmlFor="contact-subject">
                Subject
              </label>

              <input
                type="text"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
              />

            </div>


            <div className="contact-form-group">

              <label htmlFor="contact-message">
                Message *
              </label>

              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows="7"
                required
              ></textarea>

            </div>


            <button
              type="submit"
              className="contact-submit"
            >
              Send Message →
            </button>

          </form>

        </div>

      </section>


      {/* =========================
          MAP / LOCATION
      ========================= */}
      <section className="contact-location">

        <div className="contact-location-content">

          <p className="section-label">
            FIND US
          </p>

          <h2>
            Based in
            <span> Chennai.</span>
          </h2>

          <p>
            Available for photography assignments across Tamil Nadu
            and destination locations.
          </p>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Chennai%2C%20Tamil%20Nadu"
            target="_blank"
            rel="noreferrer"
            className="contact-map-button"
          >
            View on Google Maps →
          </a>

        </div>

      </section>


      {/* =========================
          CONTACT CTA
      ========================= */}
      <section className="contact-cta">

        <div className="contact-cta-content">

          <p className="section-label">
            HAVE AN EVENT IN MIND?
          </p>

          <h2>
            Your story starts
            <br />
            <span>here.</span>
          </h2>

          <a
            href="/booking"
            className="contact-cta-button"
          >
            Book a Session
          </a>

        </div>

      </section>

    </main>
  );
};

export default Contact;
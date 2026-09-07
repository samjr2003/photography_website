import { useState } from "react";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  service: "",
  date: "",
  location: "",
  package: "",
  message: "",
};

const Booking = () => {
  const [formData, setFormData] =
    useState(initialFormData);

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");


  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };


  // =========================================================
  // SUBMIT BOOKING
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    try {
      setLoading(true);

      const response = await fetch(
  "https://photography-website-api.onrender.com/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(formData),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit booking."
        );
      }

      setSuccessMessage(
        data.message ||
          "Booking request submitted successfully."
      );

      setFormData(
        initialFormData
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (error) {

      console.error(
        "Booking submission error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Something went wrong. Please try again."
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="booking-page">

      {/* =====================================================
          BOOKING HERO
      ===================================================== */}

      <section className="booking-page-hero">

        <div className="booking-page-hero-content">

          <p className="section-label">
            LET'S WORK TOGETHER
          </p>

          <h1>
            Tell us about
            <br />
            <span>your story.</span>
          </h1>

          <p>
            Share a few details about your event or session and
            we'll get back to you with availability and next steps.
          </p>

        </div>

      </section>


      {/* =====================================================
          BOOKING MAIN
      ===================================================== */}

      <section className="booking-main">


        {/* ===================================================
            FORM
        =================================================== */}

        <div className="booking-form-wrapper">

          <div className="booking-form-header">

            <p className="section-label">
              BOOKING REQUEST
            </p>

            <h2>
              Let's plan your
              <span>
                {" "}photography experience.
              </span>
            </h2>

          </div>


          <form
            className="booking-form"
            onSubmit={handleSubmit}
          >


            {/* ===============================================
                NAME
            =============================================== */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name *
              </label>

              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />

            </div>


            {/* ===============================================
                EMAIL
            =============================================== */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address *
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

            </div>


            {/* ===============================================
                PHONE
            =============================================== */}

            <div className="form-group">

              <label htmlFor="phone">
                Phone Number *
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                required
              />

            </div>


            {/* ===============================================
                SERVICE
            =============================================== */}

            <div className="form-group">

              <label htmlFor="service">
                Photography Type *
              </label>

              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select a service
                </option>

                <option value="Wedding Photography">
                  Wedding Photography
                </option>

                <option value="Pre-Wedding Photography">
                  Pre-Wedding Photography
                </option>

                <option value="Portrait Photography">
                  Portrait Photography
                </option>

                <option value="Event Photography">
                  Event Photography
                </option>

                <option value="Maternity Photography">
                  Maternity Photography
                </option>

                <option value="Birthday Photography">
                  Birthday Photography
                </option>

              </select>

            </div>


            {/* ===============================================
                DATE
            =============================================== */}

            <div className="form-group">

              <label htmlFor="date">
                Event Date *
              </label>

              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

            </div>


            {/* ===============================================
                LOCATION
            =============================================== */}

            <div className="form-group">

              <label htmlFor="location">
                Event Location
              </label>

              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City / Venue"
              />

            </div>


            {/* ===============================================
                PACKAGE
            =============================================== */}

            <div className="form-group">

              <label htmlFor="package">
                Package
              </label>

              <input
                type="text"
                id="package"
                name="package"
                value={formData.package}
                onChange={handleChange}
                placeholder="Package name, if known"
              />

            </div>


            {/* ===============================================
                MESSAGE
            =============================================== */}

            <div className="form-group form-group-full">

              <label htmlFor="message">
                Tell us more
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your event, requirements, ideas..."
                rows="5"
              />

            </div>


            {/* ===============================================
                SUCCESS MESSAGE
            =============================================== */}

            {successMessage && (

              <div className="booking-success-message">

                {successMessage}

              </div>

            )}


            {/* ===============================================
                ERROR MESSAGE
            =============================================== */}

            {errorMessage && (

              <div className="booking-error-message">

                {errorMessage}

              </div>

            )}


            {/* ===============================================
                SUBMIT
            =============================================== */}

            <div className="booking-submit-wrapper">

              <button
                type="submit"
                className="booking-submit"
                disabled={loading}
              >

                {loading
                  ? "Submitting..."
                  : "Send Booking Request →"}

              </button>

            </div>

          </form>

        </div>


        {/* ===================================================
            BOOKING INFO
        =================================================== */}

        <aside className="booking-info">

          <p className="section-label">
            GET IN TOUCH
          </p>

          <h2>
            Let's make
            <br />
            something <span>beautiful.</span>
          </h2>

          <p>
            Once we receive your request, we'll review the details
            and get back to you regarding availability and the next
            steps.
          </p>


          <div className="booking-contact-details">

            <div>

              <span>
                Email
              </span>

              <a href="mailto:hello@lensstudio.com">
                hello@lensstudio.com
              </a>

            </div>


            <div>

              <span>
                Phone
              </span>

              <a href="tel:+919876543210">
                +91 98765 43210
              </a>

            </div>


            <div>

              <span>
                Location
              </span>

              <p>
                Chennai, Tamil Nadu
              </p>

            </div>

          </div>

        </aside>

      </section>


      {/* =====================================================
          BOOKING FOOTER CTA
      ===================================================== */}

      <section className="booking-bottom-cta">

        <div>

          <p className="section-label">
            HAVE QUESTIONS?
          </p>

          <h2>
            We'd love to
            <br />
            <span>hear from you.</span>
          </h2>

          <a
            href="mailto:hello@lensstudio.com"
            className="booking-email-button"
          >
            Send an Email
          </a>

        </div>

      </section>

    </main>
  );
};

export default Booking;
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH SERVICES FROM DATABASE
  // =========================================================

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
  "https://photography-website-api.onrender.com/api/services"
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load services."
        );
      }

      setServices(
  (data.services || []).filter(
    (service) => service.active
  )
);
    } catch (error) {
      console.error("Services Error:", error);

      setError(
        error.message || "Unable to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <main className="services-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="services-hero">

        <div className="services-hero-content">

          <p className="section-label">
            PHOTOGRAPHY SERVICES
          </p>

          <h1>
            Every moment,
            <br />
            <span>beautifully captured.</span>
          </h1>

          <p>
            Thoughtful photography for weddings,
            couples, portraits, celebrations, and
            the moments that deserve to be remembered.
          </p>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="services-intro">

        <p className="section-label">
          WHAT WE DO
        </p>

        <h2>
          Photography designed around
          <br />
          <span>your story.</span>
        </h2>

        <p>
          Every session is approached with care,
          creativity, and attention to detail.
          Whether it's your wedding day or a quiet
          portrait session, the goal is always the same
          — creating photographs that feel authentic
          and timeless.
        </p>

      </section>


      {/* =====================================================
          SERVICES FROM DATABASE
      ===================================================== */}

      <section className="services-main">

        {/* Loading */}

        {loading && (
          <div className="portfolio-state">
            Loading our services...
          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="portfolio-state portfolio-error">
            {error}
          </div>
        )}


        {/* No services */}

        {!loading &&
          !error &&
          services.length === 0 && (
            <div className="portfolio-state">
              No services available at the moment.
            </div>
          )}


        {/* Services */}

        {!loading &&
          !error &&
          services.length > 0 && (
            <>
              {services.map((service, index) => {

                const serviceNumber = String(
                  index + 1
                ).padStart(2, "0");

                return (
                  <article
                    className={`service-detail ${
                      index % 2 !== 0
                        ? "reverse"
                        : ""
                    }`}
                    key={service._id}
                  >

                    {/* IMAGE */}

                    <div className="service-detail-image">

                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="service-image-placeholder">
                          Lens Studio
                        </div>
                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="service-detail-content">

                      <span className="service-detail-number">
                        {serviceNumber}
                      </span>

                      <p className="section-label">
                        PHOTOGRAPHY
                      </p>

                      <h2>
                        {service.title}
                      </h2>

                      <p>
                        {service.description}
                      </p>


                      {/* PRICE */}

                      {service.price > 0 && (
                        <p className="service-price">
                          Starting from ₹
                          {Number(
                            service.price
                          ).toLocaleString("en-IN")}
                        </p>
                      )}


                      <Link
                        to="/booking"
                        className="service-detail-button"
                      >
                        Enquire Now →
                      </Link>

                    </div>

                  </article>
                );
              })}
            </>
          )}

      </section>


      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="services-process">

        <div className="services-process-header">

          <p className="section-label">
            THE PROCESS
          </p>

          <h2>
            Simple from
            <span> start to finish.</span>
          </h2>

        </div>


        <div className="process-grid">

          <div className="process-item">
            <span>01</span>

            <h3>
              Connect
            </h3>

            <p>
              Tell us about your event, ideas,
              and photography requirements.
            </p>
          </div>


          <div className="process-item">
            <span>02</span>

            <h3>
              Plan
            </h3>

            <p>
              We discuss the details, location,
              timeline, and creative direction.
            </p>
          </div>


          <div className="process-item">
            <span>03</span>

            <h3>
              Capture
            </h3>

            <p>
              Relax and enjoy the moment while
              we focus on creating beautiful
              photographs.
            </p>
          </div>


          <div className="process-item">
            <span>04</span>

            <h3>
              Deliver
            </h3>

            <p>
              Your professionally edited
              photographs are carefully prepared
              and delivered to you.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="services-cta">

        <div className="services-cta-content">

          <p className="section-label">
            READY TO CREATE SOMETHING BEAUTIFUL?
          </p>

          <h2>
            Let's tell your
            <br />
            <span>story.</span>
          </h2>

          <Link
            to="/booking"
            className="services-cta-button"
          >
            Book a Session
          </Link>

        </div>

      </section>

    </main>
  );
};

export default Services;
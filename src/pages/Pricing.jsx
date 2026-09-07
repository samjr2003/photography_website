import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ACTIVE PRICING PACKAGES
  // =========================================================

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/pricing"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load pricing packages."
        );
      }

      // Only active packages should appear on public website
      const activePackages = (data.packages || [])
        .filter((pkg) => pkg.active)
        .sort(
          (a, b) =>
            Number(a.order || 0) -
            Number(b.order || 0)
        );

      setPackages(activePackages);

    } catch (error) {
      console.error(
        "Pricing Fetch Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load pricing packages."
      );

      setPackages([]);

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <main className="pricing-page">

      {/* =====================================================
          PRICING HERO
      ===================================================== */}

      <section className="pricing-hero">

        <div className="pricing-hero-content">

          <p className="section-label">
            INVESTMENT
          </p>

          <h1>
            Photography
            <br />
            <span>packages.</span>
          </h1>

          <p>
            Thoughtfully designed photography collections for
            different stories, occasions, and moments.
          </p>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="pricing-intro">

        <p className="section-label">
          SIMPLE & TRANSPARENT
        </p>

        <h2>
          Choose the experience
          <br />
          <span>that fits your story.</span>
        </h2>

        <p>
          Every package includes professionally edited photographs,
          personal attention, and an experience designed around you.
          Need something different? We can create a custom collection.
        </p>

      </section>


      {/* =====================================================
          PACKAGES
      ===================================================== */}

      <section className="pricing-packages">

        {loading ? (

          <div className="pricing-state">
            Loading photography packages...
          </div>

        ) : error ? (

          <div className="pricing-state">
            {error}
          </div>

        ) : packages.length === 0 ? (

          <div className="pricing-state">
            No photography packages available at the moment.
          </div>

        ) : (

          packages.map((pkg, index) => (

            <article
              key={pkg._id}
              className={
                pkg.popular
                  ? "pricing-card pricing-card-popular"
                  : "pricing-card"
              }
            >

              {/* MOST POPULAR */}

              {pkg.popular && (
                <div className="pricing-popular">
                  MOST POPULAR
                </div>
              )}


              {/* CARD TOP */}

              <div className="pricing-card-top">

                <span className="pricing-number">
                  {pkg.number ||
                    String(index + 1).padStart(2, "0")}
                </span>

                <h2>
                  {pkg.name}
                </h2>

                <p>
                  {pkg.description}
                </p>

              </div>


              {/* PRICE */}

              <div className="pricing-price">

                <span>
                  Starting from
                </span>

                <strong>
                  ₹
                  {Number(
                    pkg.price || 0
                  ).toLocaleString("en-IN")}
                </strong>

              </div>


              {/* FEATURES */}

              <div className="pricing-features">

                {(pkg.features || []).map(
                  (feature, featureIndex) => (

                    <div
                      className="pricing-feature"
                      key={`${pkg._id}-feature-${featureIndex}`}
                    >

                      <span>
                        ✓
                      </span>

                      {feature}

                    </div>

                  )
                )}

              </div>


              {/* BOOKING BUTTON */}

              <Link
                to="/booking"
                className="pricing-button"
              >
                Choose Package
              </Link>

            </article>

          ))

        )}

      </section>


      {/* =====================================================
          CUSTOM PACKAGE
      ===================================================== */}

      <section className="custom-package">

        <div className="custom-package-content">

          <p className="section-label">
            NEED SOMETHING DIFFERENT?
          </p>

          <h2>
            Let's create a
            <br />
            <span>custom collection.</span>
          </h2>

          <p>
            Every event is different. If you have specific requirements,
            additional hours, multiple locations, or something completely
            unique in mind, we'll create a package around your needs.
          </p>

          <Link
            to="/contact"
            className="custom-package-button"
          >
            Discuss Your Requirements →
          </Link>

        </div>

      </section>


      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="pricing-faq">

        <div className="pricing-faq-header">

          <p className="section-label">
            FREQUENTLY ASKED
          </p>

          <h2>
            Before you
            <span> book.</span>
          </h2>

        </div>


        <div className="faq-list">

          <div className="faq-item">

            <h3>
              Can I customize a package?
            </h3>

            <p>
              Absolutely. Packages can be adjusted based on coverage
              hours, locations, photographers, and other requirements.
            </p>

          </div>


          <div className="faq-item">

            <h3>
              How do I reserve my date?
            </h3>

            <p>
              Once we discuss your requirements and confirm availability,
              a booking advance can be used to reserve your date.
            </p>

          </div>


          <div className="faq-item">

            <h3>
              When will I receive my photographs?
            </h3>

            <p>
              Delivery time depends on the package and event. The
              estimated delivery period will be confirmed during booking.
            </p>

          </div>


          <div className="faq-item">

            <h3>
              Do you travel for photography?
            </h3>

            <p>
              Yes. Travel arrangements can be discussed for locations
              outside the usual service area.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="pricing-cta">

        <div className="pricing-cta-content">

          <p className="section-label">
            YOUR DATE. YOUR STORY.
          </p>

          <h2>
            Let's make it
            <br />
            <span>unforgettable.</span>
          </h2>

          <Link
            to="/booking"
            className="pricing-cta-button"
          >
            Check Availability
          </Link>

        </div>

      </section>

    </main>
  );
};

export default Pricing;
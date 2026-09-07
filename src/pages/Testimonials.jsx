import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ACTIVE TESTIMONIALS
  // =========================================================

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/testimonials"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load testimonials."
        );
      }

      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error(
        "Testimonials Fetch Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load testimonials."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD TESTIMONIALS
  // =========================================================

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // =========================================================
  // FEATURED TESTIMONIAL
  // =========================================================

  const featuredTestimonial =
    testimonials.find(
      (testimonial) =>
        testimonial.featured === true
    ) || testimonials[0];

  return (
    <main className="testimonials-page">

      {/* =========================
          TESTIMONIAL HERO
      ========================= */}

      <section className="testimonials-hero">

        <div className="testimonials-hero-content">

          <p className="section-label">
            CLIENT STORIES
          </p>

          <h1>
            Words from
            <br />
            <span>
              the people we photograph.
            </span>
          </h1>

          <p>
            The most meaningful part of our
            work is knowing that the photographs
            we create become part of someone's
            story.
          </p>

        </div>

      </section>


      {/* =========================
          INTRO
      ========================= */}

      <section className="testimonials-intro">

        <p className="section-label">
          KIND WORDS
        </p>

        <h2>
          More than photographs.
          <br />
          <span>
            Memories that stay.
          </span>
        </h2>

      </section>


      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <section className="testimonials-grid">

          <div className="testimonial-loading">
            Loading client stories...
          </div>

        </section>
      )}


      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <section className="testimonials-grid">

          <div className="testimonial-loading">
            {error}
          </div>

        </section>
      )}


      {/* =========================
          NO TESTIMONIALS
      ========================= */}

      {!loading &&
        !error &&
        testimonials.length === 0 && (
          <section className="testimonials-grid">

            <div className="testimonial-loading">
              No client stories available
              at the moment.
            </div>

          </section>
        )}


      {/* =========================
          TESTIMONIAL GRID
      ========================= */}

      {!loading &&
        !error &&
        testimonials.length > 0 && (

          <section className="testimonials-grid">

            {testimonials.map(
              (testimonial, index) => (

                <article
                  key={testimonial._id}
                  className="testimonial-card"
                >

                  <div className="testimonial-card-top">

                    <span className="testimonial-card-number">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <span className="testimonial-quote-mark">
                      “
                    </span>

                  </div>


                  <blockquote>
                    {testimonial.quote}
                  </blockquote>


                  <div className="testimonial-card-author">

                    <strong>
                      {testimonial.name}
                    </strong>

                    <span>
                      {testimonial.event}
                    </span>

                    {testimonial.location && (
                      <small>
                        {testimonial.location}
                      </small>
                    )}

                  </div>

                </article>

              )
            )}

          </section>
        )}


      {/* =========================
          FEATURED STORY
      ========================= */}

      {!loading &&
        !error &&
        featuredTestimonial && (

          <section className="featured-testimonial">

            <div className="featured-testimonial-image">

              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85"
                alt="Wedding couple"
              />

            </div>


            <div className="featured-testimonial-content">

              <span className="testimonial-quote-mark">
                “
              </span>

              <blockquote>
                {featuredTestimonial.quote}
              </blockquote>


              <div className="featured-testimonial-author">

                <strong>
                  {featuredTestimonial.name}
                </strong>

                <span>
                  {featuredTestimonial.event}
                </span>

              </div>

            </div>

          </section>

        )}


      {/* =========================
          CTA
      ========================= */}

      <section className="testimonials-cta">

        <div className="testimonials-cta-content">

          <p className="section-label">
            YOUR STORY COULD BE NEXT
          </p>

          <h2>
            Let's create
            <br />
            something{" "}
            <span>
              meaningful.
            </span>
          </h2>

          <Link
            to="/booking"
            className="testimonials-cta-button"
          >
            Book Your Session
          </Link>

        </div>

      </section>

    </main>
  );
};

export default Testimonials;
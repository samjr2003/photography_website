import { useEffect, useState } from "react";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  // ==========================================
  // Fetch portfolio
  // ==========================================

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://photography-website-api.onrender.com/api/portfolio"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load portfolio."
        );
      }

      setPortfolio(data.portfolio || []);
    } catch (error) {
      console.error(
        "Portfolio Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load portfolio."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // ==========================================
  // Categories
  // ==========================================

  const categories = [
    "All",
    "Wedding",
    "Pre-Wedding",
    "Portrait",
    "Event",
    "Maternity",
    "Fashion",
  ];

  // ==========================================
  // Filter
  // ==========================================

  const filteredPortfolio =
    activeCategory === "All"
      ? portfolio
      : portfolio.filter(
          (item) =>
            item.category === activeCategory
        );

  return (
    <main className="portfolio-page">

      {/* ======================================
          HERO
      ====================================== */}

      <section className="portfolio-page-hero">

        <div className="portfolio-page-hero-content">

          <p className="section-label">
            OUR WORK
          </p>

          <h1>
            Stories
            <br />
            <span>we've captured.</span>
          </h1>

          <p>
            A collection of moments, emotions,
            and memories captured through our
            lens.
          </p>

        </div>

      </section>


      {/* ======================================
          FILTER
      ====================================== */}

      <section className="portfolio-filter-section">

        <div className="portfolio-filters">

          {categories.map((category) => (

            <button
              key={category}
              className={
                activeCategory === category
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>

          ))}

        </div>

      </section>


      {/* ======================================
          PORTFOLIO GRID
      ====================================== */}

      <section className="portfolio-gallery">

        {loading && (
          <div className="portfolio-state">
            Loading our stories...
          </div>
        )}


        {!loading && error && (
          <div className="portfolio-state portfolio-error">
            {error}
          </div>
        )}


        {!loading &&
          !error &&
          filteredPortfolio.length === 0 && (
            <div className="portfolio-state">
              No photographs found in this
              category.
            </div>
          )}


        {!loading &&
          !error &&
          filteredPortfolio.length > 0 && (

            <div className="portfolio-grid">

              {filteredPortfolio.map(
                (item) => (

                  <article
                    className="portfolio-card"
                    key={item._id}
                  >

                    <div className="portfolio-card-image">

                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                      />

                    </div>


                    <div className="portfolio-card-info">

                      <div>

                        <p>
                          {item.category}
                        </p>

                        <h2>
                          {item.title}
                        </h2>

                      </div>

                      {item.description && (
                        <span>
                          {item.description}
                        </span>
                      )}

                    </div>

                  </article>

                )
              )}

            </div>

          )}

      </section>

    </main>
  );
};

export default Portfolio;
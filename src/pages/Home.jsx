import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [featuredPortfolio, setFeaturedPortfolio] =
        useState([]);

    const [services, setServices] =
        useState([]);

    const [featuredTestimonial, setFeaturedTestimonial] =
        useState(null);

    const [loadingPortfolio, setLoadingPortfolio] =
        useState(true);

    const [loadingServices, setLoadingServices] =
        useState(true);

    const [loadingTestimonial, setLoadingTestimonial] =
        useState(true);


    // =========================================================
    // FETCH FEATURED PORTFOLIO
    // =========================================================

    const fetchFeaturedPortfolio = async () => {
        try {
            const response = await fetch(
                "https://photography-website-api.onrender.com/api/portfolio/featured"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load featured portfolio."
                );
            }

            setFeaturedPortfolio(
                data.portfolio || []
            );

        } catch (error) {
            console.error(
                "Featured Portfolio Error:",
                error
            );

            setFeaturedPortfolio([]);

        } finally {
            setLoadingPortfolio(false);
        }
    };


    // =========================================================
    // FETCH SERVICES
    // =========================================================

    const fetchServices = async () => {
        try {
            const response = await fetch(
                "https://photography-website-api.onrender.com/api/services"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load services."
                );
            }

            const activeServices =
                (data.services || [])
                    .filter(
                        (service) =>
                            service.active
                    )
                    .sort(
                        (a, b) =>
                            a.order - b.order
                    );

            setServices(activeServices);

        } catch (error) {
            console.error(
                "Homepage Services Error:",
                error
            );

            setServices([]);

        } finally {
            setLoadingServices(false);
        }
    };


    // =========================================================
    // FETCH FEATURED TESTIMONIAL
    // =========================================================

    const fetchFeaturedTestimonial = async () => {
        try {
            const response = await fetch(
                "https://photography-website-api.onrender.com/api/testimonials"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load testimonials."
                );
            }

            const testimonials =
                data.testimonials || [];

            if (testimonials.length === 0) {
                setFeaturedTestimonial(null);
                return;
            }

            // Prefer admin-selected featured testimonial
            const featured =
                testimonials.find(
                    (testimonial) =>
                        testimonial.featured === true
                );

            // If none is featured, use first active testimonial
            setFeaturedTestimonial(
                featured || testimonials[0]
            );

        } catch (error) {
            console.error(
                "Homepage Testimonial Error:",
                error
            );

            setFeaturedTestimonial(null);

        } finally {
            setLoadingTestimonial(false);
        }
    };


    // =========================================================
    // LOAD HOMEPAGE DATA
    // =========================================================

    useEffect(() => {
        fetchFeaturedPortfolio();
        fetchServices();
        fetchFeaturedTestimonial();
    }, []);


    return (
        <main className="home">

            {/* =========================
                HERO SECTION
            ========================= */}

            <section className="hero">

                <div className="hero-overlay"></div>

                <div className="hero-content">

                    <p className="hero-subtitle">
                        CAPTURING MOMENTS • CREATING MEMORIES
                    </p>

                    <h1>
                        Stories Told
                        <br />
                        Through <span>Photography</span>
                    </h1>

                    <p className="hero-description">
                        Professional photography for weddings,
                        portraits, celebrations, and the moments
                        that matter most.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/portfolio"
                            className="hero-button primary"
                        >
                            View Portfolio
                        </Link>

                        <Link
                            to="/booking"
                            className="hero-button secondary"
                        >
                            Book a Session
                        </Link>

                    </div>

                </div>

                <div className="hero-scroll">
                    <span></span>
                    <p>SCROLL TO EXPLORE</p>
                </div>

            </section>


            {/* =========================
                INTRODUCTION SECTION
            ========================= */}

            <section className="intro-section">

                <div className="intro-content">

                    <p className="section-label">
                        ABOUT THE PHOTOGRAPHER
                    </p>

                    <h2>
                        We capture more than moments.
                        <br />
                        We capture <span>how they felt.</span>
                    </h2>

                    <p className="intro-description">
                        Every photograph has a story. Our approach
                        is focused on capturing authentic emotions,
                        genuine connections, and the beautiful details
                        that make every occasion unique.
                    </p>

                    <Link
                        to="/about"
                        className="intro-button"
                    >
                        Discover More
                    </Link>

                </div>

            </section>


            {/* =========================
                PHOTOGRAPHY CATEGORIES
            ========================= */}

            <section className="categories-section">

                <div className="categories-header">

                    <p className="section-label">
                        WHAT WE PHOTOGRAPH
                    </p>

                    <h2>
                        Moments worth <span>remembering.</span>
                    </h2>

                </div>


                <div className="categories-grid">

                    <Link
                        to="/services"
                        className="category-card"
                    >

                        <img
                            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85"
                            alt="Wedding photography"
                        />

                        <div className="category-overlay"></div>

                        <div className="category-content">

                            <span>01</span>

                            <h3>
                                Wedding
                            </h3>

                            <p>
                                Timeless moments from
                                your special day.
                            </p>

                        </div>

                    </Link>


                    <Link
                        to="/services"
                        className="category-card"
                    >

                        <img
                            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85"
                            alt="Pre-wedding photography"
                        />

                        <div className="category-overlay"></div>

                        <div className="category-content">

                            <span>02</span>

                            <h3>
                                Pre-Wedding
                            </h3>

                            <p>
                                Beautiful stories before
                                the big day.
                            </p>

                        </div>

                    </Link>


                    <Link
                        to="/services"
                        className="category-card"
                    >

                        <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85"
                            alt="Portrait photography"
                        />

                        <div className="category-overlay"></div>

                        <div className="category-content">

                            <span>03</span>

                            <h3>
                                Portraits
                            </h3>

                            <p>
                                Authentic portraits that
                                feel like you.
                            </p>

                        </div>

                    </Link>


                    <Link
                        to="/services"
                        className="category-card"
                    >

                        <img
                            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85"
                            alt="Event photography"
                        />

                        <div className="category-overlay"></div>

                        <div className="category-content">

                            <span>04</span>

                            <h3>
                                Events
                            </h3>

                            <p>
                                Every celebration,
                                beautifully documented.
                            </p>

                        </div>

                    </Link>

                </div>

            </section>


            {/* =========================
                FEATURED PORTFOLIO
            ========================= */}

            <section className="featured-section">

                <div className="featured-header">

                    <div>

                        <p className="section-label">
                            SELECTED WORK
                        </p>

                        <h2>
                            A glimpse of our
                            <span> stories.</span>
                        </h2>

                    </div>

                    <Link
                        to="/portfolio"
                        className="featured-view-all"
                    >
                        View Full Portfolio →
                    </Link>

                </div>


                {loadingPortfolio ? (

                    <div className="admin-state">
                        Loading selected work...
                    </div>

                ) : featuredPortfolio.length === 0 ? (

                    <div className="admin-state">
                        No featured photographs available.
                    </div>

                ) : (

                    <div className="featured-grid">

                        {featuredPortfolio
                            .slice(0, 5)
                            .map((item, index) => (

                                <Link
                                    to="/portfolio"
                                    className={
                                        index === 0
                                            ? "featured-item featured-large"
                                            : index === 4
                                                ? "featured-item featured-wide"
                                                : "featured-item"
                                    }
                                    key={item._id}
                                >

                                    <img
                                        src={item.image}
                                        alt={
                                            item.title ||
                                            "Photography"
                                        }
                                        loading="lazy"
                                    />

                                    <div className="featured-overlay">

                                        <span>
                                            {item.category
                                                ? item.category.toUpperCase()
                                                : "PHOTOGRAPHY"}
                                        </span>

                                    </div>

                                </Link>

                            ))}

                    </div>

                )}

            </section>


            {/* =========================
                SERVICES PREVIEW
            ========================= */}

            <section className="services-preview-section">

                <div className="services-preview-header">

                    <p className="section-label">
                        WHAT WE OFFER
                    </p>

                    <h2>
                        Photography for
                        <span> every story.</span>
                    </h2>

                    <p className="services-preview-description">
                        From intimate moments to grand celebrations,
                        we create timeless photographs that preserve
                        the emotions and memories of every occasion.
                    </p>

                </div>


                {loadingServices ? (

                    <div className="admin-state">
                        Loading services...
                    </div>

                ) : services.length === 0 ? (

                    <div className="admin-state">
                        No services available.
                    </div>

                ) : (

                    <div className="services-list">

                        {services
                            .slice(0, 4)
                            .map((service, index) => (

                                <Link
                                    to="/services"
                                    className="service-row"
                                    key={service._id}
                                >

                                    <div className="service-number">
                                        {String(
                                            index + 1
                                        ).padStart(2, "0")}
                                    </div>

                                    <div className="service-info">

                                        <h3>
                                            {service.title}
                                        </h3>

                                        <p>
                                            {service.description}
                                        </p>

                                    </div>

                                    <div className="service-arrow">
                                        →
                                    </div>

                                </Link>

                            ))}

                    </div>

                )}


                <div className="services-preview-button-wrapper">

                    <Link
                        to="/services"
                        className="services-preview-button"
                    >
                        Explore All Services
                    </Link>

                </div>

            </section>


            {/* =========================
                TESTIMONIALS PREVIEW
            ========================= */}

            <section className="testimonials-preview-section">

                <div className="testimonials-preview-header">

                    <p className="section-label">
                        KIND WORDS
                    </p>

                    <h2>
                        Stories from
                        <span> our clients.</span>
                    </h2>

                </div>


                {loadingTestimonial ? (

                    <div className="admin-state">
                        Loading client story...
                    </div>

                ) : !featuredTestimonial ? (

                    <div className="admin-state">
                        No client stories available.
                    </div>

                ) : (

                    <div className="testimonial-feature">

                        <div className="testimonial-quote">

                            <span className="quote-mark">
                                “
                            </span>

                            <blockquote>
                                {featuredTestimonial.quote}
                            </blockquote>

                            <div className="testimonial-author">

                                <strong>
                                    {featuredTestimonial.name}
                                </strong>

                                <span>
                                    {featuredTestimonial.event}
                                </span>

                                {featuredTestimonial.location && (
                                    <small>
                                        {featuredTestimonial.location}
                                    </small>
                                )}

                            </div>

                        </div>


                        <div className="testimonial-image">

                            <img
                                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85"
                                alt="Happy wedding couple"
                                loading="lazy"
                            />

                        </div>

                    </div>

                )}


                <div className="testimonials-link-wrapper">

                    <Link
                        to="/testimonials"
                        className="testimonials-link"
                    >
                        Read More Stories →
                    </Link>

                </div>

            </section>


            {/* =========================
                BOOKING CTA
            ========================= */}

            <section className="booking-cta-section">

                <div className="booking-cta-overlay"></div>

                <div className="booking-cta-content">

                    <p className="section-label booking-label">
                        LET'S CREATE SOMETHING BEAUTIFUL
                    </p>

                    <h2>
                        Your story deserves
                        <br />
                        to be <span>remembered.</span>
                    </h2>

                    <p>
                        Tell us about your upcoming celebration,
                        session, or special moment. We'd love to
                        be part of your story.
                    </p>

                    <Link
                        to="/booking"
                        className="booking-cta-button"
                    >
                        Book Your Session
                    </Link>

                </div>

            </section>

        </main>
    );
};

export default Home;
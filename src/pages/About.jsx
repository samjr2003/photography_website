import { Link } from "react-router-dom";

const About = () => {
  return (
    <main className="about-page">

      {/* =========================
          ABOUT HERO
      ========================= */}
      <section className="about-hero">

        <div className="about-hero-content">

          <p className="section-label">
            ABOUT THE PHOTOGRAPHER
          </p>

          <h1>
            Behind the
            <br />
            <span>lens.</span>
          </h1>

          <p>
            Photography is more than taking pictures.
            It's about preserving the emotions, people,
            and stories that make life meaningful.
          </p>

        </div>

      </section>


      {/* =========================
          PHOTOGRAPHER STORY
      ========================= */}
      <section className="about-story">

        <div className="about-story-image">

          <img
            src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1200&q=85"
            alt="Photographer holding a camera"
          />

        </div>


        <div className="about-story-content">

          <p className="section-label">
            MY STORY
          </p>

          <h2>
            Turning real moments into
            <span> lasting memories.</span>
          </h2>

          <p>
            What started as a passion for capturing beautiful moments
            gradually became a journey dedicated to telling meaningful
            stories through photography.
          </p>

          <p>
            Every couple, family, and individual has a unique story.
            My goal is to create photographs that feel natural,
            emotional, and timeless — photographs you'll want to
            return to years from now.
          </p>

          <p>
            From the smallest details to the biggest celebrations,
            I believe the best photographs are the ones that allow
            you to relive how a moment truly felt.
          </p>

        </div>

      </section>


      {/* =========================
          PHOTOGRAPHY PHILOSOPHY
      ========================= */}
      <section className="about-philosophy">

        <div className="about-philosophy-content">

          <p className="section-label">
            MY APPROACH
          </p>

          <h2>
            Authentic.
            <br />
            <span>Emotional.</span>
            <br />
            Timeless.
          </h2>

          <p>
            I focus on genuine interactions rather than forced poses.
            The goal is to create images that feel like you — natural,
            honest, and full of emotion.
          </p>

        </div>

      </section>


      {/* =========================
          EXPERIENCE
      ========================= */}
      <section className="about-experience">

        <div className="about-experience-header">

          <p className="section-label">
            EXPERIENCE
          </p>

          <h2>
            A passion built through
            <span> every story.</span>
          </h2>

        </div>


        <div className="experience-grid">

          <div className="experience-item">
            <strong>2+</strong>
            <span>Years Experience</span>
          </div>

          <div className="experience-item">
            <strong>50+</strong>
            <span>Stories Captured</span>
          </div>

          <div className="experience-item">
            <strong>30+</strong>
            <span>Happy Couples</span>
          </div>

          <div className="experience-item">
            <strong>8+</strong>
            <span>Locations Covered</span>
          </div>

        </div>

      </section>


      {/* =========================
          ABOUT CTA
      ========================= */}
      <section className="about-cta">

        <div className="about-cta-content">

          <p className="section-label">
            LET'S CREATE SOMETHING BEAUTIFUL
          </p>

          <h2>
            Have a story
            <br />
            to <span>tell?</span>
          </h2>

          <Link
            to="/booking"
            className="about-cta-button"
          >
            Book a Session
          </Link>

        </div>

      </section>

    </main>
  );
};

export default About;
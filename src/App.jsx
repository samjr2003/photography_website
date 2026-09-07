import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Testimonials from "./pages/Testimonials";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPortfolio from "./pages/AdminPortfolio";
import AdminBookings from "./pages/AdminBookings";
import AdminServices from "./pages/admin/AdminServices";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminPricing from "./pages/admin/AdminPricing";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}/>
        <Route path="/admin/portfolio" element={<AdminPortfolio />}/>
        <Route path="/admin/bookings" element={<AdminBookings />}/>
        <Route path="/admin/services" element={<AdminServices />}/>
        <Route path="/admin/testimonials" element={<AdminTestimonials />}/>
        <Route path="/admin/pricing"element={<AdminPricing />}/>
      </Routes>

      <Footer />


    </BrowserRouter>
  );
}

export default App;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
  "https://photography-website-api.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      // Make sure only an admin can enter the dashboard
      if (data.user.role !== "admin") {
        throw new Error(
          "Access denied. Admin account required."
        );
      }

      // Store authentication information
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.user)
      );

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin Login Error:", error);

      setError(
        error.message || "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-header">

          <p className="section-label">
            LENS STUDIO
          </p>

          <h1>
            Admin
            <span> Login</span>
          </h1>

          <p>
            Sign in to manage your photography website.
          </p>

        </div>


        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-form-group">

            <label htmlFor="admin-email">
              Email Address
            </label>

            <input
              type="email"
              id="admin-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@lensstudio.com"
              required
            />

          </div>


          <div className="admin-form-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <input
              type="password"
              id="admin-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

          </div>


          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}


          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

        </form>


        <div className="admin-login-footer">

          <a href="/">
            ← Back to Website
          </a>

        </div>

      </div>

    </main>
  );
};

export default AdminLogin;
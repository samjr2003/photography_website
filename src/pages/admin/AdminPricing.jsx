import { useEffect, useState } from "react";

const AdminPricing = () => {
  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    number: "",
    name: "",
    description: "",
    price: "",
    features: "",
    popular: false,
    active: true,
    order: 0,
  });


  // =========================================================
  // TOAST
  // =========================================================

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "",
        message: "",
      });
    }, 3500);
  };


  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = () => {
    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      throw new Error(
        "Admin session expired. Please login again."
      );
    }

    return token;
  };


  // =========================================================
  // FETCH ALL PACKAGES
  // =========================================================

  const fetchPackages = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const response = await fetch(
        "https://photography-website-api.onrender.com/api/pricing/admin",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load pricing packages."
        );
      }

      setPackages(
        data.packages || []
      );

    } catch (error) {
      console.error(
        "Pricing Fetch Error:",
        error
      );

      showToast(
        "error",
        error.message ||
          "Unable to load pricing packages."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setEditingId(null);

    setForm({
      number: "",
      name: "",
      description: "",
      price: "",
      features: "",
      popular: false,
      active: true,
      order: 0,
    });
  };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim()
    ) {
      showToast(
        "error",
        "Package name and description are required."
      );

      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      const features = form.features
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean);

      const payload = {
        number:
          form.number.trim(),

        name:
          form.name.trim(),

        description:
          form.description.trim(),

        price:
          Number(form.price) || 0,

        features,

        popular:
          form.popular,

        active:
          form.active,

        order:
          Number(form.order) || 0,
      };

      const url = editingId
  ? `https://photography-website-api.onrender.com/api/pricing/${editingId}`
  : "https://photography-website-api.onrender.com/api/pricing";

      const response = await fetch(
        url,
        {
          method: editingId
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save pricing package."
        );
      }

      showToast(
        "success",
        editingId
          ? "Pricing package updated successfully."
          : "Pricing package added successfully."
      );

      resetForm();

      await fetchPackages();

    } catch (error) {
      console.error(
        "Pricing Save Error:",
        error
      );

      showToast(
        "error",
        error.message ||
          "Unable to save pricing package."
      );

    } finally {
      setSaving(false);
    }
  };


  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (pkg) => {
    setEditingId(pkg._id);

    setForm({
      number:
        pkg.number || "",

      name:
        pkg.name || "",

      description:
        pkg.description || "",

      price:
        pkg.price ?? "",

      features:
        (pkg.features || [])
          .join("\n"),

      popular:
        Boolean(pkg.popular),

      active:
        Boolean(pkg.active),

      order:
        pkg.order ?? 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =========================================================
  // TOGGLE ACTIVE
  // =========================================================

  const toggleActive = async (pkg) => {
    try {
      const token = getToken();

      const response = await fetch(
        `https://photography-website-api.onrender.com/api/pricing/${pkg._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            active:
              !pkg.active,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update package status."
        );
      }

      showToast(
        "success",
        pkg.active
          ? "Pricing package deactivated successfully."
          : "Pricing package activated successfully."
      );

      await fetchPackages();

    } catch (error) {
      console.error(
        "Pricing Active Error:",
        error
      );

      showToast(
        "error",
        error.message ||
          "Unable to update package status."
      );
    }
  };


  // =========================================================
  // TOGGLE POPULAR
  // =========================================================

  const togglePopular = async (pkg) => {
    try {
      const token = getToken();

      const response = await fetch(
        `https://photography-website-api.onrender.com/api/pricing/${pkg._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            popular:
              !pkg.popular,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update popular status."
        );
      }

      showToast(
        "success",
        pkg.popular
          ? "Package removed from popular."
          : "Package marked as popular."
      );

      await fetchPackages();

    } catch (error) {
      console.error(
        "Pricing Popular Error:",
        error
      );

      showToast(
        "error",
        error.message ||
          "Unable to update popular status."
      );
    }
  };


  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (pkg) => {
    const confirmed =
      window.confirm(
        `Delete "${pkg.name}" pricing package?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `https://photography-website-api.onrender.com/api/pricing/${pkg._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete pricing package."
        );
      }

      showToast(
        "success",
        "Pricing package deleted successfully."
      );

      await fetchPackages();

    } catch (error) {
      console.error(
        "Pricing Delete Error:",
        error
      );

      showToast(
        "error",
        error.message ||
          "Unable to delete pricing package."
      );
    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchPackages();
  }, []);


  return (
    <main className="admin-pricing-page">

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast.show && (
        <div
          className={`admin-toast ${
            toast.type === "success"
              ? "admin-toast-success"
              : "admin-toast-error"
          }`}
        >
          <div className="admin-toast-icon">
            {toast.type === "success"
              ? "✓"
              : "!"}
          </div>

          <div className="admin-toast-content">
            <strong>
              {toast.type === "success"
                ? "SUCCESS"
                : "ERROR"}
            </strong>

            <span>
              {toast.message}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setToast({
                show: false,
                type: "",
                message: "",
              })
            }
          >
            ×
          </button>
        </div>
      )}


      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="admin-pricing-header">

        <p className="section-label">
          ADMIN PANEL
        </p>

        <h1>
          Pricing management.
        </h1>

        <p>
          Create and manage the photography
          packages displayed on your website.
        </p>

      </section>


      {/* =====================================================
          FORM
      ===================================================== */}

      <section className="admin-pricing-form-section">

        <p className="section-label">
          {editingId
            ? "EDIT PACKAGE"
            : "ADD PACKAGE"}
        </p>

        <h2>
          {editingId
            ? "Update pricing package."
            : "Add a new package."}
        </h2>


        <form
          className="admin-pricing-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-pricing-form-grid">

            {/* NUMBER */}

            <div className="admin-field">

              <label>
                PACKAGE NUMBER
              </label>

              <input
                type="text"
                name="number"
                value={form.number}
                onChange={handleChange}
                placeholder="01"
              />

            </div>


            {/* NAME */}

            <div className="admin-field">

              <label>
                PACKAGE NAME *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: Essential"
                required
              />

            </div>


            {/* PRICE */}

            <div className="admin-field">

              <label>
                PRICE *
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="15000"
                min="0"
                required
              />

            </div>


            {/* ORDER */}

            <div className="admin-field">

              <label>
                DISPLAY ORDER
              </label>

              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                min="0"
              />

            </div>

          </div>


          {/* DESCRIPTION */}

          <div className="admin-field">

            <label>
              DESCRIPTION *
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this photography package..."
              rows="4"
              required
            />

          </div>


          {/* FEATURES */}

          <div className="admin-field">

            <label>
              PACKAGE FEATURES
            </label>

            <textarea
              name="features"
              value={form.features}
              onChange={handleChange}
              placeholder={
                "2 Hours Coverage\n1 Photographer\n100+ Edited Photos\nOnline Gallery"
              }
              rows="7"
            />

            <small>
              Enter one feature per line.
            </small>

          </div>


          {/* OPTIONS */}

          <div className="admin-pricing-options">

            <label className="admin-checkbox">

              <input
                type="checkbox"
                name="popular"
                checked={form.popular}
                onChange={handleChange}
              />

              <span>
                Mark as Popular
              </span>

            </label>


            <label className="admin-checkbox">

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />

              <span>
                Active Package
              </span>

            </label>

          </div>


          {/* BUTTONS */}

          <div className="admin-pricing-form-actions">

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Package →"
                  : "Add Package →"}
            </button>


            {editingId && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </section>


      {/* =====================================================
          PACKAGE LIST
      ===================================================== */}

      <section className="admin-pricing-list-section">

        <div className="admin-pricing-list-header">

          <div>

            <p className="section-label">
              YOUR PACKAGES
            </p>

            <h2>
              Photography packages.
            </h2>

          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={fetchPackages}
            disabled={loading}
          >
            {loading
              ? "LOADING..."
              : "REFRESH"}
          </button>

        </div>


        {loading ? (

          <div className="admin-state">
            Loading pricing packages...
          </div>

        ) : packages.length === 0 ? (

          <div className="admin-state">
            No pricing packages added yet.
          </div>

        ) : (

          <div className="admin-pricing-grid">

            {packages.map((pkg) => (

              <article
                className={`admin-pricing-card ${
                  pkg.popular
                    ? "admin-pricing-card-popular"
                    : ""
                } ${
                  !pkg.active
                    ? "admin-pricing-card-inactive"
                    : ""
                }`}
                key={pkg._id}
              >

                {pkg.popular && (
                  <div className="admin-popular-badge">
                    ★ MOST POPULAR
                  </div>
                )}


                <div className="admin-pricing-card-top">

                  <span className="admin-pricing-number">
                    {pkg.number}
                  </span>

                  <span
                    className={
                      pkg.active
                        ? "admin-status-active"
                        : "admin-status-inactive"
                    }
                  >
                    {pkg.active
                      ? "ACTIVE"
                      : "INACTIVE"}
                  </span>

                </div>


                <h3>
                  {pkg.name}
                </h3>


                <p className="admin-pricing-description">
                  {pkg.description}
                </p>


                <div className="admin-pricing-price">

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


                <div className="admin-pricing-features">

                  {(pkg.features || []).map(
                    (feature, index) => (

                      <div
                        key={`${pkg._id}-${index}`}
                      >
                        <span>✓</span>
                        {feature}
                      </div>

                    )
                  )}

                </div>


                <div className="admin-pricing-actions">

                  <button
                    type="button"
                    onClick={() =>
                      toggleActive(pkg)
                    }
                    className={
                      pkg.active
                        ? "admin-action-status active"
                        : "admin-action-status inactive"
                    }
                  >
                    {pkg.active
                      ? "Deactivate"
                      : "Activate"}
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      togglePopular(pkg)
                    }
                    className="admin-action-button"
                  >
                    {pkg.popular
                      ? "★ Popular"
                      : "☆ Popular"}
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(pkg)
                    }
                    className="admin-action-button"
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(pkg)
                    }
                    className="admin-action-delete"
                  >
                    Delete
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
};

export default AdminPricing;
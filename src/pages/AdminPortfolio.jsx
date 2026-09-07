import { useEffect, useState } from "react";

const AdminPortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    featured: false,
    order: 0,
    image: null,
  });

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
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
    }, 4000);
  };


  // =========================================================
  // GET TOKEN
  // =========================================================

  const getToken = () => {
    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      window.location.href =
        "/admin/login";

      return null;
    }

    return token;
  };


  // =========================================================
  // FETCH PORTFOLIO
  // =========================================================

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://photography-website-api.onrender.com/api/portfolio"
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load portfolio."
        );
      }

      setPortfolio(
        data.portfolio || []
      );

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


  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = e.target;

    if (type === "file") {
      setFormData(
        (previous) => ({
          ...previous,
          image:
            files?.[0] || null,
        })
      );

      return;
    }

    setFormData(
      (previous) => ({
        ...previous,
        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );
  };


  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      featured: false,
      order: 0,
      image: null,
    });

    setEditingId(null);
    setError("");

    const fileInput =
      document.getElementById(
        "portfolio-image"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        return;
      }

      const data = new FormData();

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "featured",
        String(formData.featured)
      );

      data.append(
        "order",
        String(formData.order)
      );

      if (formData.image) {
        data.append(
          "image",
          formData.image
        );
      }

      const url = editingId
  ? `https://photography-website-api.onrender.com/api/portfolio/${editingId}`
  : "https://photography-website-api.onrender.com/api/portfolio";

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: data,
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save portfolio item."
        );
      }

      showToast(
        "success",
        editingId
          ? "Portfolio item updated successfully."
          : "Portfolio item added successfully."
      );

      resetForm();

      await fetchPortfolio();

    } catch (error) {
      console.error(
        "Save Portfolio Error:",
        error
      );

      setError(
        error.message ||
          "Failed to save portfolio item."
      );

      showToast(
        "error",
        error.message ||
          "Failed to save portfolio item."
      );

    } finally {
      setSaving(false);
    }
  };


  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      title: item.title || "",
      category: item.category || "",
      description:
        item.description || "",
      featured:
        item.featured || false,
      order:
        item.order || 0,
      image: null,
    });

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this portfolio item?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const token = getToken();

      if (!token) {
        return;
      }

      const response =
        await fetch(
          `https://photography-website-api.onrender.com/api/portfolio/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete portfolio item."
        );
      }

      showToast(
        "success",
        "Portfolio item deleted successfully."
      );

      await fetchPortfolio();

    } catch (error) {
      console.error(
        "Delete Portfolio Error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete portfolio item."
      );

      showToast(
        "error",
        error.message ||
          "Failed to delete portfolio item."
      );

    } finally {
      setDeletingId(null);
    }
  };


  // =========================================================
  // RETURN
  // =========================================================

  return (
    <main className="admin-portfolio">


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

      <section className="admin-portfolio-header">

        <div>

          <p className="section-label">
            ADMIN PANEL
          </p>

          <h1>
            Portfolio
            <span>
              {" "}
              management.
            </span>
          </h1>

          <p>
            Add, edit and manage your
            photography portfolio.
          </p>

        </div>

        <div className="admin-portfolio-header-actions">

          <button
            type="button"
            className="admin-refresh-button"
            onClick={fetchPortfolio}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Refresh"}
          </button>

          <a
            href="/admin/dashboard"
            className="admin-back-button"
          >
            ← Dashboard
          </a>

        </div>

      </section>


      {/* =====================================================
          FORM
      ===================================================== */}

      <section className="admin-portfolio-form-section">

        <div className="admin-section-header">

          <div>

            <p className="section-label">
              {editingId
                ? "EDIT PORTFOLIO"
                : "ADD PORTFOLIO"}
            </p>

            <h2>
              {editingId
                ? "Update"
                : "Add a new"}{" "}
              <span>
                photograph.
              </span>
            </h2>

          </div>

          {editingId && (
            <button
              type="button"
              className="admin-refresh-button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}

        </div>


        <form
          className="admin-portfolio-form"
          onSubmit={handleSubmit}
        >


          {/* TITLE */}

          <div className="form-group">

            <label htmlFor="portfolio-title">
              Title *
            </label>

            <input
              type="text"
              id="portfolio-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: A Beautiful Wedding"
              required
            />

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label htmlFor="portfolio-category">
              Category *
            </label>

            <select
              id="portfolio-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >

              <option value="">
                Select category
              </option>

              <option value="Wedding">
                Wedding
              </option>

              <option value="Pre-Wedding">
                Pre-Wedding
              </option>

              <option value="Portrait">
                Portrait
              </option>

              <option value="Event">
                Event
              </option>

              <option value="Maternity">
                Maternity
              </option>

              <option value="Fashion">
                Fashion
              </option>

            </select>

          </div>


          {/* DESCRIPTION */}

          <div className="form-group form-group-full">

            <label htmlFor="portfolio-description">
              Description
            </label>

            <textarea
              id="portfolio-description"
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Describe this photograph..."
              rows="4"
            />

          </div>


          {/* IMAGE */}

          <div className="form-group form-group-full">

            <label htmlFor="portfolio-image">
              {editingId
                ? "Replace Image"
                : "Portfolio Image *"}
            </label>

            <input
              type="file"
              id="portfolio-image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required={!editingId}
            />

            {editingId && (
              <small>
                Leave empty to keep the
                existing image.
              </small>
            )}

          </div>


          {/* IMAGE PREVIEW */}

          {formData.image && (
            <div className="admin-portfolio-upload-preview">

              <p className="section-label">
                IMAGE PREVIEW
              </p>

              <div className="admin-portfolio-preview-image">

                <img
                  src={URL.createObjectURL(
                    formData.image
                  )}
                  alt="Selected portfolio preview"
                />

              </div>

              <span>
                {formData.image.name}
              </span>

            </div>
          )}


          {/* ORDER */}

          <div className="form-group">

            <label htmlFor="portfolio-order">
              Display Order
            </label>

            <input
              type="number"
              id="portfolio-order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
            />

          </div>


          {/* FEATURED */}

          <div className="form-group">

            <label className="admin-checkbox-label">

              <input
                type="checkbox"
                name="featured"
                checked={
                  formData.featured
                }
                onChange={handleChange}
              />

              <span>
                Featured Portfolio
              </span>

            </label>

          </div>


          {/* SUBMIT */}

          <div className="admin-portfolio-submit">

            <button
              type="submit"
              className="booking-submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Portfolio →"
                : "Add Portfolio →"}
            </button>

          </div>

        </form>

      </section>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="admin-state admin-state-error">
          {error}
        </div>
      )}


      {/* =====================================================
          PORTFOLIO LIST
      ===================================================== */}

      <section className="admin-portfolio-list">

        <div className="admin-section-header">

          <div>

            <p className="section-label">
              YOUR WORK
            </p>

            <h2>
              Portfolio
              <span>
                {" "}
                collection.
              </span>
            </h2>

          </div>

          <div className="admin-portfolio-list-actions">

            <span>
              {portfolio.length}{" "}
              {portfolio.length === 1
                ? "photograph"
                : "photographs"}
            </span>

            <button
              type="button"
              className="admin-refresh-button"
              onClick={fetchPortfolio}
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="admin-state">
            Loading portfolio...
          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          portfolio.length === 0 && (
            <div className="admin-state">
              No portfolio items yet.
            </div>
          )}


        {/* GRID */}

        {!loading &&
          portfolio.length > 0 && (
            <div className="admin-portfolio-grid">

              {portfolio.map(
                (item) => (

                  <article
                    className="admin-portfolio-card"
                    key={item._id}
                  >


                    {/* IMAGE */}

                    <div className="admin-portfolio-image">

                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                      />

                      <div className="admin-portfolio-image-overlay">

                        <span>
                          {item.category}
                        </span>

                      </div>

                      {item.featured && (
                        <span className="admin-featured-badge">
                          Featured
                        </span>
                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="admin-portfolio-card-content">

                      <div className="admin-portfolio-card-meta">

                        <span>
                          #{String(
                            item.order ?? 0
                          ).padStart(2, "0")}
                        </span>

                        <span>
                          {item.featured
                            ? "FEATURED"
                            : "PORTFOLIO"}
                        </span>

                      </div>

                      <h3>
                        {item.title}
                      </h3>

                      {item.description && (
                        <p>
                          {item.description}
                        </p>
                      )}


                      {/* ACTIONS */}

                      <div className="admin-portfolio-card-actions">

                        <button
                          type="button"
                          className="admin-portfolio-edit"
                          onClick={() =>
                            handleEdit(item)
                          }
                          disabled={
                            deletingId ===
                            item._id
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="admin-portfolio-delete"
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                          disabled={
                            deletingId ===
                            item._id
                          }
                        >
                          {deletingId ===
                          item._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

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

export default AdminPortfolio;
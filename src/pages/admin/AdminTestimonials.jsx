import { useEffect, useState } from "react";

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);

    const [formData, setFormData] = useState({
        quote: "",
        name: "",
        event: "",
        location: "",
        featured: false,
        active: true,
        order: 0,
    });


    // =========================================================
    // FETCH ALL TESTIMONIALS
    // =========================================================

    const fetchTestimonials = async () => {
        setLoading(true);
        setError("");

        try {
            const token =
                localStorage.getItem(
                    "adminToken"
                );

            if (!token) {
                window.location.href =
                    "/admin/login";
                return;
            }

            const response = await fetch(
                "https://photography-website-api.onrender.com/api/testimonials/admin",
                {
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
                    "Failed to load testimonials."
                );
            }

            setTestimonials(
                data.testimonials || []
            );

        } catch (error) {
            console.error(
                "Fetch Testimonials Error:",
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
    // LOAD PAGE
    // =========================================================

    useEffect(() => {
        fetchTestimonials();
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
        } = e.target;

        setFormData((previous) => ({
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

    const resetForm = (
        clearSuccess = true
    ) => {
        setFormData({
            quote: "",
            name: "",
            event: "",
            location: "",
            featured: false,
            active: true,
            order: 0,
        });

        setEditingId(null);
        setError("");

        if (clearSuccess) {
            setSuccess("");
        }
    };


    // =========================================================
    // CREATE / UPDATE
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem(
                    "adminToken"
                );

            if (!token) {
                window.location.href =
                    "/admin/login";
                return;
            }

           const data = {
    quote: formData.quote,
    name: formData.name,
    event: formData.event,
    location: formData.location,
    featured: formData.featured,
    active: formData.active,
    order: Number(formData.order) || 0,
};

            const url = editingId
    ? `https://photography-website-api.onrender.com/api/testimonials/${editingId}`
    : "https://photography-website-api.onrender.com/api/testimonials";

            const method = editingId
                ? "PUT"
                : "POST";


            const response = await fetch(
                url,
                {
                    method,
headers: {
    "Content-Type": "application/json",
    Authorization:
        `Bearer ${token}`,
},

body: JSON.stringify(data),
                }
            );


            const result =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to save testimonial."
                );
            }


            const successMessage =
                editingId
                    ? "Testimonial updated successfully."
                    : "Testimonial added successfully.";


            resetForm(false);

            setSuccess(
                successMessage
            );


            setTimeout(() => {
                setSuccess("");
            }, 3000);


            await fetchTestimonials();

        } catch (error) {
            console.error(
                "Save Testimonial Error:",
                error
            );

            setError(
                error.message ||
                "Failed to save testimonial."
            );

        } finally {
            setSaving(false);
        }
    };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (
        testimonial
    ) => {
        setEditingId(
            testimonial._id
        );

        setFormData({
            quote:
                testimonial.quote || "",

            name:
                testimonial.name || "",

            event:
                testimonial.event || "",

            location:
                testimonial.location || "",

            featured:
                testimonial.featured === true,

            active:
                testimonial.active !== false,

            order:
                testimonial.order || 0,
        });

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // =========================================================
    // TOGGLE ACTIVE
    // =========================================================

    const handleToggleActive = async (
        testimonial
    ) => {
        try {
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem(
                    "adminToken"
                );

            if (!token) {
                window.location.href =
                    "/admin/login";
                return;
            }

            const response = await fetch(
                `https://photography-website-api.onrender.com/api/testimonials/${testimonial._id}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        active:
                            !testimonial.active,
                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update testimonial status."
                );
            }


            setSuccess(
                testimonial.active
                    ? "Testimonial deactivated successfully."
                    : "Testimonial activated successfully."
            );


            setTimeout(() => {
                setSuccess("");
            }, 3000);


            await fetchTestimonials();

        } catch (error) {
            console.error(
                "Toggle Testimonial Error:",
                error
            );

            setError(
                error.message ||
                "Failed to update testimonial status."
            );
        }
    };


    // =========================================================
    // TOGGLE FEATURED
    // =========================================================

    const handleToggleFeatured = async (
        testimonial
    ) => {
        try {
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem(
                    "adminToken"
                );

            if (!token) {
                window.location.href =
                    "/admin/login";
                return;
            }

            const response = await fetch(
                `https://photography-website-api.onrender.com/api/testimonials/${testimonial._id}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        featured:
                            !testimonial.featured,
                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update featured status."
                );
            }


            setSuccess(
                testimonial.featured
                    ? "Removed from featured testimonials."
                    : "Added to featured testimonials."
            );


            setTimeout(() => {
                setSuccess("");
            }, 3000);


            await fetchTestimonials();

        } catch (error) {
            console.error(
                "Toggle Featured Error:",
                error
            );

            setError(
                error.message ||
                "Failed to update featured status."
            );
        }
    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (
        id
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this testimonial?"
            );

        if (!confirmed) {
            return;
        }


        try {
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem(
                    "adminToken"
                );

            if (!token) {
                window.location.href =
                    "/admin/login";
                return;
            }


            const response = await fetch(
                `https://photography-website-api.onrender.com/api/testimonials/${id}`,
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
                    "Failed to delete testimonial."
                );
            }


            setSuccess(
                "Testimonial deleted successfully."
            );


            setTimeout(() => {
                setSuccess("");
            }, 3000);


            await fetchTestimonials();

        } catch (error) {
            console.error(
                "Delete Testimonial Error:",
                error
            );

            setError(
                error.message ||
                "Failed to delete testimonial."
            );
        }
    };


    return (
        <main className="admin-services">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <section className="admin-services-header">

                <div>

                    <p className="section-label">
                        ADMIN PANEL
                    </p>

                    <h1>
                        Testimonials
                        <span>
                            {" "}
                            management.
                        </span>
                    </h1>

                    <p>
                        Manage the client stories
                        displayed on your website.
                    </p>

                </div>

            </section>


            {/* =====================================================
                FORM
            ===================================================== */}

            <section className="admin-services-form-section">

                <div className="admin-section-header">

                    <div>

                        <p className="section-label">
                            {editingId
                                ? "EDIT TESTIMONIAL"
                                : "ADD TESTIMONIAL"}
                        </p>

                        <h2>
                            {editingId
                                ? "Update"
                                : "Add a new"}{" "}

                            <span>
                                testimonial.
                            </span>
                        </h2>

                    </div>


                    {editingId && (
                        <button
                            type="button"
                            className="admin-refresh-button"
                            onClick={() =>
                                resetForm()
                            }
                        >
                            Cancel Edit
                        </button>
                    )}

                </div>


                <form
                    className="admin-services-form"
                    onSubmit={handleSubmit}
                >

                    {/* Quote */}

                    <div className="form-group form-group-full">

                        <label htmlFor="testimonial-quote">
                            Client Quote *
                        </label>

                        <textarea
                            id="testimonial-quote"
                            name="quote"
                            value={
                                formData.quote
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter the client's testimonial..."
                            rows="6"
                            required
                        />

                    </div>


                    {/* Name */}

                    <div className="form-group">

                        <label htmlFor="testimonial-name">
                            Client Name *
                        </label>

                        <input
                            type="text"
                            id="testimonial-name"
                            name="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Example: Arun & Priya"
                            required
                        />

                    </div>


                    {/* Event */}

                    <div className="form-group">

                        <label htmlFor="testimonial-event">
                            Event *
                        </label>

                        <input
                            type="text"
                            id="testimonial-event"
                            name="event"
                            value={
                                formData.event
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Example: Wedding Photography"
                            required
                        />

                    </div>


                    {/* Location */}

                    <div className="form-group">

                        <label htmlFor="testimonial-location">
                            Location
                        </label>

                        <input
                            type="text"
                            id="testimonial-location"
                            name="location"
                            value={
                                formData.location
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Example: Chennai"
                        />

                    </div>


                    {/* Order */}

                    <div className="form-group">

                        <label htmlFor="testimonial-order">
                            Display Order
                        </label>

                        <input
                            type="number"
                            id="testimonial-order"
                            name="order"
                            value={
                                formData.order
                            }
                            onChange={
                                handleChange
                            }
                            min="0"
                        />

                    </div>


                    {/* Active */}

                    <div className="form-group">

                        <label className="admin-checkbox-label">

                            <input
                                type="checkbox"
                                name="active"
                                checked={
                                    formData.active
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <span>
                                Active Testimonial
                            </span>

                        </label>

                    </div>


                    {/* Featured */}

                    <div className="form-group">

                        <label className="admin-checkbox-label">

                            <input
                                type="checkbox"
                                name="featured"
                                checked={
                                    formData.featured
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <span>
                                Featured Testimonial
                            </span>

                        </label>

                    </div>


                    {/* Submit */}

                    <div className="admin-services-submit">

                        <button
                            type="submit"
                            className="booking-submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Testimonial →"
                                    : "Add Testimonial →"}
                        </button>

                    </div>

                </form>

            </section>


            {/* =====================================================
                MESSAGES
            ===================================================== */}

            {error && (
                <div className="admin-state admin-state-error">
                    {error}
                </div>
            )}


            {success && (
                <div className="premium-toast success-toast">

                    <div className="toast-icon">
                        ✓
                    </div>

                    <div className="toast-content">

                        <strong>
                            Success
                        </strong>

                        <span>
                            {success}
                        </span>

                    </div>

                    <button
                        type="button"
                        className="toast-close"
                        onClick={() =>
                            setSuccess("")
                        }
                    >
                        ×
                    </button>

                </div>
            )}


            {/* =====================================================
                TESTIMONIAL LIST
            ===================================================== */}

            <section className="admin-services-list">

                <div className="admin-section-header">

                    <div>

                        <p className="section-label">
                            CLIENT STORIES
                        </p>

                        <h2>
                            Your
                            <span>
                                {" "}
                                testimonials.
                            </span>
                        </h2>

                    </div>


                    <button
                        type="button"
                        className="admin-refresh-button"
                        onClick={
                            fetchTestimonials
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : "Refresh"}
                    </button>

                </div>


                {/* Loading */}

                {loading && (
                    <div className="admin-state">
                        Loading testimonials...
                    </div>
                )}


                {/* Empty */}

                {!loading &&
                    testimonials.length === 0 && (
                        <div className="admin-state">
                            No testimonials added yet.
                        </div>
                    )}


                {/* List */}

                {!loading &&
                    testimonials.length > 0 && (

                        <div className="admin-services-grid">

                            {testimonials.map(
                                (
                                    testimonial
                                ) => (

                                    <article
                                        className="admin-service-card"
                                        key={
                                            testimonial._id
                                        }
                                    >

                                        <div className="admin-service-card-inner">

                                            <div className="admin-service-card-top">

                                                <span>
                                                    {String(
                                                        testimonial.order
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>


                                                <button
                                                    type="button"
                                                    className={
                                                        testimonial.active
                                                            ? "service-status active"
                                                            : "service-status inactive"
                                                    }
                                                    onClick={() =>
                                                        handleToggleActive(
                                                            testimonial
                                                        )
                                                    }
                                                >
                                                    {testimonial.active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </button>

                                            </div>


                                            <div className="admin-service-card-content">

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "28px",
                                                        marginBottom:
                                                            "12px",
                                                        lineHeight:
                                                            "1",
                                                    }}
                                                >
                                                    “
                                                </div>

                                                <p>
                                                    {
                                                        testimonial.quote
                                                    }
                                                </p>


                                                <h3>
                                                    {
                                                        testimonial.name
                                                    }
                                                </h3>


                                                <span
                                                    style={{
                                                        display:
                                                            "block",
                                                        marginTop:
                                                            "6px",
                                                        fontSize:
                                                            "12px",
                                                        color:
                                                            "#777",
                                                    }}
                                                >
                                                    {
                                                        testimonial.event
                                                    }
                                                </span>


                                                {testimonial.location && (
                                                    <span
                                                        style={{
                                                            display:
                                                                "block",
                                                            marginTop:
                                                                "4px",
                                                            fontSize:
                                                                "11px",
                                                            color:
                                                                "#999",
                                                        }}
                                                    >
                                                        {
                                                            testimonial.location
                                                        }
                                                    </span>
                                                )}

                                            </div>


                                            <div className="admin-service-card-actions">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleFeatured(
                                                            testimonial
                                                        )
                                                    }
                                                >
                                                    {testimonial.featured
                                                        ? "★ Featured"
                                                        : "☆ Feature"}
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            testimonial
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            testimonial._id
                                                        )
                                                    }
                                                >
                                                    Delete
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

export default AdminTestimonials;
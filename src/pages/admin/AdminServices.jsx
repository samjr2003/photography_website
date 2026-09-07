import { useEffect, useState } from "react";

const AdminServices = () => {
    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        order: 0,
        active: true,
        image: null,
    });

    // =========================================================
    // FETCH SERVICES
    // =========================================================

    const fetchServices = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "https://photography-website-api.onrender.com/api/services/admin"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load services."
                );
            }

            console.log(
                "SERVICES LOADED:",
                data.services
            );

            setServices(data.services || []);

        } catch (error) {
            console.error(
                "Fetch Services Error:",
                error
            );

            setError(
                error.message ||
                "Unable to load services."
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // LOAD SERVICES WHEN PAGE OPENS
    // =========================================================

    useEffect(() => {
        fetchServices();
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
            setFormData((previous) => ({
                ...previous,
                image: files[0] || null,
            }));

            return;
        }

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

    const resetForm = (clearSuccess = true) => {
        setFormData({
            title: "",
            description: "",
            price: 0,
            order: 0,
            active: true,
            image: null,
        });

        setEditingId(null);
        setError("");

        if (clearSuccess) {
            setSuccess("");
        }

        const fileInput =
            document.getElementById(
                "service-image"
            );

        if (fileInput) {
            fileInput.value = "";
        }
    };

    // =========================================================
    // CREATE / UPDATE SERVICE
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("adminToken");

            if (!token) {
                window.location.href =
                    "/admin/login";
                return;
            }

            // =====================================================
            // FORM DATA
            // =====================================================

            const data = new FormData();

            data.append(
                "title",
                formData.title
            );

            data.append(
                "description",
                formData.description
            );

            data.append(
                "price",
                String(formData.price)
            );

            data.append(
                "order",
                String(formData.order)
            );

            data.append(
                "active",
                String(formData.active)
            );

            // Image
            if (formData.image) {
                data.append(
                    "image",
                    formData.image
                );
            }

            const url = editingId
    ? `https://photography-website-api.onrender.com/api/services/${editingId}`
    : "https://photography-website-api.onrender.com/api/services";

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,

                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },

                body: data,
            });

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to save service."
                );
            }

            // Save success message before resetting editingId
            const successMessage = editingId
                ? "Service updated successfully."
                : "Service added successfully.";

            // Reset form
            resetForm(false);

            // Show success toast
            setSuccess(successMessage);

            // Remove toast after 3 seconds
            setTimeout(() => {
                setSuccess("");
            }, 3000);

            // Refresh service list
            await fetchServices();

        } catch (error) {
            console.error(
                "Save Service Error:",
                error
            );

            setError(
                error.message ||
                "Failed to save service."
            );

        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // EDIT SERVICE
    // =========================================================

    const handleEdit = (service) => {
        setEditingId(service._id);

        setFormData({
            title: service.title || "",
            description:
                service.description || "",
            price: service.price || 0,
            order: service.order || 0,
            active:
                service.active !== false,
            image: null,
        });

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================================
    // TOGGLE ACTIVE / INACTIVE
    // =========================================================

    const handleToggleActive = async (service) => {
        try {
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("adminToken");

            if (!token) {
                window.location.href =
                    "/admin/login";
                return;
            }

            const formData = new FormData();

            formData.append(
                "active",
                String(!service.active)
            );

            const response = await fetch(
                `https://photography-website-api.onrender.com/api/services/${service._id}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: formData,
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update service status."
                );
            }

            setSuccess(
                service.active
                    ? "Service deactivated successfully."
                    : "Service activated successfully."
            );

            setTimeout(() => {
                setSuccess("");
            }, 3000);

            await fetchServices();

        } catch (error) {
            console.error(
                "Toggle Service Error:",
                error
            );

            setError(
                error.message ||
                "Failed to update service status."
            );
        }
    };

    // =========================================================
    // DELETE SERVICE
    // =========================================================

    const handleDelete = async (id) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this service?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("adminToken");

            if (!token) {
                window.location.href =
                    "/admin/login";
                return;
            }

            const response = await fetch(
                `https://photography-website-api.onrender.com/api/services/${id}`,
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
                    "Failed to delete service."
                );
            }

            setSuccess(
                "Service deleted successfully."
            );

            setTimeout(() => {
                setSuccess("");
            }, 3000);

            await fetchServices();

        } catch (error) {
            console.error(
                "Delete Service Error:",
                error
            );

            setError(
                error.message ||
                "Failed to delete service."
            );
        }
    };

    // =========================================================
    // UI
    // =========================================================

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
                        Services
                        <span>
                            {" "}
                            management.
                        </span>
                    </h1>

                    <p>
                        Manage the photography services
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
                                ? "EDIT SERVICE"
                                : "ADD SERVICE"}
                        </p>

                        <h2>
                            {editingId
                                ? "Update"
                                : "Add a new"}{" "}
                            <span>
                                service.
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
                    className="admin-services-form"
                    onSubmit={handleSubmit}
                >

                    {/* Title */}

                    <div className="form-group">

                        <label htmlFor="service-title">
                            Service Title *
                        </label>

                        <input
                            type="text"
                            id="service-title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Example: Wedding Photography"
                            required
                        />

                    </div>


                    {/* Price */}

                    <div className="form-group">

                        <label htmlFor="service-price">
                            Price
                        </label>

                        <input
                            type="number"
                            id="service-price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
                        />

                    </div>


                    {/* Description */}

                    <div className="form-group form-group-full">

                        <label htmlFor="service-description">
                            Description *
                        </label>

                        <textarea
                            id="service-description"
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            placeholder="Describe your photography service..."
                            rows="5"
                            required
                        />

                    </div>


                    {/* Image */}

                    <div className="form-group form-group-full">

                        <label htmlFor="service-image">
                            {editingId
                                ? "Replace Image"
                                : "Service Image *"}
                        </label>

                        <input
                            type="file"
                            id="service-image"
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


                    {/* Display Order */}

                    <div className="form-group">

                        <label htmlFor="service-order">
                            Display Order
                        </label>

                        <input
                            type="number"
                            id="service-order"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
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
                                onChange={handleChange}
                            />

                            <span>
                                Active Service
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
                                    ? "Update Service →"
                                    : "Add Service →"}
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
                SERVICE LIST
            ===================================================== */}

            <section className="admin-services-list">

                <div className="admin-section-header">

                    <div>

                        <p className="section-label">
                            YOUR SERVICES
                        </p>

                        <h2>
                            Photography
                            <span>
                                {" "}
                                services.
                            </span>
                        </h2>

                    </div>

                    <button
                        type="button"
                        className="admin-refresh-button"
                        onClick={fetchServices}
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
                        Loading services...
                    </div>
                )}


                {/* Empty */}

                {!loading &&
                    services.length === 0 && (
                        <div className="admin-state">
                            No services added yet.
                        </div>
                    )}


                {/* Services */}

                {!loading &&
                    services.length > 0 && (

                        <div className="admin-services-grid">

                            {services.map(
                                (service) => (

                                    <article
                                        className="admin-service-card"
                                        key={service._id}
                                    >

                                        {/* IMAGE */}

                                        {service.image && (
                                            <div className="admin-service-image">

                                                <img
                                                    src={service.image}
                                                    alt={service.title}
                                                />

                                            </div>
                                        )}


                                        <div className="admin-service-card-inner">

                                            <div className="admin-service-card-top">

                                                <span>
                                                    {String(
                                                        service.order
                                                    ).padStart(2, "0")}
                                                </span>

                                                <button
                                                    type="button"
                                                    className={
                                                        service.active
                                                            ? "service-status active"
                                                            : "service-status inactive"
                                                    }
                                                    onClick={() =>
                                                        handleToggleActive(
                                                            service
                                                        )
                                                    }
                                                >
                                                    {service.active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </button>

                                            </div>


                                            <div className="admin-service-card-content">

                                                <h3>
                                                    {service.title}
                                                </h3>

                                                <p>
                                                    {
                                                        service.description
                                                    }
                                                </p>

                                                {service.price >
                                                    0 && (
                                                        <strong>
                                                            ₹
                                                            {Number(
                                                                service.price
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>
                                                    )}

                                            </div>


                                            <div className="admin-service-card-actions">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            service
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            service._id
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

export default AdminServices;
import { useEffect, useState } from "react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    rejectedBookings: 0,
    cancelledBookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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
    const token = localStorage.getItem("adminToken");

    if (!token) {
      window.location.href = "/admin/login";
      return null;
    }

    return token;
  };

  // =========================================================
  // FETCH BOOKINGS
  // =========================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        return;
      }

      const response = await fetch(
        "https://photography-website-api.onrender.com/api/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch bookings."
        );
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Fetch Bookings Error:", error);

      setError(
        error.message || "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH BOOKING STATISTICS
  // =========================================================

  const fetchBookingStats = async () => {
    try {
      setStatsLoading(true);

      const token = getToken();

      if (!token) {
        return;
      }

      const response = await fetch(
        "https://photography-website-api.onrender.com/api/bookings/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch booking statistics."
        );
      }

      setStats({
        totalBookings: data.totalBookings || 0,
        pendingBookings: data.pendingBookings || 0,
        confirmedBookings: data.confirmedBookings || 0,
        rejectedBookings: data.rejectedBookings || 0,
        cancelledBookings: data.cancelledBookings || 0,
      });
    } catch (error) {
      console.error(
        "Fetch Booking Stats Error:",
        error
      );
    } finally {
      setStatsLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchBookings();
    fetchBookingStats();
  }, []);

  // =========================================================
  // REFRESH
  // =========================================================

  const refreshBookings = async () => {
    await Promise.all([
      fetchBookings(),
      fetchBookingStats(),
    ]);

    showToast(
      "success",
      "Booking information refreshed successfully."
    );
  };

  // =========================================================
  // UPDATE BOOKING STATUS
  // =========================================================

  const updateBookingStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const token = getToken();

      if (!token) {
        return;
      }

      const response = await fetch(
       `https://photography-website-api.onrender.com/api/bookings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingStatus: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update booking."
        );
      }

      // Update card immediately
      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === id
            ? {
                ...booking,
                bookingStatus: status,
              }
            : booking
        )
      );

      // Refresh statistics
      await fetchBookingStats();

      showToast(
        "success",
        `Booking marked as ${status.toLowerCase()}.`
      );
    } catch (error) {
      console.error(
        "Update Booking Error:",
        error
      );

      setError(
        error.message ||
          "Failed to update booking."
      );

      showToast(
        "error",
        error.message ||
          "Failed to update booking."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================================
  // DELETE BOOKING
  // =========================================================

  const deleteBooking = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(id);
      setError("");

      const token = getToken();

      if (!token) {
        return;
      }

      const response = await fetch(
        `https://photography-website-api.onrender.com/api/bookings/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete booking."
        );
      }

      setBookings((previous) =>
        previous.filter(
          (booking) => booking._id !== id
        )
      );

      await fetchBookingStats();

      showToast(
        "success",
        "Booking deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete Booking Error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete booking."
      );

      showToast(
        "error",
        error.message ||
          "Failed to delete booking."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "booking-status confirmed";

      case "Rejected":
        return "booking-status rejected";

      case "Cancelled":
        return "booking-status cancelled";

      default:
        return "booking-status pending";
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // FILTER BOOKINGS
  // =========================================================

  const filteredBookings = bookings.filter(
    (booking) => {
      const status =
        booking.bookingStatus || "Pending";

      const matchesStatus =
        activeFilter === "All" ||
        status === activeFilter;

      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        booking.name
          ?.toLowerCase()
          .includes(search) ||
        booking.email
          ?.toLowerCase()
          .includes(search) ||
        booking.phone
          ?.toLowerCase()
          .includes(search) ||
        booking.service
          ?.toLowerCase()
          .includes(search) ||
        booking.location
          ?.toLowerCase()
          .includes(search) ||
        booking.package
          ?.toLowerCase()
          .includes(search);

      return (
        matchesStatus &&
        matchesSearch
      );
    }
  );

  // =========================================================
  // FILTER COUNT
  // =========================================================

  const getFilterCount = (filter) => {
    if (filter === "All") {
      return stats.totalBookings;
    }

    if (filter === "Pending") {
      return stats.pendingBookings;
    }

    if (filter === "Confirmed") {
      return stats.confirmedBookings;
    }

    if (filter === "Rejected") {
      return stats.rejectedBookings;
    }

    if (filter === "Cancelled") {
      return stats.cancelledBookings;
    }

    return 0;
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <main className="admin-bookings-page">

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

      <section className="admin-bookings-header">

        <div>
          <p className="section-label">
            ADMIN PANEL
          </p>

          <h1>
            Booking
            <span> requests.</span>
          </h1>

          <p>
            Review and manage photography
            booking requests from your
            clients.
          </p>
        </div>

        <div className="admin-bookings-header-actions">

          <button
            className="admin-refresh-button"
            onClick={refreshBookings}
            disabled={
              loading || statsLoading
            }
          >
            {loading || statsLoading
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
          STATISTICS
      ===================================================== */}

      <section className="admin-booking-stats">

        {/* ALL */}

        <button
          type="button"
          className={`admin-booking-stat-card ${
            activeFilter === "All"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("All")
          }
        >
          <span className="admin-booking-stat-icon">
            ◇
          </span>

          <div>
            <span>
              TOTAL BOOKINGS
            </span>

            <strong>
              {statsLoading
                ? "—"
                : stats.totalBookings}
            </strong>
          </div>
        </button>

        {/* PENDING */}

        <button
          type="button"
          className={`admin-booking-stat-card pending-stat ${
            activeFilter === "Pending"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("Pending")
          }
        >
          <span className="admin-booking-stat-icon">
            ◷
          </span>

          <div>
            <span>
              PENDING
            </span>

            <strong>
              {statsLoading
                ? "—"
                : stats.pendingBookings}
            </strong>
          </div>
        </button>

        {/* CONFIRMED */}

        <button
          type="button"
          className={`admin-booking-stat-card confirmed-stat ${
            activeFilter === "Confirmed"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("Confirmed")
          }
        >
          <span className="admin-booking-stat-icon">
            ✓
          </span>

          <div>
            <span>
              CONFIRMED
            </span>

            <strong>
              {statsLoading
                ? "—"
                : stats.confirmedBookings}
            </strong>
          </div>
        </button>

        {/* REJECTED */}

        <button
          type="button"
          className={`admin-booking-stat-card rejected-stat ${
            activeFilter === "Rejected"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("Rejected")
          }
        >
          <span className="admin-booking-stat-icon">
            ×
          </span>

          <div>
            <span>
              REJECTED
            </span>

            <strong>
              {statsLoading
                ? "—"
                : stats.rejectedBookings}
            </strong>
          </div>
        </button>

        {/* CANCELLED */}

        <button
          type="button"
          className={`admin-booking-stat-card cancelled-stat ${
            activeFilter === "Cancelled"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("Cancelled")
          }
        >
          <span className="admin-booking-stat-icon">
            —
          </span>

          <div>
            <span>
              CANCELLED
            </span>

            <strong>
              {statsLoading
                ? "—"
                : stats.cancelledBookings}
            </strong>
          </div>
        </button>

      </section>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <section className="admin-booking-toolbar">

        <div className="admin-booking-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search bookings by name, email, phone..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() =>
                setSearchTerm("")
              }
            >
              ×
            </button>
          )}
        </div>

        <div className="admin-booking-filter-info">
          Showing{" "}
          <strong>
            {filteredBookings.length}
          </strong>{" "}
          of{" "}
          <strong>
            {bookings.length}
          </strong>{" "}
          bookings
        </div>

      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="admin-bookings-error">
          {error}
        </div>
      )}

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="admin-bookings-content">

        {loading && (
          <div className="admin-state">
            Loading booking requests...
          </div>
        )}

        {!loading &&
          bookings.length === 0 && (
            <div className="admin-state">
              No booking requests yet.
            </div>
          )}

        {!loading &&
          bookings.length > 0 &&
          filteredBookings.length === 0 && (
            <div className="admin-state">
              No bookings match your search
              or selected status.
            </div>
          )}

        {!loading &&
          filteredBookings.length > 0 && (
            <div className="admin-bookings-list">

              {filteredBookings.map(
                (booking) => (
                  <article
                    className="admin-booking-card"
                    key={booking._id}
                  >

                    {/* TOP */}

                    <div className="admin-booking-card-top">

                      <div>
                        <p className="booking-card-label">
                          BOOKING REQUEST
                        </p>

                        <h2>
                          {booking.name}
                        </h2>
                      </div>

                      <span
                        className={getStatusClass(
                          booking.bookingStatus
                        )}
                      >
                        {booking.bookingStatus ||
                          "Pending"}
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div className="admin-booking-details">

                      <div>
                        <span>
                          Email
                        </span>

                        <a
                          href={`mailto:${booking.email}`}
                        >
                          {booking.email}
                        </a>
                      </div>

                      <div>
                        <span>
                          Phone
                        </span>

                        <a
                          href={`tel:${booking.phone}`}
                        >
                          {booking.phone}
                        </a>
                      </div>

                      <div>
                        <span>
                          Photography
                        </span>

                        <strong>
                          {booking.service ||
                            "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Event Date
                        </span>

                        <strong>
                          {formatDate(
                            booking.date
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Location
                        </span>

                        <strong>
                          {booking.location ||
                            "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Package
                        </span>

                        <strong>
                          {booking.package ||
                            "—"}
                        </strong>
                      </div>

                    </div>

                    {/* MESSAGE */}

                    {booking.message && (
                      <div className="admin-booking-message">

                        <span>
                          Client Message
                        </span>

                        <p>
                          {booking.message}
                        </p>

                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="admin-booking-actions">

                      <button
                        className="booking-confirm-button"
                        disabled={
                          updatingId ===
                          booking._id
                        }
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "Confirmed"
                          )
                        }
                      >
                        {updatingId ===
                        booking._id
                          ? "Updating..."
                          : "Confirm"}
                      </button>

                      <button
                        className="booking-reject-button"
                        disabled={
                          updatingId ===
                          booking._id
                        }
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "Rejected"
                          )
                        }
                      >
                        Reject
                      </button>

                      <button
                        className="booking-cancel-button"
                        disabled={
                          updatingId ===
                          booking._id
                        }
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "Cancelled"
                          )
                        }
                      >
                        Cancel
                      </button>

                      <button
                        className="booking-delete-button"
                        disabled={
                          updatingId ===
                          booking._id
                        }
                        onClick={() =>
                          deleteBooking(
                            booking._id
                          )
                        }
                      >
                        Delete
                      </button>

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

export default AdminBookings;
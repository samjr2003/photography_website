import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);

  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    rejectedBookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "null"
  );

  // =========================================================
  // FETCH DASHBOARD DATA
  // =========================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      // -------------------------------------------------------
      // GET BOOKING STATISTICS
      // -------------------------------------------------------

      const statsResponse = await fetch(
        "http://localhost:5000/api/admin/booking-stats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const statsData = await statsResponse.json();

      console.log(
        "DASHBOARD STATS:",
        statsData
      );

      if (!statsResponse.ok) {
        throw new Error(
          statsData.message ||
            "Failed to load dashboard statistics."
        );
      }

      // IMPORTANT:
      // Use the values coming directly from backend.
      setStats({
        totalBookings:
          Number(statsData.totalBookings) || 0,

        pendingBookings:
          Number(statsData.pendingBookings) || 0,

        confirmedBookings:
          Number(statsData.confirmedBookings) || 0,

        rejectedBookings:
          Number(statsData.rejectedBookings) || 0,
      });


      // -------------------------------------------------------
      // GET BOOKINGS FOR TABLE
      // -------------------------------------------------------

      const bookingsResponse = await fetch(
        "http://localhost:5000/api/admin/bookings",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bookingsData =
        await bookingsResponse.json();

      if (!bookingsResponse.ok) {
        throw new Error(
          bookingsData.message ||
            "Failed to load bookings."
        );
      }

      const bookingList =
        Array.isArray(bookingsData)
          ? bookingsData
          : bookingsData.bookings ||
            bookingsData.data ||
            [];

      setBookings(bookingList);

    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load dashboard."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // UPDATE BOOKING STATUS
  // =========================================================

  const updateBookingStatus = async (
    bookingId,
    status
  ) => {
    try {
      setError("");

      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `http://localhost:5000/api/admin/bookings/${bookingId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            bookingStatus: status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update booking."
        );
      }

      // Update table immediately
      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                bookingStatus: status,
              }
            : booking
        )
      );

      // Reload dashboard statistics
      await loadDashboard();

    } catch (error) {
      console.error(
        "Update Booking Error:",
        error
      );

      setError(
        error.message ||
          "Failed to update booking status."
      );
    }
  };


  // =========================================================
  // DELETE BOOKING
  // =========================================================

  const deleteBooking = async (
    bookingId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this booking?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `http://localhost:5000/api/admin/bookings/${bookingId}`,
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
            "Failed to delete booking."
        );
      }

      // Reload dashboard
      await loadDashboard();

    } catch (error) {
      console.error(
        "Delete Booking Error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete booking."
      );
    }
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminUser"
    );

    window.location.href =
      "/admin/login";
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadDashboard();
  }, []);


  return (
    <main className="admin-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-brand">
          <span>LENS</span>
          <strong>STUDIO</strong>
        </div>


        <nav className="admin-sidebar-nav">

          <a
            href="/admin/dashboard"
            className="active"
          >
            Dashboard
          </a>

          <a href="/admin/bookings">
            Bookings
          </a>

          <a href="/admin/portfolio">
            Portfolio
          </a>

          <a href="/admin/dashboard">
            Services
          </a>

          <a href="/admin/dashboard">
            Testimonials
          </a>

        </nav>


        <button
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="admin-dashboard-content">


        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="admin-dashboard-header">

          <div>

            <p className="section-label">
              ADMIN PANEL
            </p>

            <h1>
              Welcome back,
              <span>
                {" "}
                {adminUser?.name ||
                  "Admin"}.
              </span>
            </h1>

          </div>


          <button
            className="admin-mobile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </header>


        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="admin-stats">


          <div className="admin-stat-card">

            <span>
              Total Bookings
            </span>

            <strong>
              {stats.totalBookings}
            </strong>

          </div>


          <div className="admin-stat-card">

            <span>
              Pending
            </span>

            <strong>
              {stats.pendingBookings}
            </strong>

          </div>


          <div className="admin-stat-card">

            <span>
              Confirmed
            </span>

            <strong>
              {stats.confirmedBookings}
            </strong>

          </div>


          <div className="admin-stat-card">

            <span>
              Rejected
            </span>

            <strong>
              {stats.rejectedBookings}
            </strong>

          </div>

        </section>


        {/* ===================================================
            BOOKINGS
        =================================================== */}

        <section className="admin-bookings-section">


          <div className="admin-section-header">

            <div>

              <p className="section-label">
                RECENT ACTIVITY
              </p>

              <h2>
                Booking
                <span>
                  {" "}
                  requests.
                </span>
              </h2>

            </div>


            <button
              className="admin-refresh-button"
              onClick={loadDashboard}
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>


          {/* ERROR */}

          {error && (

            <div className="admin-state admin-state-error">
              {error}
            </div>

          )}


          {/* LOADING */}

          {loading && !error && (

            <div className="admin-state">
              Loading bookings...
            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            bookings.length === 0 && (

              <div className="admin-state">
                No booking requests yet.
              </div>

            )}


          {/* =================================================
              BOOKINGS TABLE
          ================================================= */}

          {!loading &&
            !error &&
            bookings.length > 0 && (

              <div className="admin-bookings-table-wrapper">

                <table className="admin-bookings-table">

                  <thead>

                    <tr>

                      <th>
                        Client
                      </th>

                      <th>
                        Service
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Location
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {bookings.map(
                      (booking) => (

                        <tr
                          key={
                            booking._id
                          }
                        >

                          <td>

                            <div className="admin-client">

                              <strong>
                                {
                                  booking.name
                                }
                              </strong>

                              <span>
                                {
                                  booking.email
                                }
                              </span>

                              <span>
                                {
                                  booking.phone
                                }
                              </span>

                            </div>

                          </td>


                          <td>
                            {
                              booking.service ||
                              "—"
                            }
                          </td>


                          <td>

                            {booking.date
                              ? new Date(
                                  booking.date
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}

                          </td>


                          <td>
                            {
                              booking.location ||
                              "—"
                            }
                          </td>


                          <td>

                            <select
                              className="admin-status-select"
                              value={
                                booking.bookingStatus ||
                                "Pending"
                              }
                              onChange={(e) =>
                                updateBookingStatus(
                                  booking._id,
                                  e.target.value
                                )
                              }
                            >

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="Confirmed">
                                Confirmed
                              </option>

                              <option value="Rejected">
                                Rejected
                              </option>

                              <option value="Cancelled">
                                Cancelled
                              </option>

                            </select>

                          </td>


                          <td>

                            <button
                              className="admin-delete-button"
                              onClick={() =>
                                deleteBooking(
                                  booking._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

        </section>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="admin-dashboard-footer">

          <p>
            Lens Studio Admin Panel
          </p>

          <span>
            {stats.totalBookings}{" "}
            {stats.totalBookings === 1
              ? "booking"
              : "bookings"}{" "}
            in system
          </span>

        </div>

      </section>

    </main>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const [userError, setUserError] = useState("");
    const [eventError, setEventError] = useState("");
    const [bookingError, setBookingError] = useState("");

    const token = localStorage.getItem("Token");


    // =====================================
    // FETCH USERS
    // =====================================

    async function fetchUsers() {

        try {

            const response = await axios.get(
                "http://localhost:4000/api/getData",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(response.data.data);

        } catch (error) {

            console.log(error);

            setUserError(
                error.response?.data?.message ||
                "Failed to load users"
            );

        } finally {

            setLoadingUsers(false);

        }
    }


    // =====================================
    // FETCH EVENTS
    // =====================================

    async function fetchEvents() {

        try {

            const response = await axios.get(
                "http://localhost:4000/api/events"
            );

            setEvents(response.data.events);

        } catch (error) {

            console.log(error);

            setEventError(
                error.response?.data?.message ||
                "Failed to load events"
            );

        } finally {

            setLoadingEvents(false);

        }
    }


    // =====================================
    // FETCH BOOKINGS
    // =====================================

    async function fetchBookings() {

        try {

            const response = await axios.get(
                "http://localhost:4000/api/bookings/admin",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBookings(response.data.bookings);

        } catch (error) {

            console.log(error);

            setBookingError(
                error.response?.data?.message ||
                "Failed to load bookings"
            );

        } finally {

            setLoadingBookings(false);

        }
    }


    // =====================================
    // ACTIVATE / DEACTIVATE USER
    // =====================================

    async function handleStatusChange(user) {

        const newStatus = !user.isActive;

        try {

            await axios.patch(
                `http://localhost:4000/api/admin/users/${user._id}/status`,
                {
                    isActive: newStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                newStatus
                    ? "User activated successfully"
                    : "User deactivated successfully"
            );

            fetchUsers();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update user status"
            );
        }
    }


    // =====================================
    // CHANGE USER ROLE
    // =====================================

    async function handleRoleChange(user, newRole) {

        if (newRole === user.role) {
            return;
        }

        try {

            await axios.patch(
                `http://localhost:4000/api/admin/users/${user._id}/role`,
                {
                    role: newRole
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("User role updated successfully");

            fetchUsers();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update user role"
            );
        }
    }


    // =====================================
    // DELETE USER
    // =====================================

    async function handleDeleteUser(user) {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${user.name}?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:4000/api/admin/users/${user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("User deleted successfully");

            fetchUsers();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        }
    }


    // =====================================
    // CHANGE EVENT STATUS
    // =====================================

    async function handleEventStatus(event, newStatus) {

        try {

            await axios.put(
                `http://localhost:4000/api/events/${event._id}`,
                {
                    status: newStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                `Event ${newStatus} successfully`
            );

            fetchEvents();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update event"
            );
        }
    }


    // =====================================
    // DELETE EVENT
    // =====================================

    async function handleDeleteEvent(event) {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${event.title}"?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:4000/api/events/${event._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Event deleted successfully");

            fetchEvents();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete event"
            );
        }
    }


    // =====================================
    // LOAD EVERYTHING
    // =====================================

    useEffect(() => {

        fetchUsers();
        fetchEvents();
        fetchBookings();

    }, []);


    // =====================================
    // LOADING
    // =====================================

    if (
        loadingUsers ||
        loadingEvents ||
        loadingBookings
    ) {

        return (
            <h2>
                Loading Admin Dashboard...
            </h2>
        );
    }


    // =====================================
    // DASHBOARD
    // =====================================

    return (

        <div>

            <h1>
                Admin Dashboard
            </h1>


            {/* ================================= */}
            {/* USER MANAGEMENT */}
            {/* ================================= */}

            <h2>
                All Registered Users
            </h2>

            {userError ? (

                <p>
                    {userError}
                </p>

            ) : (

                <>
                    <p>
                        Total Users: {users.length}
                    </p>

                    <hr />

                    {users.map((user) => (

                        <div
                            key={user._id}
                            style={{
                                border: "1px solid black",
                                padding: "20px",
                                margin: "15px 0",
                                maxWidth: "600px"
                            }}
                        >

                            <h3>
                                {user.name}
                            </h3>

                            <p>
                                <strong>Email:</strong>{" "}
                                {user.email}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {user.phone ||
                                    "Not provided"}
                            </p>

                            <p>
                                <strong>Role:</strong>{" "}
                                {user.role}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}

                                {user.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </p>

                            <hr />

                            <button
                                onClick={() =>
                                    handleStatusChange(user)
                                }
                            >

                                {user.isActive
                                    ? "Deactivate User"
                                    : "Activate User"}

                            </button>

                            {" "}

                            <label>

                                <strong>
                                    Change Role:
                                </strong>{" "}

                                <select
                                    value={user.role}
                                    onChange={(e) =>
                                        handleRoleChange(
                                            user,
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="attendee">
                                        Attendee
                                    </option>

                                    <option value="organizer">
                                        Organizer
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>

                                </select>

                            </label>

                            <br />
                            <br />

                            <button
                                onClick={() =>
                                    handleDeleteUser(user)
                                }
                            >
                                Delete User
                            </button>

                        </div>

                    ))}
                </>

            )}


            {/* ================================= */}
            {/* EVENT MANAGEMENT */}
            {/* ================================= */}

            <hr />

            <h2>
                Event Management
            </h2>

            <p>
                Total Events: {events.length}
            </p>

            <hr />

            {eventError ? (

                <p>
                    {eventError}
                </p>

            ) : events.length === 0 ? (

                <h3>
                    No events available.
                </h3>

            ) : (

                events.map((event) => (

                    <div
                        key={event._id}
                        style={{
                            border: "1px solid black",
                            padding: "20px",
                            margin: "20px 0",
                            maxWidth: "700px"
                        }}
                    >

                        <h2>
                            {event.title}
                        </h2>

                        <p>
                            {event.description}
                        </p>

                        <p>
                            <strong>
                                Category:
                            </strong>{" "}
                            {event.category}
                        </p>

                        <p>
                            <strong>
                                Venue:
                            </strong>{" "}
                            {event.venue}
                        </p>

                        <p>
                            <strong>
                                Location:
                            </strong>{" "}
                            {event.location}
                        </p>

                        <p>
                            <strong>
                                Date:
                            </strong>{" "}
                            {new Date(event.date)
                                .toLocaleDateString()}
                        </p>

                        <p>
                            <strong>
                                Time:
                            </strong>{" "}
                            {event.startTime} -{" "}
                            {event.endTime}
                        </p>

                        <p>
                            <strong>
                                Organizer:
                            </strong>{" "}
                            {event.organizer?.name ||
                                "Unknown"}
                        </p>

                        <p>
                            <strong>
                                Status:
                            </strong>{" "}
                            {event.status}
                        </p>


                        <h3>
                            Tickets
                        </h3>


                        {event.ticketTypes?.map(
                            (ticket) => (

                                <div
                                    key={ticket._id}
                                >

                                    <p>
                                        <strong>
                                            {ticket.name}
                                        </strong>
                                        {" - ₹"}
                                        {ticket.price}
                                    </p>

                                    <p>
                                        Sold:{" "}
                                        {ticket.sold}
                                        {" / "}
                                        {ticket.capacity}
                                    </p>

                                </div>

                            )
                        )}


                        <hr />


                        {event.status === "draft" && (

                            <button
                                onClick={() =>
                                    handleEventStatus(
                                        event,
                                        "published"
                                    )
                                }
                            >
                                Publish Event
                            </button>

                        )}

                        {" "}


                        {event.status !== "cancelled" &&
                            event.status !== "completed" && (

                                <button
                                    onClick={() =>
                                        handleEventStatus(
                                            event,
                                            "cancelled"
                                        )
                                    }
                                >
                                    Cancel Event
                                </button>

                            )}

                        {" "}


                        <button
                            onClick={() =>
                                handleDeleteEvent(event)
                            }
                        >
                            Delete Event
                        </button>

                    </div>

                ))

            )}


            {/* ================================= */}
            {/* BOOKING MANAGEMENT */}
            {/* ================================= */}

            <hr />

            <h2>
                Booking Management
            </h2>

            <p>
                Total Bookings: {bookings.length}
            </p>

            <hr />


            {bookingError ? (

                <p>
                    {bookingError}
                </p>

            ) : bookings.length === 0 ? (

                <h3>
                    No bookings found.
                </h3>

            ) : (

                bookings.map((booking) => (

                    <div
                        key={booking._id}
                        style={{
                            border: "1px solid black",
                            padding: "20px",
                            margin: "20px 0",
                            maxWidth: "700px"
                        }}
                    >

                        <h3>
                            Booking Reference
                        </h3>

                        <p>
                            <strong>
                                {booking.bookingReference}
                            </strong>
                        </p>


                        <hr />


                        <h3>
                            Attendee
                        </h3>

                        <p>
                            <strong>
                                Name:
                            </strong>{" "}
                            {booking.attendee?.name ||
                                "Unknown"}
                        </p>

                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {booking.attendee?.email ||
                                "Unknown"}
                        </p>

                        <p>
                            <strong>
                                Phone:
                            </strong>{" "}
                            {booking.attendee?.phone ||
                                "Not provided"}
                        </p>


                        <hr />


                        <h3>
                            Event
                        </h3>

                        <p>
                            <strong>
                                Event:
                            </strong>{" "}
                            {booking.event?.title ||
                                "Unknown"}
                        </p>

                        <p>
                            <strong>
                                Venue:
                            </strong>{" "}
                            {booking.event?.venue ||
                                "Unknown"}
                        </p>

                        <p>
                            <strong>
                                Location:
                            </strong>{" "}
                            {booking.event?.location ||
                                "Unknown"}
                        </p>

                        <p>
                            <strong>
                                Event Date:
                            </strong>{" "}
                            {booking.event?.date
                                ? new Date(
                                    booking.event.date
                                ).toLocaleDateString()
                                : "Unknown"}
                        </p>


                        <hr />


                        <h3>
                            Ticket Details
                        </h3>

                        <p>
                            <strong>
                                Ticket Type:
                            </strong>{" "}
                            {booking.ticketTypeName}
                        </p>

                        <p>
                            <strong>
                                Quantity:
                            </strong>{" "}
                            {booking.quantity}
                        </p>

                        <p>
                            <strong>
                                Price per Ticket:
                            </strong>{" "}
                            ₹{booking.unitPrice}
                        </p>

                        <p>
                            <strong>
                                Total Amount:
                            </strong>{" "}
                            ₹{booking.totalAmount}
                        </p>


                        <p>
                            <strong>
                                Booking Status:
                            </strong>{" "}

                            {booking.status}
                        </p>


                        <p>
                            <strong>
                                Booking Date:
                            </strong>{" "}

                            {booking.createdAt
                                ? new Date(
                                    booking.createdAt
                                ).toLocaleString()
                                : "Unknown"}
                        </p>

                    </div>

                ))

            )}

        </div>

    );
}

export default AdminDashboard;
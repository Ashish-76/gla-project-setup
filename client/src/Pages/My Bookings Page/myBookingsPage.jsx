import React, { useEffect, useState } from "react";
import axios from "axios";

function MyBookingsPage() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {

        try {

            const token = localStorage.getItem("Token");

            const response = await axios.get(
                "http://localhost:4000/api/bookings/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBookings(response.data.bookings);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    }


    async function handleCancel(bookingId) {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) {
            return;
        }

        try {

            const token = localStorage.getItem("Token");

            const response = await axios.post(
                `http://localhost:4000/api/bookings/${bookingId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message);

            // Refresh bookings
            fetchBookings();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to cancel booking"
            );
        }
    }


    if (loading) {
        return <h2>Loading bookings...</h2>;
    }


    return (
        <div>

            <h1>My Bookings</h1>

            {bookings.length === 0 ? (

                <h2>No bookings found</h2>

            ) : (

                bookings.map((booking) => (

                    <div key={booking._id}>

                        <h2>{booking.ticketTypeName}</h2>

                        <p>
                            Booking Reference:{" "}
                            {booking.bookingReference}
                        </p>

                        <p>
                            Quantity: {booking.quantity}
                        </p>

                        <p>
                            Price per ticket: ₹{booking.unitPrice}
                        </p>

                        <p>
                            Total: ₹{booking.totalAmount}
                        </p>

                        <p>
                            Status: {booking.status}
                        </p>

                        {booking.status !== "cancelled" && (

                            <button
                                onClick={() =>
                                    handleCancel(booking._id)
                                }
                            >
                                Cancel Booking
                            </button>

                        )}

                        <hr />

                    </div>

                ))

            )}

        </div>
    );
}

export default MyBookingsPage;
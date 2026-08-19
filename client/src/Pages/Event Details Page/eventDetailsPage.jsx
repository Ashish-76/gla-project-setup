import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EventDetailsPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedTicket, setSelectedTicket] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    async function fetchEvent() {
        try {

            const response = await axios.get(
                `http://localhost:4000/api/events/${id}`
            );

            setEvent(response.data.event);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load event"
            );

        } finally {
            setLoading(false);
        }
    }

    function handleTicketChange(e) {
        setSelectedTicket(e.target.value);
        setQuantity(1);
    }

    function increaseQuantity() {

        const ticket = event.ticketTypes.find(
            (ticket) => ticket._id === selectedTicket
        );

        if (!ticket) return;

        const available =
            ticket.capacity - ticket.sold;

        if (quantity < available) {
            setQuantity(quantity + 1);
        }
    }

    function decreaseQuantity() {

        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    async function handleBooking() {

        if (!selectedTicket) {
            alert("Please select a ticket type");
            return;
        }

        const token = localStorage.getItem("Token");

        if (!token) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:4000/api/bookings",
                {
                    eventId: event._id,
                    ticketTypeId: selectedTicket,
                    quantity: quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message);

            navigate("/my-bookings");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Booking failed"
            );
        }
    }

    if (loading) {
        return <h2>Loading event...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!event) {
        return <h2>Event not found</h2>;
    }

    const selectedTicketData =
        event.ticketTypes.find(
            (ticket) => ticket._id === selectedTicket
        );

    const totalAmount =
        selectedTicketData
            ? selectedTicketData.price * quantity
            : 0;

    return (
        <div>

            <button onClick={() => navigate("/events")}>
                ← Back to Events
            </button>

            <h1>{event.title}</h1>

            <p>{event.description}</p>

            <hr />

            <p>
                <strong>Category:</strong>{" "}
                {event.category}
            </p>

            <p>
                <strong>Venue:</strong>{" "}
                {event.venue}
            </p>

            <p>
                <strong>Location:</strong>{" "}
                {event.location}
            </p>

            <p>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
            </p>

            <p>
                <strong>Time:</strong>{" "}
                {event.startTime} - {event.endTime}
            </p>

            <hr />

            <h2>Select Ticket</h2>

            <select
                value={selectedTicket}
                onChange={handleTicketChange}
            >

                <option value="">
                    -- Select Ticket Type --
                </option>

                {event.ticketTypes.map((ticket) => {

                    const available =
                        ticket.capacity - ticket.sold;

                    return (
                        <option
                            key={ticket._id}
                            value={ticket._id}
                            disabled={available === 0}
                        >
                            {ticket.name} - ₹{ticket.price}
                            {" | Available: "}
                            {available}
                        </option>
                    );
                })}

            </select>

            {selectedTicketData && (

                <div>

                    <h3>
                        {selectedTicketData.name}
                    </h3>

                    <p>
                        Price: ₹{selectedTicketData.price}
                    </p>

                    <p>
                        Available:{" "}
                        {selectedTicketData.capacity -
                            selectedTicketData.sold}
                    </p>

                    <button onClick={decreaseQuantity}>
                        -
                    </button>

                    <span
                        style={{
                            margin: "0 15px"
                        }}
                    >
                        {quantity}
                    </span>

                    <button onClick={increaseQuantity}>
                        +
                    </button>

                    <h3>
                        Total: ₹{totalAmount}
                    </h3>

                    <button onClick={handleBooking}>
                        Book Tickets
                    </button>

                </div>
            )}

        </div>
    );
}

export default EventDetailsPage;
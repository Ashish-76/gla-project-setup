import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EventsPage() {

    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(
        localStorage.getItem("User")
    );

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {

            const response = await axios.get(
                "http://localhost:4000/api/events"
            );

            setEvents(response.data.events);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load events"
            );

        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <h2>Loading events...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>

            <h1>Events</h1>

            <h2>
                Welcome {user?.name}
            </h2>

            <p>
                Logged in as: {user?.role}
            </p>

            <hr />

            <h2>Available Events</h2>

            {events.length === 0 ? (

                <p>
                    No events available.
                </p>

            ) : (

                events.map((event) => (

                    <div
                        key={event._id}
                        style={{
                            border: "1px solid black",
                            padding: "20px",
                            margin: "20px 0",
                            maxWidth: "600px"
                        }}
                    >

                        <h2>
                            {event.title}
                        </h2>

                        <p>
                            {event.description}
                        </p>

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

                        <h3>Tickets</h3>

                        {event.ticketTypes?.map((ticket) => (

                            <div key={ticket._id}>

                                <p>
                                    <strong>
                                        {ticket.name}
                                    </strong>
                                    {" - ₹"}
                                    {ticket.price}
                                    {" | Available: "}
                                    {ticket.capacity - ticket.sold}
                                </p>
                                <button
                                     onClick={() => navigate(`/events/${event._id}`)}>
                                             View Event
                                </button>

                            </div>

                        ))}

                    </div>

                ))
            )}

        </div>
    );
}

export default EventsPage;
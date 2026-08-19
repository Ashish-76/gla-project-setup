import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrganizerPage() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("User") || "null"
    );

    const [event, setEvent] = useState({
        title: "",
        description: "",
        category: "",
        venue: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        image: "",
        status: "draft"
    });

    const [tickets, setTickets] = useState([
        {
            name: "General",
            price: "",
            capacity: ""
        }
    ]);

    const [loading, setLoading] = useState(false);


    function handleChange(e) {

        setEvent({
            ...event,
            [e.target.name]: e.target.value
        });

    }


    function handleTicketChange(index, e) {

        const updatedTickets = [...tickets];

        updatedTickets[index][e.target.name] =
            e.target.value;

        setTickets(updatedTickets);

    }


    function addTicketType() {

        setTickets([
            ...tickets,
            {
                name: "",
                price: "",
                capacity: ""
            }
        ]);

    }


    function removeTicketType(index) {

        if (tickets.length === 1) {
            return;
        }

        setTickets(
            tickets.filter((_, i) => i !== index)
        );

    }


    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setLoading(true);

            const token = localStorage.getItem("Token");

            if (!token) {
                alert("Please login first");
                navigate("/login");
                return;
            }

            const ticketTypes = tickets.map((ticket) => ({
                name: ticket.name,
                price: Number(ticket.price),
                capacity: Number(ticket.capacity)
            }));

            const response = await axios.post(
                "http://localhost:4000/api/events",
                {
                    ...event,
                    ticketTypes
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message);

            navigate("/organizer/events");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to create event"
            );

        } finally {

            setLoading(false);

        }

    }


    return (
        <div>

            {/* WELCOME SECTION */}

            <h1>
                Welcome {user?.name || "Organizer"}
            </h1>

            <p>
                Create and manage your events from your organizer dashboard.
            </p>

            <p>
                Role: <strong>{user?.role || "organizer"}</strong>
            </p>

            <hr />

            <button
                type="button"
                onClick={() => navigate("/organizer/events")}
            >
                Manage My Events
            </button>

            <button
                type="button"
                onClick={() => navigate("/events")}
            >
                View All Events
            </button>

            <hr />


            {/* CREATE EVENT */}

            <h1>Create Event</h1>

            <form onSubmit={handleSubmit}>

                <h2>Event Details</h2>

                <input
                    type="text"
                    name="title"
                    placeholder="Event Title"
                    value={event.title}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <textarea
                    name="description"
                    placeholder="Event Description"
                    value={event.description}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={event.category}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="text"
                    name="venue"
                    placeholder="Venue"
                    value={event.venue}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={event.location}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <label>
                    Event Date:
                </label>

                <input
                    type="date"
                    name="date"
                    value={event.date}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <label>
                    Start Time:
                </label>

                <input
                    type="time"
                    name="startTime"
                    value={event.startTime}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <label>
                    End Time:
                </label>

                <input
                    type="time"
                    name="endTime"
                    value={event.endTime}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="text"
                    name="image"
                    placeholder="Image URL (optional)"
                    value={event.image}
                    onChange={handleChange}
                />

                <hr />

                {/* TICKET TYPES */}

                <h2>Ticket Types</h2>

                {tickets.map((ticket, index) => (

                    <div key={index}>

                        <h3>
                            Ticket {index + 1}
                        </h3>

                        <input
                            type="text"
                            name="name"
                            placeholder="Ticket Name"
                            value={ticket.name}
                            onChange={(e) =>
                                handleTicketChange(index, e)
                            }
                            required
                        />

                        <br />
                        <br />

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            min="0"
                            value={ticket.price}
                            onChange={(e) =>
                                handleTicketChange(index, e)
                            }
                            required
                        />

                        <br />
                        <br />

                        <input
                            type="number"
                            name="capacity"
                            placeholder="Capacity"
                            min="1"
                            value={ticket.capacity}
                            onChange={(e) =>
                                handleTicketChange(index, e)
                            }
                            required
                        />

                        <br />
                        <br />

                        {tickets.length > 1 && (

                            <button
                                type="button"
                                onClick={() =>
                                    removeTicketType(index)
                                }
                            >
                                Remove Ticket
                            </button>

                        )}

                        <hr />

                    </div>

                ))}

                <button
                    type="button"
                    onClick={addTicketType}
                >
                    + Add Ticket Type
                </button>

                <br />
                <br />

                {/* EVENT STATUS */}

                <label>
                    Event Status:
                </label>

                <select
                    name="status"
                    value={event.status}
                    onChange={handleChange}
                >
                    <option value="draft">
                        Draft
                    </option>

                    <option value="published">
                        Published
                    </option>
                </select>

                <br />
                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Event"}
                </button>

            </form>

        </div>
    );
}

export default OrganizerPage;
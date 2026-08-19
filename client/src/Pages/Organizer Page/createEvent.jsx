import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateEvent() {

    const navigate = useNavigate();

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

    const [ticketTypes, setTicketTypes] = useState([
        {
            name: "",
            price: 0,
            capacity: 1
        }
    ]);

    const [saving, setSaving] = useState(false);


    // EVENT INPUT
    function handleChange(e) {

        setEvent({
            ...event,
            [e.target.name]: e.target.value
        });
    }


    // TICKET INPUT
    function handleTicketChange(index, field, value) {

        const updatedTickets = [...ticketTypes];

        updatedTickets[index] = {
            ...updatedTickets[index],
            [field]:
                field === "price" || field === "capacity"
                    ? Number(value)
                    : value
        };

        setTicketTypes(updatedTickets);
    }


    // ADD TICKET TYPE
    function addTicketType() {

        setTicketTypes([
            ...ticketTypes,
            {
                name: "",
                price: 0,
                capacity: 1
            }
        ]);
    }


    // REMOVE TICKET TYPE
    function removeTicketType(index) {

        if (ticketTypes.length === 1) {
            alert("At least one ticket type is required");
            return;
        }

        const updatedTickets =
            ticketTypes.filter(
                (_, ticketIndex) =>
                    ticketIndex !== index
            );

        setTicketTypes(updatedTickets);
    }


    // CREATE EVENT
    async function handleSubmit(e) {

        e.preventDefault();

        if (ticketTypes.length === 0) {
            alert("Add at least one ticket type");
            return;
        }

        for (const ticket of ticketTypes) {

            if (!ticket.name.trim()) {
                alert("Ticket name is required");
                return;
            }

            if (ticket.price < 0) {
                alert("Ticket price cannot be negative");
                return;
            }

            if (ticket.capacity < 1) {
                alert("Ticket capacity must be at least 1");
                return;
            }
        }


        try {

            setSaving(true);

            const token =
                localStorage.getItem("Token");

            if (!token) {
                alert("Please login first");
                navigate("/login");
                return;
            }


            const response = await axios.post(
                "http://localhost:4000/api/events",
                {
                    ...event,
                    ticketTypes
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
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

            setSaving(false);

        }
    }


    return (
        <div>

            <h1>Create New Event</h1>

            <button
                type="button"
                onClick={() =>
                    navigate("/organizer/events")
                }
            >
                Back to My Events
            </button>

            <hr />


            <form onSubmit={handleSubmit}>

                <h2>Event Details</h2>


                <label>
                    Event Title
                </label>

                <br />

                <input
                    type="text"
                    name="title"
                    value={event.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    required
                />

                <br />
                <br />


                <label>
                    Description
                </label>

                <br />

                <textarea
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    placeholder="Enter event description"
                    required
                />

                <br />
                <br />


                <label>
                    Category
                </label>

                <br />

                <input
                    type="text"
                    name="category"
                    value={event.category}
                    onChange={handleChange}
                    placeholder="Example: Music"
                    required
                />

                <br />
                <br />


                <label>
                    Venue
                </label>

                <br />

                <input
                    type="text"
                    name="venue"
                    value={event.venue}
                    onChange={handleChange}
                    placeholder="Example: Sanjay Palace"
                    required
                />

                <br />
                <br />


                <label>
                    Location
                </label>

                <br />

                <input
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    placeholder="Example: Agra"
                    required
                />

                <br />
                <br />


                <label>
                    Date
                </label>

                <br />

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
                    Start Time
                </label>

                <br />

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
                    End Time
                </label>

                <br />

                <input
                    type="time"
                    name="endTime"
                    value={event.endTime}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />


                <label>
                    Status
                </label>

                <br />

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


                <hr />


                <h2>Ticket Types</h2>


                {ticketTypes.map(
                    (ticket, index) => (

                        <div
                            key={index}
                            style={{
                                border: "1px solid black",
                                padding: "15px",
                                marginBottom: "15px"
                            }}
                        >

                            <h3>
                                Ticket {index + 1}
                            </h3>


                            <label>
                                Ticket Name
                            </label>

                            <br />

                            <input
                                type="text"
                                value={ticket.name}
                                onChange={(e) =>
                                    handleTicketChange(
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                }
                                placeholder="Example: General"
                                required
                            />

                            <br />
                            <br />


                            <label>
                                Price
                            </label>

                            <br />

                            <input
                                type="number"
                                min="0"
                                value={ticket.price}
                                onChange={(e) =>
                                    handleTicketChange(
                                        index,
                                        "price",
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <br />
                            <br />


                            <label>
                                Capacity
                            </label>

                            <br />

                            <input
                                type="number"
                                min="1"
                                value={ticket.capacity}
                                onChange={(e) =>
                                    handleTicketChange(
                                        index,
                                        "capacity",
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <br />
                            <br />


                            <button
                                type="button"
                                onClick={() =>
                                    removeTicketType(index)
                                }
                            >
                                Remove Ticket
                            </button>

                        </div>

                    )
                )}


                <button
                    type="button"
                    onClick={addTicketType}
                >
                    + Add Another Ticket Type
                </button>

                <br />
                <br />


                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Creating Event..."
                        : "Create Event"}
                </button>

            </form>

        </div>
    );
}

export default CreateEvent;
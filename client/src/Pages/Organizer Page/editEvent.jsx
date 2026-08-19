import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditEvent() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

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
        status: "draft",
        ticketTypes: []
    });


    // GET EVENT
    useEffect(() => {
        fetchEvent();
    }, [id]);


    async function fetchEvent() {

        try {

            const response = await axios.get(
                `http://localhost:4000/api/events/${id}`
            );

            const data = response.data.event;

            setEvent({
                title: data.title,
                description: data.description,
                category: data.category,
                venue: data.venue,
                location: data.location,
                date: data.date
                    ? data.date.substring(0, 10)
                    : "",
                startTime: data.startTime,
                endTime: data.endTime,
                image: data.image || "",
                status: data.status,
                ticketTypes: data.ticketTypes.map(ticket => ({
                    _id: ticket._id,
                    name: ticket.name,
                    price: ticket.price,
                    capacity: ticket.capacity,
                    sold: ticket.sold
                }))
            });

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


    // NORMAL INPUT CHANGE
    function handleChange(e) {

        setEvent({
            ...event,
            [e.target.name]: e.target.value
        });
    }


    // TICKET CHANGE
    function handleTicketChange(index, field, value) {

        const updatedTickets = [...event.ticketTypes];

        updatedTickets[index] = {
            ...updatedTickets[index],
            [field]:
                field === "price" || field === "capacity"
                    ? Number(value)
                    : value
        };

        setEvent({
            ...event,
            ticketTypes: updatedTickets
        });
    }


    // SAVE EVENT
    async function handleSubmit(e) {

        e.preventDefault();

        setSaving(true);

        try {

            const token = localStorage.getItem("Token");

            await axios.put(
                `http://localhost:4000/api/events/${id}`,
                event,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Event updated successfully");

            navigate("/organizer/events");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update event"
            );

        } finally {

            setSaving(false);

        }
    }


    if (loading) {
        return <h2>Loading event...</h2>;
    }


    if (error) {
        return <h2>{error}</h2>;
    }


    return (
        <div>

            <h1>Edit Event</h1>

            <form onSubmit={handleSubmit}>

                <label>
                    Title
                </label>

                <br />

                <input
                    type="text"
                    name="title"
                    value={event.title}
                    onChange={handleChange}
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

                    <option value="cancelled">
                        Cancelled
                    </option>

                    <option value="completed">
                        Completed
                    </option>

                </select>

                <br />
                <br />


                <h2>Ticket Types</h2>


                {event.ticketTypes.map(
                    (ticket, index) => (

                        <div
                            key={ticket._id}
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
                                Name
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
                            />

                            <br />
                            <br />


                            <label>
                                Capacity
                            </label>

                            <br />

                            <input
                                type="number"
                                min={ticket.sold}
                                value={ticket.capacity}
                                onChange={(e) =>
                                    handleTicketChange(
                                        index,
                                        "capacity",
                                        e.target.value
                                    )
                                }
                            />

                            <br />
                            <br />

                            <p>
                                Tickets already sold:{" "}
                                {ticket.sold}
                            </p>

                        </div>

                    )
                )}


                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save Changes"}
                </button>

                {" "}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/organizer/events")
                    }
                >
                    Cancel
                </button>

            </form>

        </div>
    );
}

export default EditEvent;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManageEvents() {

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // FETCH MY EVENTS
    useEffect(() => {
        fetchMyEvents();
    }, []);


    async function fetchMyEvents() {

        try {

            const token = localStorage.getItem("Token");

            if (!token) {
                alert("Please login first");
                navigate("/login");
                return;
            }

            const response = await axios.get(
                "http://localhost:4000/api/events/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEvents(response.data.events);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load your events"
            );

        } finally {

            setLoading(false);

        }
    }


    // DELETE EVENT
    async function handleDelete(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("Token");

            await axios.delete(
                `http://localhost:4000/api/events/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Event deleted successfully");

            fetchMyEvents();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete event"
            );
        }
    }


    // PUBLISH EVENT
    async function handlePublish(id) {

        try {

            const token = localStorage.getItem("Token");

            await axios.put(
                `http://localhost:4000/api/events/${id}`,
                {
                    status: "published"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Event published successfully");

            fetchMyEvents();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to publish event"
            );
        }
    }


    // UNPUBLISH EVENT
    async function handleUnpublish(id) {

        const confirmUnpublish = window.confirm(
            "Are you sure you want to move this event back to draft?"
        );

        if (!confirmUnpublish) {
            return;
        }

        try {

            const token = localStorage.getItem("Token");

            await axios.put(
                `http://localhost:4000/api/events/${id}`,
                {
                    status: "draft"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Event moved to draft");

            fetchMyEvents();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to unpublish event"
            );
        }
    }


    // LOADING
    if (loading) {
        return <h2>Loading your events...</h2>;
    }


    // ERROR
    if (error) {
        return <h2>{error}</h2>;
    }


    return (
        <div>

            <h1>Manage My Events</h1>


            {/* NAVIGATION BUTTONS */}

            <button
                onClick={() =>
                    navigate("/organizer")
                }
            >
                Back to Dashboard
            </button>

            {" "}

            <button
                onClick={() =>
                    navigate("/organizer/events/create")
                }
            >
                Create New Event
            </button>

            <hr />


            {/* NO EVENTS */}

            {events.length === 0 ? (

                <h2>
                    You have not created any events yet.
                </h2>

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

                        {/* EVENT TITLE */}

                        <h2>
                            {event.title}
                        </h2>


                        {/* DESCRIPTION */}

                        <p>
                            {event.description}
                        </p>


                        {/* CATEGORY */}

                        <p>
                            <strong>
                                Category:
                            </strong>{" "}
                            {event.category}
                        </p>


                        {/* VENUE */}

                        <p>
                            <strong>
                                Venue:
                            </strong>{" "}
                            {event.venue}
                        </p>


                        {/* LOCATION */}

                        <p>
                            <strong>
                                Location:
                            </strong>{" "}
                            {event.location}
                        </p>


                        {/* DATE */}

                        <p>
                            <strong>
                                Date:
                            </strong>{" "}
                            {new Date(event.date)
                                .toLocaleDateString()}
                        </p>


                        {/* TIME */}

                        <p>
                            <strong>
                                Time:
                            </strong>{" "}
                            {event.startTime} - {event.endTime}
                        </p>


                        {/* STATUS */}

                        <p>
                            <strong>
                                Status:
                            </strong>{" "}
                            {event.status}
                        </p>


                        {/* TICKETS */}

                        <h3>
                            Tickets
                        </h3>


                        {event.ticketTypes.map((ticket) => (

                            <div key={ticket._id}>

                                <p>
                                    <strong>
                                        {ticket.name}
                                    </strong>

                                    {" - ₹"}

                                    {ticket.price}
                                </p>

                                <p>
                                    Sold: {ticket.sold} / {ticket.capacity}
                                </p>

                            </div>

                        ))}


                        <br />


                        {/* EDIT BUTTON */}

                        <button
                            onClick={() =>
                                navigate(
                                    `/organizer/events/edit/${event._id}`
                                )
                            }
                        >
                            Edit
                        </button>

                        {" "}


                        {/* PUBLISH / UNPUBLISH BUTTON */}

                        {event.status === "draft" ? (

                            <button
                                onClick={() =>
                                    handlePublish(event._id)
                                }
                            >
                                Publish
                            </button>

                        ) : (

                            <button
                                onClick={() =>
                                    handleUnpublish(event._id)
                                }
                            >
                                Unpublish
                            </button>

                        )}

                        {" "}


                        {/* DELETE BUTTON */}

                        <button
                            onClick={() =>
                                handleDelete(event._id)
                            }
                        >
                            Delete
                        </button>


                    </div>

                ))
            )}

        </div>
    );
}


export default ManageEvents;
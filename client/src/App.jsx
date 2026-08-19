import React from "react";
import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import RegistrationPage from "./Pages/Registration Page/registrationPage";
import LoginPage from "./Pages/Login Page/loginPage";
import AdminDashboard from "./Pages/Admin Page/admin";

import EventsPage from "./Pages/Event Page/eventsPage";
import OrganizerPage from "./Pages/Organizer Page/organizerPage";

import EventDetailsPage from "./Pages/Event Details Page/eventDetailsPage";
import MyBookingsPage from "./Pages/My Bookings Page/myBookingsPage";
import ManageEvents from "./Pages/Organizer Page/manageEvents";

import EditEvent from "./Pages/Organizer Page/editEvent";
import CreateEvent from "./Pages/Organizer Page/createEvent";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<LoginPage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegistrationPage />}
                />

                <Route
                    path="/events"
                    element={<EventsPage />}
                />

                <Route
                    path="/organizer"
                    element={<OrganizerPage />}
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />
                <Route
                    path="/events/:id"
                     element={<EventDetailsPage />}
                />
                <Route 
                    path="/my-bookings"
                    element={<MyBookingsPage />} />
                <Route
                   path="/organizer/events"
                 element={<ManageEvents />}/>
                <Route
                    path="/organizer/events/edit/:id"
                    element={<EditEvent />}
                    />

                <Route
                    path="/organizer/events/create"
                        element={<CreateEvent />}
                    />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
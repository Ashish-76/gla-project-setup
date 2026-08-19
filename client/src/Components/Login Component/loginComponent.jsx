import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginComponent() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:4000/api/auth/login",
                user
            );

            const token = response.data.token;
            const loggedInUser = response.data.user;

            // Store authentication information
            localStorage.setItem("Token", token);
            localStorage.setItem(
                "User",
                JSON.stringify(loggedInUser)
            );

            alert(response.data.message);

            console.log("Logged in user:", loggedInUser);
            console.log("Role:", loggedInUser.role);

            // Role based navigation

            if (loggedInUser.role === "admin") {

                navigate("/admin");

            } else if (loggedInUser.role === "organizer") {

                navigate("/organizer");

            } else {

                navigate("/events");

            }

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    }

    return (
        <section>

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <input
                    placeholder="Enter Your Email"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />

                <br />

                <input
                    placeholder="Enter Your Password"
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                />

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

        </section>
    );
}

export default LoginComponent;
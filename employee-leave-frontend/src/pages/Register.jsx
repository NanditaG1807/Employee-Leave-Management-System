
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./css/Register.css";

function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const response = await api.post(
                "/auth/register",
                formData
            );

            setMessage(
                response.data.message || response.data
            );

            setFormData({
                name: "",
                email: "",
                password: ""
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="register-container">

            <div className="register-card">

                <h1>Employee Leave Management</h1>

                <h2>Create Account</h2>

                <p className="subtitle">
                    Register to manage your leaves
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={8}
                        required
                    />

                    <button type="submit">
                        Register
                    </button>

                </form>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {String(error)}
                    </p>
                )}

            <p className="login-link">
    Already have an account?{" "}
    <Link to="/login">Login</Link>
</p>

            </div>

        </div>
    );
}

export default Register;

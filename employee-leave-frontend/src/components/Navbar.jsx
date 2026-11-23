
import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/Navbar.css";

function Navbar({ role = "EMPLOYEE" }) {

    const navigate = useNavigate();

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        user = null;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="main-navbar">

            <div className="navbar-brand">
                <h2>SETTribe</h2>
                <span>Employee Leave Management</span>
            </div>

            <div className="navbar-right">

                <span className="navbar-user">
                    Welcome, {user?.name || "User"}
                </span>

                <span className="navbar-role">
                    {role === "ADMIN"
                        ? "Admin Portal"
                        : "Employee Portal"}
                </span>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;


import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/Sidebar.css";

function Sidebar({ role = "EMPLOYEE" }) {

    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = role === "ADMIN";
    let user = null;

try {
    user = JSON.parse(localStorage.getItem("user") || "null");
} catch {
    user = null;
}

    const menuItems = isAdmin
                    ? [
                {
                    name: "Dashboard",
                    path: "/admin-dashboard",
                    icon: "🏠"
                },
                {
                    name: "Pending Leave Requests",
                     path: "/admin-pending-leaves",
                    icon: "⏳"
                }
            ]
        : [
            {
                name: "Dashboard",
                path: "/dashboard",
                icon: "🏠"
            },
            {
                name: "Apply Leave",
                path: "/apply-leave",
                icon: "📝"
            },
            {
                name: "Leave History",
                path: "/leave-history",
                icon: "📅"
            }
        ];

    return (
        <aside className="main-sidebar">

            <div className="sidebar-profile">

                <div className="profile-icon">
                    {isAdmin ? "👨‍💼" : "👤"}
                </div>

                <h3>
                    {user?.name || "User"}
                </h3>

                <p>
                    {isAdmin ? "Admin Portal" : "Employee Portal"}
                </p>
            </div>

            <div className="sidebar-menu">

                <h4>MENU</h4>

                {menuItems.map((item) => (

                    <div
                        key={item.name}
                            className={`sidebar-item ${
                                location.pathname === item.path
                                    ? "active"
                                    : ""
                            }`}
                        onClick={() => navigate(item.path)}
                    >

                        <span>{item.icon}</span>

                        <span>{item.name}</span>

                    </div>

                ))}

            </div>

        </aside>
    );
}

export default Sidebar;

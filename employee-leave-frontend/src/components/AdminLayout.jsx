
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./css/AdminLayout.css";

function AdminLayout() {
    return (
        <div className="admin-container">

            <Navbar role="ADMIN" />

            <div className="admin-layout">

                <Sidebar role="ADMIN" />

                <main className="admin-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;

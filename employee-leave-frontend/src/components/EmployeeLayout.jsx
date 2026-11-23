
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./css/EmployeeLayout.css";

function EmployeeLayout() {

    return (
        <div className="dashboard-container">

            <Navbar role="EMPLOYEE" />

            <div className="dashboard-layout">

                <Sidebar role="EMPLOYEE" />

                <main className="dashboard-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default EmployeeLayout;

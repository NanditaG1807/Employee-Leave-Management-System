
import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveHistory from "./pages/LeaveHistory";
import AdminDashboard from "./pages/AdminDashboard";

import EmployeeLayout from "./components/EmployeeLayout";
import AdminLayout from "./components/AdminLayout";
import PendingLeaves from "./pages/PendingLeaves";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Login and Register */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Employee Layout */}
                <Route element={<EmployeeLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/apply-leave"
                        element={<ApplyLeave />}
                    />

                    <Route
                        path="/leave-history"
                        element={<LeaveHistory />}
                    />

                </Route>

                {/* Admin Layout */}
            <Route element={<AdminLayout />}>
                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin-pending-leaves"
                        element={<PendingLeaves />}
                    />
                </Route>
            </Routes>

        </BrowserRouter>
    );
}

export default App;

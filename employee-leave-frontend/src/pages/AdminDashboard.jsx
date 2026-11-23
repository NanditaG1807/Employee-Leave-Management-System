
import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./css/AdminDashboard.css";

function AdminDashboard() {

    const [leaves, setLeaves] = useState([]);

    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalLeaves: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        rejectedLeaves: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/admin/leaves", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setLeaves(
                Array.isArray(response.data) ? response.data : []
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to fetch employee leaves"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/leaves/dashboard/stats",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStats(response.data);

        } catch (err) {
            console.log("Stats Error:", err);
        }
    };

    useEffect(() => {
        fetchLeaves();
        fetchStats();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/admin/leaves/${id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(`Leave ${status} successfully!`);

            await fetchLeaves();
            await fetchStats();

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to update leave status"
            );
        }
    };

    return (
        <div className="admin-dashboard-page">

            <div className="admin-dashboard-content">

                <h2 className="section-title">
                
                    Employee Leave Statistics
                        <br></br>
                </h2>

                {/* Statistics Cards */}

                <div className="employee-stats-container">

                    <div className="employee-stat-card">
                        <h3>Total Employees</h3>
                        <h2>{stats.totalEmployees}</h2>
                    </div>

                    <div className="employee-stat-card">
                        <h3>Total Leave Requests</h3>
                        <h2>{stats.totalLeaves}</h2>
                    </div>

                    <div className="employee-stat-card pending">
                        <h3>Pending</h3>
                        <h2>{stats.pendingLeaves}</h2>
                    </div>

                    <div className="employee-stat-card approved">
                        <h3>Approved</h3>
                        <h2>{stats.approvedLeaves}</h2>
                    </div>

                    <div className="employee-stat-card rejected">
                        <h3>Rejected</h3>
                        <h2>{stats.rejectedLeaves}</h2>
                    </div>

                </div>

                {/* Pending Leave Requests */}

                <div className="recent-leaves">

                    <h2 className="section-title">
                        All Employee Leave Requests
                    </h2>

                    {loading && <p>Loading...</p>}

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    {!loading && !error && leaves.length === 0 && (
                        <p>No leave requests found.</p>
                    )}

                    {!loading && !error && leaves.length > 0 && (

                        <div className="recent-table-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Leave Type</th>
                                        <th>From Date</th>
                                        <th>To Date</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {leaves.map((leave) => (

                                        <tr key={leave.id}>

                                            <td>
                                                {leave.user?.name || "Employee"}
                                            </td>

                                            <td>{leave.leaveType}</td>
                                            <td>{leave.fromDate}</td>
                                            <td>{leave.toDate}</td>
                                            <td>{leave.reason}</td>

                                            <td>
                                                <span className={`employee-status ${leave.status?.toLowerCase()}`}>
                                                    {leave.status}
                                                </span>
                                            </td>

                                            <td>
                                                {leave.status === "PENDING" && (

                                                    <div className="admin-actions">

                                                        <button
                                                            className="approve-btn"
                                                            onClick={() =>
                                                                updateStatus(leave.id, "APPROVED")
                                                            }
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            className="reject-btn"
                                                            onClick={() =>
                                                                updateStatus(leave.id, "REJECTED")
                                                            }
                                                        >
                                                            Reject
                                                        </button>

                                                    </div>

                                                )}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;

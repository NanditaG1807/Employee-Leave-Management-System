
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./css/Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    let user = null;

    try {
        const storedUser = localStorage.getItem("user");

        if (storedUser && storedUser !== "undefined") {
            user = JSON.parse(storedUser);
        }
    } catch (err) {
        console.error("User parsing error:", err);
    }

    // Fetch Employee Leaves
    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/leaves", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setLeaves(
                Array.isArray(response.data) ? response.data : []
            );

        } catch (err) {
            console.error("Leave Fetch Error:", err);
            setError("Unable to fetch leave details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    // Leave Statistics
    const totalLeaves = leaves.length;

    const pendingLeaves = leaves.filter(
        leave => leave.status === "PENDING"
    ).length;

    const approvedLeaves = leaves.filter(
        leave => leave.status === "APPROVED"
    ).length;

    const rejectedLeaves = leaves.filter(
        leave => leave.status === "REJECTED"
    ).length;

    return (
        <div className="dashboard-page">

            <div className="dashboard-content">

                

                {/* Leave Statistics */}

                <h2 className="section-title">
                    My Leave Statistics
                </h2>

                {loading ? (
                    <p>Loading statistics...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (

                    <div className="employee-stats-container">

                        <div className="employee-stat-card">
                            <h3>Total Applied</h3>
                            <h2>{totalLeaves}</h2>
                        </div>

                        <div className="employee-stat-card pending">
                            <h3>Pending</h3>
                            <h2>{pendingLeaves}</h2>
                        </div>

                        <div className="employee-stat-card approved">
                            <h3>Approved</h3>
                            <h2>{approvedLeaves}</h2>
                        </div>

                        <div className="employee-stat-card rejected">
                            <h3>Rejected</h3>
                            <h2>{rejectedLeaves}</h2>
                        </div>

                    </div>
                )}

                {/* Dashboard Cards */}

                <div className="dashboard-cards">

                    <div className="dashboard-card">

                        <h3>Apply Leave</h3>

                        <p>Submit your leave application.</p>

                        <button
                            onClick={() => navigate("/apply-leave")}
                        >
                            Apply Now
                        </button>

                    </div>

                    <div className="dashboard-card">

                        <h3>Leave History</h3>

                        <p>Check your previous leave records.</p>

                        <button
                            onClick={() => navigate("/leave-history")}
                        >
                            View History
                        </button>

                    </div>

                </div>

                {/* Recent Leave Applications */}

                <div className="recent-leaves">

                    <h2 className="section-title">
                        Recent Leave Applications
                    </h2>

                    {loading ? (

                        <p>Loading leave history...</p>

                    ) : !error && leaves.length === 0 ? (

                        <p>No leave applications found.</p>

                    ) : !error && (

                        <div className="recent-table-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>Leave Type</th>
                                        <th>From Date</th>
                                        <th>To Date</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {[...leaves]
                                        .sort((a, b) =>
                                            new Date(b.createdAt) -
                                            new Date(a.createdAt)
                                        )
                                        .slice(0, 5)
                                        .map(leave => (

                                            <tr key={leave.id}>

                                                <td>{leave.leaveType}</td>
                                                <td>{leave.fromDate}</td>
                                                <td>{leave.toDate}</td>
                                                <td>{leave.reason}</td>

                                                <td>
                                                    <span className={`employee-status ${leave.status?.toLowerCase()}`}>
                                                        {leave.status}
                                                    </span>
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

export default Dashboard;

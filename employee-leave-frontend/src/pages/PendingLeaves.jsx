
import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./css/AdminDashboard.css";

function PendingLeaves() {

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPendingLeaves = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/admin/leaves", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const pending = response.data.filter(
                leave => leave.status === "PENDING"
            );

            setLeaves(pending);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to fetch pending leaves"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingLeaves();
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

            fetchPendingLeaves();

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to update leave status"
            );
        }
    };

    return (
        <div className="admin-dashboard-content">

            <h1>Pending Leave Requests</h1>

            {loading && <p>Loading...</p>}

            {error && (
                <p className="error-message">{error}</p>
            )}

            {!loading && !error && leaves.length === 0 && (
                <p>No pending leave requests found.</p>
            )}

            {!loading && !error && leaves.length > 0 && (

                <div className="admin-table-container">

                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Leave Type</th>
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Reason</th>
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}

        </div>
    );
}

export default PendingLeaves;

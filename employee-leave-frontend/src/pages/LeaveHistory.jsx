
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./css/LeaveHistory.css";

function LeaveHistory() {

    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Filter States
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    // Edit States
    const [editingLeave, setEditingLeave] = useState(null);
    const [editMessage, setEditMessage] = useState("");
    const [editError, setEditError] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/leaves", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setLeaves(response.data);
            setError("");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to fetch leave history"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    // Delete Leave
    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this leave?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await api.delete(`/leaves/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Leave deleted successfully!");

            await fetchLeaves();

        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to delete leave"
            );
        }
    };

    // Open Edit Form
    const handleEdit = (leave) => {

        if (leave.status?.toUpperCase() !== "PENDING") {
            return;
        }

        setEditingLeave({
            id: leave.id,
            leaveType: leave.leaveType,
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            reason: leave.reason
        });

        setEditMessage("");
        setEditError("");
    };

    // Handle Edit Form Changes
    const handleEditChange = (e) => {

        setEditingLeave({
            ...editingLeave,
            [e.target.name]: e.target.value
        });
    };

    // Update Leave
    const handleUpdate = async (e) => {

        e.preventDefault();

        setEditMessage("");
        setEditError("");

        if (editingLeave.fromDate > editingLeave.toDate) {
            setEditError("From Date cannot be after To Date");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const updateData = {
                leaveType: editingLeave.leaveType,
                fromDate: editingLeave.fromDate,
                toDate: editingLeave.toDate,
                reason: editingLeave.reason
            };

            await api.put(
                `/leaves/${editingLeave.id}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEditMessage("Leave updated successfully!");

            setEditingLeave(null);

            await fetchLeaves();

        } catch (err) {
            setEditError(
                err.response?.data?.message ||
                "Unable to update leave"
            );
        } finally {
            setSaving(false);
        }
    };

    // Filter Functionality
    const filteredLeaves = leaves.filter((leave) => {

        const matchesStatus =
            statusFilter === "ALL" ||
            leave.status?.toUpperCase() === statusFilter;

        const matchesType =
            typeFilter === "ALL" ||
            leave.leaveType?.toUpperCase() === typeFilter;

        return matchesStatus && matchesType;
    });

    return (
        <div className="history-container">
<br></br>
            <h2>My Leave</h2>

            {/* Edit Form */}
            {editingLeave && (

                <div className="edit-leave-container">

                    <h3>Edit Pending Leave</h3>

                    <form onSubmit={handleUpdate}>

                        <label>Leave Type</label>

                        <select
                            name="leaveType"
                            value={editingLeave.leaveType}
                            onChange={handleEditChange}
                            required
                        >
                            <option value="SICK">Sick Leave</option>
                            <option value="CASUAL">Casual Leave</option>
                            <option value="EARNED">Earned Leave</option>
                        </select>

                        <label>From Date</label>

                        <input
                            type="date"
                            name="fromDate"
                            value={editingLeave.fromDate}
                            onChange={handleEditChange}
                            required
                        />

                        <label>To Date</label>

                        <input
                            type="date"
                            name="toDate"
                            value={editingLeave.toDate}
                            min={editingLeave.fromDate}
                            onChange={handleEditChange}
                            required
                        />

                        <label>Reason</label>

                        <textarea
                            name="reason"
                            value={editingLeave.reason}
                            onChange={handleEditChange}
                            required
                        />

                        <button type="submit" disabled={saving}>
                            {saving ? "Updating..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setEditingLeave(null)}
                        >
                            Cancel
                        </button>

                    </form>

                </div>
            )}

            {editMessage && (
                <p className="success-message">{editMessage}</p>
            )}

            {editError && (
                <p className="error-message">{editError}</p>
            )}

            {/* Filters */}
            <div className="filter-container">

                <div className="filter-group">
                    <label>Filter by Status</label>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Filter by Leave Type</label>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="ALL">All Leave Types</option>
                        <option value="SICK">Sick Leave</option>
                        <option value="CASUAL">Casual Leave</option>
                        <option value="EARNED">Earned Leave</option>
                    </select>
                </div>

                <button
                    className="reset-filter-btn"
                    onClick={() => {
                        setStatusFilter("ALL");
                        setTypeFilter("ALL");
                    }}
                >
                    Reset Filters
                </button>

            </div>

            {loading && <p>Loading leave history...</p>}

            {error && (
                <p className="error-message">{error}</p>
            )}

            {!loading && !error && leaves.length === 0 && (
                <p>No leave records found.</p>
            )}

            {!loading && !error && leaves.length > 0 && (

                <>
                    <p className="filter-result">
                        Showing {filteredLeaves.length} of {leaves.length} records
                    </p>

                    {filteredLeaves.length === 0 ? (

                        <p>No leave records found for selected filters.</p>

                    ) : (

                        <div className="table-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>Leave Type</th>
                                        <th>From Date</th>
                                        <th>To Date</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredLeaves.map((leave) => (

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

                                            <td>
                                                {leave.status?.toUpperCase() === "PENDING" && (
                                                    <>
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(leave)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => handleDelete(leave.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}
                </>
            )}

            <button
                className="back-btn"
                onClick={() => navigate("/dashboard")}
            >
                Back to Dashboard
            </button>

        </div>
    );
}

export default LeaveHistory;

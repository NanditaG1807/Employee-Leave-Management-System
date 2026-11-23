
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./css/ApplyLeave.css";


function ApplyLeave() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: ""
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
        const token = localStorage.getItem("token");

        await api.post(
            "/leaves",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setMessage("Leave application submitted successfully!");

        setFormData({
            leaveType: "",
            fromDate: "",
            toDate: "",
            reason: ""
        });

    } catch (err) {
        setError(
            typeof err.response?.data === "string"
                ? err.response.data
                : err.response?.data?.message || "Leave application failed"
        );
    }
};


    return (
        <div className="apply-leave-container">

            <div className="apply-leave-card">

                <h2>Apply For Leave</h2>

                <form onSubmit={handleSubmit}>

                    <label>Leave Type<span className="required-star">*</span></label >

                    <select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Leave Type</option>
                        <option value="SICK">Sick Leave</option>
                        <option value="CASUAL">Casual Leave</option>
                        <option value="EARNED">Earned Leave</option>
                    </select>

                    <label>From Date <span className="required-star">*</span></label>

                 <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    onKeyDown={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                    required
                />

                    <label>To Date<span className="required-star">*</span></label>

              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                min={formData.fromDate || undefined}
                onKeyDown={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                required
            />

                    <label>Reason <span className="required-star">*</span></label>

                    <textarea
                        name="reason"
                        placeholder="Enter leave reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                    />

                   <button type="submit">
                        Submit Leave
                    </button>

                </form>

                {message && (
                    <p className="success-message">{message}</p>
                )}

                {error && (
                    <p className="error-message">{String(error)}</p>
                )}

                 <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>

            </div>
         

        </div>
        
    );
      
}

export default ApplyLeave;

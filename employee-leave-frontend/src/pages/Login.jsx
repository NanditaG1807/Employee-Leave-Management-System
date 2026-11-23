
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./css/login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


try {
    const response = await api.post("/auth/login", formData);

    localStorage.setItem("token", response.data.token);

    // Save complete user details
    const user = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
    };

    localStorage.setItem("user", JSON.stringify(user));

    // Get role directly from backend response
    const role = response.data.role;

    if (role === "ADMIN") {
        navigate("/admin-dashboard");
    } 
    else if (role === "EMPLOYEE") {
        navigate("/dashboard");
    }

} catch (error) {
    console.log("LOGIN ERROR:", error.response?.data);
    setError("Invalid Email or Password");
}

 };
  return (
    <div className="login-container">
      <h2>Employee Leave Management System</h2>


      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p className="login-link">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;

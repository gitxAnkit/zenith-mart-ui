// src/axiosInstance.js
import axios from "axios";

const api = axios.create({
    // baseURL: "https://zenith-mart.onrender.com/api/v1",
    baseURL: "http://localhost:4000/api/v1",
    withCredentials: true,
});

export default api;

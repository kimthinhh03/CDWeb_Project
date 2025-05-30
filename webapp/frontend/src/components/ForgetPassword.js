import React, { useState } from "react";
import axios from "axios";
import "../css/ForgetPassword.css";

const ForgetPassword = () => {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/auth/forget-password", { username });
            setMessage(res.data.message || "Vui lòng kiểm tra email của bạn.");
        } catch (err) {
            setMessage("Tên người dùng không tồn tại hoặc lỗi hệ thống.");
        }
    };

    return (
        <div className="forget-password-container">
            <h2>Quên mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Tên người dùng:</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Nhập tên người dùng"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <button type="submit">Gửi mã xác nhận</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default ForgetPassword;

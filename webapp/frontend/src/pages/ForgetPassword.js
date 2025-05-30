import { useState } from "react";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email format (đơn giản)
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Email không hợp lệ.");
            setMessage("");
            return;
        }

        try {
            // Gọi API quên mật khẩu ở đây (giả lập)
            // const response = await fetch('/api/forgot-password', { method: 'POST', body: JSON.stringify({ email }), headers: { 'Content-Type': 'application/json' } });
            // const result = await response.json();

            setMessage("Nếu email tồn tại, bạn sẽ nhận được hướng dẫn khôi phục mật khẩu.");
            setError("");
        } catch (e) {
            setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
            setMessage("");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <div className="card shadow">
                <div className="card-header bg-warning text-dark text-center">
                    <h4>Quên mật khẩu</h4>
                </div>
                <div className="card-body">
                    <p className="mb-3 text-muted">
                        Nhập địa chỉ email bạn đã đăng ký để nhận liên kết khôi phục mật khẩu.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Gửi liên kết khôi phục
                        </button>
                    </form>
                    {message && <div className="alert alert-success mt-3">{message}</div>}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </div>
            </div>
        </div>
    );
}
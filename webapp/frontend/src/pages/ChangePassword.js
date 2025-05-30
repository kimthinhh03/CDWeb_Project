import { useState } from "react";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu mới và xác nhận không khớp.");
            return;
        }

        // Giả lập gọi API backend
        try {
            // const response = await fetch('/api/change-password', {
            //   method: 'POST',
            //   body: JSON.stringify({ currentPassword, newPassword }),
            //   headers: { 'Content-Type': 'application/json' }
            // });
            // const result = await response.json();

            setMessage("Đổi mật khẩu thành công!");
        } catch (error) {
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="password"
                    placeholder="Mật khẩu hiện tại"
                    className="w-full border rounded-lg p-2"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    className="w-full border rounded-lg p-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    className="w-full border rounded-lg p-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Đổi mật khẩu
                </button>
                {message && <p className="text-center text-red-500">{message}</p>}
            </form>
        </div>
    );
}
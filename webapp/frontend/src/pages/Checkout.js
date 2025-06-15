// import { useState } from "react";
//
// export default function Checkout() {
//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         address: "",
//         paymentMethod: "cod",
//     });
//
//     const [message, setMessage] = useState("");
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm((prev) => ({ ...prev, [name]: value }));
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         const user = JSON.parse(localStorage.getItem("user"));
//         const token = localStorage.getItem("token");
//         const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
//
//         const items = cartItems.map(item => ({
//             masp: item.masp,
//             quantity: item.quantity,
//             unitPrice: item.price, // ✅ Đảm bảo item.price có giá trị
//         }));
//
//         const orderData = {
//             userId: user.id,
//             date: new Date().toISOString(),
//             items,
//             totalAmount: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
//             paymentMethod: form.paymentMethod.toUpperCase(),
//             status: "Chờ xác nhận"
//         };
//
//         try {
//             const res = await axios.post("http://localhost:8888/api/orders", orderData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//
//             console.log("Đặt hàng thành công:", res.data);
//             setMessage("Đặt hàng thành công!");
//
//             // 👉 Xoá giỏ hàng nếu muốn
//             localStorage.removeItem("cart");
//         } catch (err) {
//             console.error("Lỗi khi đặt hàng:", err);
//             setMessage("Đặt hàng thất bại. Vui lòng thử lại.");
//         }
//     };
//
//     return (
//         <div className="container mt-5">
//             <div className="card shadow-sm">
//                 <div className="card-header bg-primary text-white">
//                     <h3 className="mb-0">Thông tin đặt hàng</h3>
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <div className="mb-3">
//                             <label className="form-label">Họ và tên</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="name"
//                                 value={form.name}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//
//                         <div className="mb-3">
//                             <label className="form-label">Email</label>
//                             <input
//                                 type="email"
//                                 className="form-control"
//                                 name="email"
//                                 value={form.email}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//
//                         <div className="mb-3">
//                             <label className="form-label">Số điện thoại</label>
//                             <input
//                                 type="tel"
//                                 className="form-control"
//                                 name="phone"
//                                 value={form.phone}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//
//                         <div className="mb-3">
//                             <label className="form-label">Địa chỉ giao hàng</label>
//                             <textarea
//                                 className="form-control"
//                                 name="address"
//                                 value={form.address}
//                                 onChange={handleChange}
//                                 rows="3"
//                                 required
//                             />
//                         </div>
//
//                         <div className="mb-3">
//                             <label className="form-label">Phương thức thanh toán</label>
//                             <select
//                                 className="form-select"
//                                 name="paymentMethod"
//                                 value={form.paymentMethod}
//                                 onChange={handleChange}
//                             >
//                                 <option value="cod">Thanh toán khi nhận hàng (COD)</option>
//                                 <option value="bank">Chuyển khoản ngân hàng</option>
//                                 <option value="credit">Thẻ tín dụng/Ghi nợ</option>
//                             </select>
//                         </div>
//
//                         <button type="submit" className="btn btn-success w-100">
//                             Xác nhận đặt hàng
//                         </button>
//
//                         {message && (
//                             <div className="alert alert-success mt-3 text-center">
//                                 {message}
//                             </div>
//                         )}
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }
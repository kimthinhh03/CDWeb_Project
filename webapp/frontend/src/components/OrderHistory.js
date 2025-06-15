import React, { useEffect, useState } from "react";
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Typography,
    CircularProgress
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const OrderHistory = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (user && token) {
            axios
                .get(`http://localhost:8888/api/orders/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((res) => {
                    let data = res.data;

                    if (typeof data === "string") {
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            console.error("Lỗi khi parse JSON từ res.data:", e);
                            data = [];
                        }
                    }

                    if (Array.isArray(data)) {
                        setOrders(data);
                    } else {
                        console.warn("Dữ liệu không đúng định dạng mảng:", data);
                        setOrders([]);
                    }
                })
                .catch((err) => {
                    console.error("Lỗi khi tải lịch sử đơn hàng:", err);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const renderStatusChip = (status) => {
        let color = "default";
        switch (status) {
            case "Đã huỷ":
            case "Cancelled":
                color = "error";
                break;
            case "Chờ nhận hàng":
            case "Pending":
                color = "warning";
                break;
            case "Thành công":
            case "Completed":
                color = "success";
                break;
            default:
                color = "default";
        }
        return <Chip label={t(`order.status.${status}`)} color={color} variant="outlined" />;
    };

    return (
        <TableContainer component={Paper} className="my-5 shadow-lg rounded-lg">
            <Typography variant="h6" className="p-4">{t("order.title")}</Typography>

            {loading ? (
                <div className="flex justify-center py-10">
                    <CircularProgress />
                </div>
            ) : orders.length === 0 ? (
                <Typography className="text-center py-8">{t("order.noOrders")}</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>{t("order.date")}</strong></TableCell>
                            <TableCell><strong>{t("order.items")}</strong></TableCell>
                            <TableCell><strong>{t("order.total")}</strong></TableCell>
                            <TableCell><strong>{t("order.status.label")}</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{new Date(order.orderDate).toLocaleString("vi-VN")}</TableCell>
                                <TableCell>
                                    {order.items.map((i, idx2) => (
                                        <div key={idx2}>
                                            {i.product?.tensp || t("order.productUnknown")} x {i.quantity}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>{Number(order.totalAmount).toLocaleString("vi-VN")}₫</TableCell>
                                <TableCell>{renderStatusChip(order.status)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
};

export default OrderHistory;

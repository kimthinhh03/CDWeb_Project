import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableCell, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';

export default function UpdateHistoryPage() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get('/api/history')
            .then(res => {
                // const data = [...res.data];
                console.log("📜 Lịch sử trả về:", res.data);
                setHistory(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Lịch sử cập nhật</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tên admin</TableCell>
                        <TableCell>Hành động</TableCell>
                        <TableCell>Chi tiết</TableCell>
                        <TableCell>Thời gian</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {history.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.username}</TableCell>
                            <TableCell>{item.actionType}</TableCell>
                            <TableCell>{item.details || '—'}</TableCell>
                            <TableCell>{new Date(item.updatedAt).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

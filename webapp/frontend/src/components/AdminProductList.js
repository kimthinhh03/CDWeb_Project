import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Avatar, IconButton, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AdminProductList = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        axios.get('/api/product/all')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        axios.delete(`/api/product/${selectedProduct.masp}`)
            .then(() => {
                setProducts(products.filter(p => p.masp !== selectedProduct.masp));
                setDeleteDialogOpen(false);
                setSelectedProduct(null);
            })
            .catch(err => {
                console.error(err);
                setDeleteDialogOpen(false);
            });
    };

    return (
        <TableContainer component={Paper} className="table-wrapper">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t("image")}</TableCell>
                        <TableCell>{t("productName")}</TableCell>
                        <TableCell>{t("price")}</TableCell>
                        <TableCell>{t("stock")}</TableCell>
                        <TableCell>{t("status")}</TableCell>
                        <TableCell>{t("action")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.masp} hover>
                            <TableCell>
                                <Avatar
                                    src={`/img/${product.productDetail?.hinhanh}`}
                                    variant="square"
                                    sx={{ width: 56, height: 56 }}
                                />
                            </TableCell>
                            <TableCell>{product.productDetail?.tensp}</TableCell>
                            <TableCell>{product.price?.toLocaleString('vi-VN')} đ</TableCell>
                            <TableCell>{product.stockQuantity}</TableCell>
                            <TableCell>
                                <span style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    color: product.stockQuantity > 0 ? green[600] : red[600]
                                }}>
                                    <span style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: product.stockQuantity > 0 ? green[500] : red[500]
                                    }} />
                                    {product.stockQuantity > 0 ? t('inStock') : t('outOfStock')}
                                </span>
                            </TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={() => alert("Chỉnh sửa chưa được triển khai")}> <Edit /> </IconButton>
                                <IconButton color="error" onClick={() => handleDeleteClick(product)}> <Delete /> </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>{t('confirmDeleteTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('confirmDeleteMessage')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>{t('cancel')}</Button>
                    <Button onClick={handleConfirmDelete} color="error">{t('confirm')}</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
};

export default AdminProductList;

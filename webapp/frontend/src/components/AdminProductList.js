import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Avatar, IconButton, Typography, Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, TableSortLabel, TextField,
    TablePagination, Select, MenuItem, FormControl, InputLabel, Grid
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AdminProductList = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [confirmEditOpen, setConfirmEditOpen] = useState(false);
    const [confirmExitOpen, setConfirmExitOpen] = useState(false);
    const [editedProduct, setEditedProduct] = useState({});
    const [isAddMode, setIsAddMode] = useState(false);
    const [orderBy, setOrderBy] = useState('tensp');
    const [orderDirection, setOrderDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        axios.get('/api/product/all', { params: { lang: 'vi' } })
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

    const handleSort = (field) => {
        const isAsc = orderBy === field && orderDirection === 'asc';
        setOrderBy(field);
        setOrderDirection(isAsc ? 'desc' : 'asc');
    };

    const handleEditClick = (product) => {
        setEditedProduct({ ...product });
        setIsAddMode(false);
        setEditDialogOpen(true);
    };

    const handleAddClick = () => {
        setEditedProduct({});
        setIsAddMode(true);
        setEditDialogOpen(true);
    };

    const handleEditChange = (field, value) => {
        setEditedProduct(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleExitEdit = () => {
        setConfirmExitOpen(true);
    };

    const handleConfirmEdit = () => {
        setConfirmEditOpen(true);
    };

    const applyEdit = () => {
        const username = localStorage.getItem('username');

        if (!username) {
            console.error("Không có username trong localStorage. Hãy đăng nhập lại.");
            alert("Lỗi: Không xác định được người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        const url = isAddMode
            ? `/api/product?username=${username}`
            : `/api/product/${editedProduct.masp}?username=${username}`;
        const method = isAddMode ? axios.post : axios.put;

        const productToSend = { ...editedProduct };

        console.log("Dữ liệu gửi:", productToSend);
        console.log("Gửi đến:", url);

        method(url, productToSend)
            .then((response) => {
                if (isAddMode) {
                    setProducts(prev => [...prev, response.data || productToSend]); // dùng response.data nếu API trả về sản phẩm mới
                } else {
                    setProducts(prev =>
                        prev.map(p =>
                            p.masp === productToSend.masp ? { ...p, ...productToSend } : p
                        )
                    );
                }
                
                axios.get('/api/product/all', { params: { lang: 'vi' } }).then(res => setProducts(res.data));

                setConfirmEditOpen(false);
                setEditDialogOpen(false);
            })
            .catch(err => {
                console.error("Lỗi cập nhật sản phẩm:", err);
                alert("Cập nhật thất bại. Vui lòng thử lại.");
            });
    };

    const filteredProducts = products.filter(product => {
        const name = product.tensp?.toLowerCase() || '';
        const matchesSearch = name.includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'inStock' && product.stockQuantity > 0) ||
            (statusFilter === 'outOfStock' && product.stockQuantity <= 0);
        const matchesCategory =
            categoryFilter === 'all' ||
            product.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const getValue = (obj, key) => {
            if (key === 'tensp') return obj.tensp || '';
            if (key === 'price') return obj.price || 0;
            if (key === 'stockQuantity') return obj.stockQuantity || 0;
            return '';
        };
        const valueA = getValue(a, orderBy);
        const valueB = getValue(b, orderBy);
        return orderDirection === 'asc'
            ? valueA > valueB ? 1 : -1
            : valueA < valueB ? 1 : -1;
    });

    const paginatedProducts = sortedProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    // Hoàn tác cập nhật sản phẩm
    const undoUpdate = (id) => {
        axios.post(`/api/product/undo/${id}`)
            .then(() => alert("Hoàn tác thành công!"))
            .catch(err => console.error("Lỗi khi hoàn tác:", err));
    };
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                    <TextField
                        label={t('search')}
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FormControl size="small">
                        <InputLabel>{t('status')}</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label={t('status')}
                        >
                            <MenuItem value="all">{t('all')}</MenuItem>
                            <MenuItem value="inStock">{t('inStock')}</MenuItem>
                            <MenuItem value="outOfStock">{t('outOfStock')}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <InputLabel>{t('category')}</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            label={t('category')}
                        >
                            <MenuItem value="all">{t('all')}</MenuItem>
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>{t('addProduct')}</Button>
            </div>

            <TableContainer component={Paper} className="table-wrapper">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ minWidth: 120 }}>{t("image")}</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'tensp'}
                                    direction={orderDirection}
                                    onClick={() => handleSort('tensp')}
                                >
                                    {t("productName")}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'price'}
                                    direction={orderDirection}
                                    onClick={() => handleSort('price')}
                                >
                                    {t("price")}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'stockQuantity'}
                                    direction={orderDirection}
                                    onClick={() => handleSort('stockQuantity')}
                                >
                                    {t("stock")}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>{t("status")}</TableCell>
                            <TableCell>{t("action")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProducts.map((product) => (
                            <TableRow key={product.masp} hover>
                                <TableCell>
                                    <Avatar
                                        src={`http://localhost:3000/img/${product.hinhanh}`}
                                        variant="square"
                                        sx={{ width: 56, height: 56 }}
                                    />
                                </TableCell>
                                <TableCell>{product.tensp}</TableCell>
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
                                    <IconButton color="primary" onClick={() => handleEditClick(product)}> <Edit /> </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteClick(product)}> <Delete /> </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={sortedProducts.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </TableContainer>

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

            <Dialog open={editDialogOpen} onClose={handleExitEdit} maxWidth="sm" fullWidth>
                <DialogTitle>{isAddMode ? t('addProduct') : t('editProduct')}</DialogTitle>
                <DialogContent>
                    <TextField label="Tên sản phẩm" fullWidth margin="dense" value={editedProduct.tensp || ''} onChange={(e) => handleEditChange('tensp', e.target.value)} />
                    <TextField label="Tên hình ảnh" fullWidth margin="dense" value={editedProduct.hinhanh || ''} onChange={(e) => handleEditChange('hinhanh', e.target.value)} />
                    <TextField label="Giá" type="number" fullWidth margin="dense" value={editedProduct.price || ''} onChange={(e) => handleEditChange('price', e.target.value)} />
                    <TextField label="Đơn vị" fullWidth margin="dense" value={editedProduct.unit || ''} onChange={(e) => handleEditChange('unit', e.target.value)} />
                    <TextField label="Số lượng" type="number" fullWidth margin="dense" value={editedProduct.stockQuantity || ''} onChange={(e) => handleEditChange('stockQuantity', e.target.value)} />
                    <TextField label="Danh mục" fullWidth margin="dense" value={editedProduct.category || ''} onChange={(e) => handleEditChange('category', e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleExitEdit}>{t('cancel')}</Button>
                    <Button variant="contained" onClick={handleConfirmEdit}>{t('confirm')}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmExitOpen} onClose={() => setConfirmExitOpen(false)}>
                <DialogTitle>{t('exitConfirmation')}</DialogTitle>
                <DialogContentText sx={{ padding: 2 }}>{t('exitConfirmationText')}</DialogContentText>
                <DialogActions>
                    <Button onClick={() => setConfirmExitOpen(false)}>{t('continueEditing')}</Button>
                    <Button onClick={() => {
                        setEditDialogOpen(false);
                        setConfirmExitOpen(false);
                    }}>{t('agree')}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmEditOpen} onClose={() => setConfirmEditOpen(false)}>
                <DialogTitle>{t('confirmEditTitle')}</DialogTitle>
                <DialogContentText sx={{ padding: 2 }}>{t('confirmEditText')}</DialogContentText>
                <DialogActions>
                    <Button onClick={() => setConfirmEditOpen(false)}>{t('reject')}</Button>
                    <Button onClick={applyEdit} variant="contained">{t('confirm')}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminProductList;

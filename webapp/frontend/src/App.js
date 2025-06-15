import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './pages/ProductList';
import ProductDescription from './pages/ProductDescription';
import ShowListProduct from './pages/ShowListProduct';
import LookUp from './components/LookUp';
import Banner from './components/Banner';
import NewProducts from './components/NewProducts';
import Cosmestic from './components/Cosmestic';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Cart from './components/Cart';
import AdminProductList from './components/AdminProductList';
import AdminRoute from './components/AdminRoute';
import UpdateHistoryPage from './components/UpdateHistoryPage';
import Checkout from "./components/Checkout";

import { CartProvider } from './contexts/CartContext';
import { ToastContainer } from 'react-toastify';

import './App.css';
import OrderHistory from "./components/OrderHistory";



const App = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            console.log('Parsed user:', parsed);
            setUser(parsed);
        } else {
            setUser(null);
        }
    }, [location.pathname]);

    return (
        <>
            <Header user={user} />
            <CartProvider>
                <main className="bg-gray-50 py-4">
                    <div className="max-w-7xl mx-auto px-4">
                    {location.pathname === '/' && <Banner />}
                    {location.pathname === '/' && <NewProducts />}
                    {location.pathname === '/' && <Cosmestic />}

                    <Routes>
                        <Route path="/signin" element={<SignIn setUser={setUser} />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/" element={<ProductList />} />
                        <Route path="/product/:productID" element={<ProductDescription />} />
                        <Route path="/products" element={<ShowListProduct />} />
                        <Route path="/products/category/:category" element={<ShowListProduct />} />
                        <Route path="/lookup" element={<LookUp />} />
                        <Route
                            path="/admin/products"
                            element={
                                <AdminRoute>
                                    <AdminProductList />
                                </AdminRoute>
                            }
                        />
                        <Route path="/admin/update-history" element={<UpdateHistoryPage />} />
                        <Route path="/checkout" element={<Checkout/>} />
                        <Route path="/orders" element={<OrderHistory />} />
                    </Routes>
                    </div>
                </main>
            </CartProvider>
            <Footer />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                pauseOnHover
                draggable
                theme="colored"
                style={{ marginTop: '80px' }}
            />
        </>
    );
};

export default App;

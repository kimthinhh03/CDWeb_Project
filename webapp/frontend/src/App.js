import React, {useEffect, useState} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './pages/ProductList';
import ProductDescription from './pages/ProductDescription';
import NewProducts from './components/NewProducts';
import ShowListProduct from "./pages/ShowListProduct";
import LookUp from './components/LookUp';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {Route, Routes, useLocation} from "react-router-dom";
import Banner from "./components/Banner";
import Cosmestic from "./components/Cosmestic";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Cart from './components/Cart';
import { CartProvider } from './contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminProductList from './components/AdminProductList';
import AdminRoute from './components/AdminRoute';

const App = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // setUser(JSON.parse(storedUser));
            const parsed = JSON.parse(storedUser);
            console.log("Parsed user:", parsed);
            setUser(parsed);
        } else {
            setUser(null);
            }
    },  [location.pathname]);
    return (
        <>
            <Header user={user} />
            <CartProvider>
            <main className="container mt-4">
            {/*<main>*/}
                {/* eslint-disable-next-line no-restricted-globals */}
                {location.pathname === "/" && <Banner />}
                {location.pathname === "/" && <NewProducts />}
                {location.pathname === "/" && <Cosmestic />}
                <Routes>
                    <Route path="/signin" element={<SignIn setUser={setUser} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/" element={<ProductList />} />
                    <Route path="/product/:productID" element={<ProductDescription />} />
                    <Route path="/products" element={<ShowListProduct />} />
                    <Route path="/products/category/:category" element={<ShowListProduct />} />
                    <Route path="/lookup" element={<LookUp />} />
                    <Route path="/admin/products" element={
                        <AdminRoute>
                            <AdminProductList />
                        </AdminRoute>
                    } />
                </Routes>
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
                style={{ marginTop: "80px" }}
            />
        </>
    );
};

export default App;

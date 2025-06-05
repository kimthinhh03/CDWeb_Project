import React from 'react';
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

const App = () => {
    const location = useLocation();
    return (
        <>
            <Header />
            <main className="container mt-4">
            {/*<main>*/}
                {/* eslint-disable-next-line no-restricted-globals */}
                {location.pathname === "/" && <Banner />}
                {location.pathname === "/" && <NewProducts />}
                {location.pathname === "/" && <Cosmestic />}
                <Routes>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/" element={<ProductList />} />
                    <Route path="/product/:productID" element={<ProductDescription />} />
                    <Route path="/products" element={<ShowListProduct />} />
                    <Route path="/products/category/:category" element={<ShowListProduct />} />
                    <Route path="/lookup" element={<LookUp />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
};

export default App;

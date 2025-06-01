import axios from "axios";

const apiClient = axios.create({
    // baseURL: process.env.REACT_APP_API_URL || "http://localhost:8888",
    baseURL: "/",
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
    }
});

const productApi = {
    getAllProducts() {
        return apiClient.get("/api/product/all");
    },

    getProductById(id) {
        return apiClient.get(`/api/product/${id}`);
    },

    getRandomProducts(limit = 4, lang = 'vi') {
        return apiClient.get("/api/product/random", {
            params: { limit, lang }
        });
    },

    getProductsByCategory(category) {
        return apiClient.get(`/api/product/category/${category}`);
    },

    searchProducts(keyword) {
        return apiClient.get("/api/product/search", {
            params: { name: keyword }
        });
    }
};

export default productApi;
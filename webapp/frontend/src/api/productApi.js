import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
    timeout: 10000,
    withCredentials: true
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAllProducts() {
        return apiClient.get("/api/product/all");
    },
    getProductById() {
        return apiClient.get("/api/poduct/{id}")
    },
    getRandomProducts: (limit = 4, lang = 'vi') =>
        axios.get(`/api/product/random?limit=${limit}&lang=${lang}`),
    getProductsByCategory() {
        return apiClient.get(`/api/product/category/{category}`);
    },
    searchProducts(keyword) {
        return apiClient.get(`/api/product/search`, {
            params: { name: keyword }
        });
    }
};
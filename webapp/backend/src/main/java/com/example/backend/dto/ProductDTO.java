package com.example.backend.dto;

import com.example.backend.model.Product;

public class ProductDTO {
    private String masp;
    private String tensp;
    private String hinhanh;
    private String nhacungcap;
    private String mota;
    private String category;
    private Double price;
    private String unit;
    private Integer stockQuantity;

    // Constructor
    public ProductDTO(Product product) {
        this.masp = product.getMasp();
        this.hinhanh = product.getHinhanh();
        this.nhacungcap = product.getNhacungcap();
        this.mota = product.getMota();
        this.category = product.getCategory();
        this.price = product.getPrice();
        this.unit = product.getUnit();
        this.stockQuantity = product.getStockQuantity();
    }

    public void setTensp(String name) {
        this.tensp = name;
    }

    public String getMasp() {
        return masp;
    }

    public void setMasp(String masp) {
        this.masp = masp;
    }

    public String getTensp() {
        return tensp;
    }

    public String getHinhanh() {
        return hinhanh;
    }

    public void setHinhanh(String hinhanh) {
        this.hinhanh = hinhanh;
    }

    public String getNhacungcap() {
        return nhacungcap;
    }

    public void setNhacungcap(String nhacungcap) {
        this.nhacungcap = nhacungcap;
    }

    public String getMota() {
        return mota;
    }

    public void setMota(String mota) {
        this.mota = mota;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}

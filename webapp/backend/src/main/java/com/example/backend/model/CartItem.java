//package com.example.backend.model;
//
//import jakarta.persistence.*;
//import java.io.Serializable;
//
//@Entity
//@Table(name = "CTSANPHAM")
//public class  CartItem implements Serializable {
//
//    @Id
//    @Column(name = "MaSP")
//    private String maSP;
//
//    @Column(name = "LoaiSP")
//    private String typeProduct;
//
//    @Column(name = "Gia")
//    private long price;
//
//    @Column(name = "DonViTinh")
//    private String unit;
//
//    @Column(name = "Soluong")
//    private int quantity;
//
//    public CartItem() {}
//
//    public CartItem(String maSP, String typeProduct, long price, String unit, int quantity) {
//        this.maSP = maSP;
//        this.typeProduct = typeProduct;
//        this.price = price;
//        this.unit = unit;
//        this.quantity = quantity;
//    }
//
//    public String getMaSP() {
//        return maSP;
//    }
//
//    public void setMaSP(String maSP) {
//        this.maSP = maSP;
//    }
//
//    public String getTypeProduct() {
//        return typeProduct;
//    }
//
//    public void setTypeProduct(String typeProduct) {
//        this.typeProduct = typeProduct;
//    }
//
//    public long getPrice() {
//        return price;
//    }
//
//    public void setPrice(long price) {
//        this.price = price;
//    }
//
//    public String getUnit() {
//        return unit;
//    }
//
//    public void setUnit(String unit) {
//        this.unit = unit;
//    }
//
//    public int getQuantity() {
//        return quantity;
//    }
//
//    public void setQuantity(int quantity) {
//        this.quantity = quantity;
//    }
//
//    public long getTotalMoney() {
//        return price * quantity;
//    }
//}

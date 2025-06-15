package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "chitietsanpham")
@SecondaryTable(
        name = "sanpham",
        pkJoinColumns = @PrimaryKeyJoinColumn(name = "masp")
)
public class Product implements Serializable {

    @Id
    @Column(name = "masp")
    private String masp;

    @Column(name = "tensp", table = "sanpham")
    private String tensp;

    @Column(name = "hinhanh", table = "sanpham")
    private String hinhanh;

    @Column(name = "nhacungcap", table = "sanpham")
    private String nhacungcap;

    @Column(name = "mota", table = "sanpham", length = 2000)
    private String mota;

    @Column(name = "category")
    private String category;

    @Column(name = "price")
    private Double price;

    @Column(name = "unit")
    private String unit;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;


    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    @JsonIgnore
    private List<ProductTranslation> translations;

    public Product() {}

    public Product(Product other) {
        this.masp = other.masp;
        this.tensp = other.tensp;
        this.hinhanh = other.hinhanh;
        this.nhacungcap = other.nhacungcap;
        this.mota = other.mota;
        this.category = other.category;
        this.price = other.price;
        this.unit = other.unit;
        this.stockQuantity = other.stockQuantity;

        // Deep copy danh sách translation
        this.translations = (other.translations != null) ?
                other.translations.stream()
                        .map(ProductTranslation::new)
                        .collect(Collectors.toList())
                : null;
    }
}

package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sanpham")
public class ProductDetail {

    @Id
    @Column(name = "masp")
    private String masp;

    @Column(name = "tensp")
    private String tensp;

    @Column(name = "hinhanh")
    private String hinhanh;

    @Column(name = "nhacungcap")
    private String nhacungcap;

    @Column(name = "mota")
    private String mota;

    @Setter
    @Getter
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "masp", referencedColumnName = "masp", insertable = false, updatable = false)
    private List<ProductTranslation> translations;

}

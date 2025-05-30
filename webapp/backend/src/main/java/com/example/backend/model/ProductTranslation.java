package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product_translation")
public class ProductTranslation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String masp;
    private String lang;
    private String name;



    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "masp", referencedColumnName = "masp", insertable = false, updatable = false)
    private Product product;


}

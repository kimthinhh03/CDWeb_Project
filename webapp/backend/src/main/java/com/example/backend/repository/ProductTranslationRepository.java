package com.example.backend.repository;

import com.example.backend.model.ProductTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductTranslationRepository extends JpaRepository<ProductTranslation, Long> {
    Optional<ProductTranslation> findByMaspAndLang(String masp, String lang);
    List<ProductTranslation> findByMaspInAndLang(List<String> masp, String lang);
}

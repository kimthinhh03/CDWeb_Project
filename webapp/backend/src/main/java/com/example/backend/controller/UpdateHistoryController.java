package com.example.backend.controller;

import com.example.backend.model.Product;
import com.example.backend.model.UpdateHistory;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UpdateHistoryRepository;
import com.example.backend.service.ProductService;
import com.example.backend.service.UpdateHistoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/history")
public class UpdateHistoryController {

    @Autowired
    private UpdateHistoryService updateHistoryService;

    @Autowired
    private UpdateHistoryRepository updateHistoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<UpdateHistory>> getAllHistories() {
        return ResponseEntity.ok(updateHistoryService.getAllHistories());
    }

    @PostMapping("/undo/{historyId}")
    public ResponseEntity<?> undoUpdate(@PathVariable Long historyId) {
        Optional<UpdateHistory> opt = updateHistoryRepository.findById(historyId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        UpdateHistory history = opt.get();
        if (!"UPDATE".equalsIgnoreCase(history.getActionType()) || history.getOldData() == null) {
            return ResponseEntity.badRequest().body("Không thể hoàn tác cập nhật này");
        }

        try {
            Product oldProduct = objectMapper.readValue(history.getOldData(), Product.class);
            productRepository.save(oldProduct);

            productService.logHistory(
                    "admin01",
                    "UNDO",
                    oldProduct.getMasp(),
                    oldProduct,
                    null
            );

            return ResponseEntity.ok("Hoàn tác thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi hoàn tác");
        }
    }
}
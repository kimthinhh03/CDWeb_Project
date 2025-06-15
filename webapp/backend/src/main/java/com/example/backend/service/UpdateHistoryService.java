package com.example.backend.service;

import com.example.backend.model.Product;
import com.example.backend.model.UpdateHistory;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UpdateHistoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UpdateHistoryService {

    @Autowired
    private UpdateHistoryRepository updateHistoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;
    @PersistenceContext
    private EntityManager entityManager;
    public void logHistory(String username, String actionType, String masp, Product oldData, Product newData) {
        try {
            UpdateHistory history = new UpdateHistory();
            history.setUsername(username);
            history.setActionType(actionType);
            history.setMasp(masp);
            history.setUpdatedAt(LocalDateTime.now());

            String oldJson = oldData != null ? objectMapper.writeValueAsString(oldData) : "";
            String newJson = newData != null ? objectMapper.writeValueAsString(newData) : "";

            // Nếu là UPDATE và dữ liệu không khác nhau, không ghi log
//            if ("UPDATE".equalsIgnoreCase(actionType) && oldJson.equals(newJson)) {
//                System.out.println("Không có thay đổi nào với sản phẩm " + masp);
//                return;
//            }

            if (oldData != null) {
                history.setOldData(objectMapper.writeValueAsString(oldData));
            }
            if (newData != null) {
                history.setNewData(objectMapper.writeValueAsString(newData));
            }

            StringBuilder details = new StringBuilder("Hành động: ").append(actionType).append(" sản phẩm ").append(masp);
            boolean changed = false;

            if ("UPDATE".equalsIgnoreCase(actionType) && oldData != null && newData != null) {
                if (oldData.getTensp() != null && newData.getTensp() != null &&
                        !oldData.getTensp().equals(newData.getTensp())) {
                    details.append(" | Tên: ").append(oldData.getTensp()).append(" → ").append(newData.getTensp());
                    changed = true;
                }

                if (oldData.getPrice() != null && newData.getPrice() != null &&
                        !oldData.getPrice().equals(newData.getPrice())) {
                    details.append(" | Giá: ").append(oldData.getPrice()).append(" → ").append(newData.getPrice());
                    changed = true;
                }

                if (oldData.getStockQuantity() != null && newData.getStockQuantity() != null &&
                        !oldData.getStockQuantity().equals(newData.getStockQuantity())) {
                    details.append(" | SL: ").append(oldData.getStockQuantity()).append(" → ").append(newData.getStockQuantity());
                    changed = true;
                }

                if (oldData.getUnit() != null && newData.getUnit() != null &&
                        !oldData.getUnit().equals(newData.getUnit())) {
                    details.append(" | Đơn vị: ").append(oldData.getUnit()).append(" → ").append(newData.getUnit());
                    changed = true;
                }

                if (oldData.getCategory() != null && newData.getCategory() != null &&
                        !oldData.getCategory().equals(newData.getCategory())) {
                    details.append(" | Danh mục: ").append(oldData.getCategory()).append(" → ").append(newData.getCategory());
                    changed = true;
                }

                if (!changed) {
                    details.append(" - không có thay đổi nào.");
                }

            } else if ("UNDO".equalsIgnoreCase(actionType)) {
                details.append(" - hoàn tác cập nhật về phiên bản trước.");
            } else if ("DELETE".equalsIgnoreCase(actionType)) {
                details.append(" - đã xoá sản phẩm.");
            } else if ("CREATE".equalsIgnoreCase(actionType)) {
                details.append(" - đã thêm sản phẩm mới.");
            }

            history.setDetails(details.toString());

            updateHistoryRepository.save(history);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Transactional
    public Product updateProduct(String masp, Product updatedProduct, String username) {
        System.out.println(">>> Đã vào hàm logHistory()");

        // Lấy bản ghi hiện tại từ DB
        Product existing = productRepository.findById(masp)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm: " + masp));

        // Clone lại bản cũ để lưu vào lịch sử
        Product oldCopy = new Product(existing);

        // Cập nhật các trường ở bảng phụ `sanpham` (giả định đây là native SQL)
        productRepository.updateSanphamFields(
                updatedProduct.getTensp(),
                updatedProduct.getHinhanh(),
                updatedProduct.getNhacungcap(),
                updatedProduct.getMota(),
                masp
        );

        // Đồng bộ lại entity sau khi update bằng native query
        entityManager.flush();             // Đẩy thay đổi xuống DB
        entityManager.refresh(existing);   // Cập nhật lại từ DB, tránh cache lỗi

        // Cập nhật các trường ở bảng chính `chitietsanpham`
        existing.setPrice(updatedProduct.getPrice());
        existing.setStockQuantity(updatedProduct.getStockQuantity());
        existing.setUnit(updatedProduct.getUnit());
        existing.setCategory(updatedProduct.getCategory());

        // Lưu lại bản ghi đã cập nhật
        Product saved = productRepository.save(existing);

        // Ghi lịch sử thay đổi
        logHistory(username, "UPDATE", masp, oldCopy, saved);

        return saved;
    }

    public List<UpdateHistory> getAllHistories() {
        return updateHistoryRepository.findAll(Sort.by(Sort.Direction.DESC, "updatedAt"));
    }
    public List<UpdateHistory> filterHistories(String username, String actionType, String masp) {
        return updateHistoryRepository.findAll((Specification<UpdateHistory>) (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (username != null && !username.isEmpty()) {
                predicates.add(cb.equal(root.get("username"), username));
            }

            if (actionType != null && !actionType.isEmpty()) {
                predicates.add(cb.equal(cb.upper(root.get("actionType")), actionType.toUpperCase()));
            }

            if (masp != null && !masp.isEmpty()) {
                predicates.add(cb.equal(root.get("masp"), masp));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        }, Sort.by(Sort.Direction.DESC, "updatedAt"));
    }
}

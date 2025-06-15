package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "update_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String actionType;

    @Column(length = 3000)
    private String details;

    private String masp;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "old_data", columnDefinition = "TEXT")
    private String oldData; // lưu chuỗi JSON của bản ghi cũ để hoàn tác

    @Column(columnDefinition = "TEXT")
    private String newData;
}

package com.example.backend.repository;

import com.example.backend.model.UpdateHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpdateHistoryRepository extends JpaRepository<UpdateHistory, Long> {
}


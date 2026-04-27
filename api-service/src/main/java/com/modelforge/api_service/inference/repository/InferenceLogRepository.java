package com.modelforge.api_service.inference.repository;

import com.modelforge.api_service.inference.entity.InferenceLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;
import java.util.List;

public interface InferenceLogRepository extends JpaRepository<InferenceLog, Long> {

    Page<InferenceLog> findByModelIdOrderByCalledAtDesc(UUID modelId, Pageable pageable);

    @Query("SELECT COUNT(l) FROM InferenceLog l WHERE l.model.id = :modelId")
    Long countByModelId(UUID modelId);

    @Query("SELECT COUNT(l) FROM InferenceLog l WHERE l.model.id = :modelId AND l.status = 'SUCCESS'")
    Long countSuccessByModelId(UUID modelId);

    @Query("SELECT AVG(l.latencyMs) FROM InferenceLog l WHERE l.model.id = :modelId AND l.status = 'SUCCESS'")
    Double avgLatencyByModelId(UUID modelId);

    @Query("SELECT l FROM InferenceLog l JOIN FETCH l.version WHERE l.model.id = :modelId ORDER BY l.calledAt DESC")
    List<InferenceLog> findLogsWithVersion(UUID modelId, Pageable pageable);
}
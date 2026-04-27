package com.modelforge.api_service.model.repository;

import com.modelforge.api_service.model.entity.ModelVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.UUID;

public interface ModelVersionRepository extends JpaRepository<ModelVersion, UUID> {

    Optional<ModelVersion> findByModelIdAndIsLatestTrue(UUID modelId);

    @Query("SELECT COALESCE(MAX(v.versionNumber), 0) FROM ModelVersion v WHERE v.model.id = :modelId")
    Integer findMaxVersionNumber(UUID modelId);

    @Modifying
    @Query("UPDATE ModelVersion v SET v.isLatest = false WHERE v.model.id = :modelId")
    void markAllAsNotLatest(UUID modelId);
}
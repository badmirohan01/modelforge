package com.modelforge.api_service.apikey.repository;

import com.modelforge.api_service.apikey.entity.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApiKeyRepository extends JpaRepository<ApiKey, UUID> {

    Optional<ApiKey> findByKeyHashAndIsActiveTrue(String keyHash);

    List<ApiKey> findByOwnerEmailOrderByCreatedAtDesc(String email);

    List<ApiKey> findByModelIdOrderByCreatedAtDesc(UUID modelId);

    @Modifying
    @Query("UPDATE ApiKey k SET k.lastUsedAt = :time WHERE k.id = :id")
    void updateLastUsedAt(UUID id, LocalDateTime time);
}
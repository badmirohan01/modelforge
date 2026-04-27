package com.modelforge.api_service.model.repository;

import com.modelforge.api_service.model.entity.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ModelRepository extends JpaRepository<Model, UUID> {
    List<Model> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}
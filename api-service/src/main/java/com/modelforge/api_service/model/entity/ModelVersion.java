package com.modelforge.api_service.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "model_versions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModelVersion {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private Model model;

    @Column(nullable = false)
    private Integer versionNumber;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private boolean isLatest = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
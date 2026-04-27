package com.modelforge.api_service.inference.entity;

import com.modelforge.api_service.model.entity.Model;
import com.modelforge.api_service.model.entity.ModelVersion;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inference_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InferenceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private Model model;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "version_id", nullable = false)
    private ModelVersion version;

    @Column(nullable = false)
    private String status;

    private Double latencyMs;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @Column(nullable = false)
    private LocalDateTime calledAt;

    @PrePersist
    protected void onCreate() {
        calledAt = LocalDateTime.now();
    }
}
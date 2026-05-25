package com.modelforge.api_service.apikey.entity;

import com.modelforge.api_service.model.entity.Model;
import com.modelforge.api_service.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "api_keys")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = true)
    private Model model;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "api_key_models", joinColumns = @JoinColumn(name = "api_key_id"), inverseJoinColumns = @JoinColumn(name = "model_id"))
    private Set<Model> models = new HashSet<>();

    @Column(nullable = false)
    private boolean isGlobal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = true)
    private User owner;

    @Column(nullable = false)
    private String keyHash;

    @Column(nullable = false)
    private String label;

    private LocalDateTime lastUsedAt;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
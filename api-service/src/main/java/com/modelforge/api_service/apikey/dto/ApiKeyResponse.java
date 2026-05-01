package com.modelforge.api_service.apikey.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ApiKeyResponse {
    private UUID id;
    private UUID modelId;
    private String label;
    private String rawKey;      // only populated on creation, null after
    private boolean isActive;
    private LocalDateTime lastUsedAt;
    private LocalDateTime createdAt;
}
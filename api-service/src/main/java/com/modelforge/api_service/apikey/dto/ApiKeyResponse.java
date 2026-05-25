package com.modelforge.api_service.apikey.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Data
@Builder
public class ApiKeyResponse {
    private UUID id;
    private String label;
    private String rawKey;
    private List<UUID> modelIds;

    @JsonProperty("isGlobal")
    private boolean isGlobal;

    @JsonProperty("isActive")
    private boolean isActive;

    private LocalDateTime lastUsedAt;
    private LocalDateTime createdAt;
}
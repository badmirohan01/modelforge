package com.modelforge.api_service.model.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ModelResponse {
    private UUID id;
    private String name;
    private String description;
    private String inputSchema;
    private boolean isPublic;
    private LocalDateTime createdAt;
    private Integer latestVersion;
    private UUID latestVersionId;
    private String inferEndpoint;
}
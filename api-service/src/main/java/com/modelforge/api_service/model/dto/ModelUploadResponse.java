package com.modelforge.api_service.model.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class ModelUploadResponse {
    private UUID modelId;
    private UUID versionId;
    private Integer versionNumber;
    private String name;
    private String inferEndpoint;
    private String message;
}
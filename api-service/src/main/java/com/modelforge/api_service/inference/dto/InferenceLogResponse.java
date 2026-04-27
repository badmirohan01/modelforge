package com.modelforge.api_service.inference.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class InferenceLogResponse {
    private Long id;
    private UUID modelId;
    private UUID versionId;
    private Integer versionNumber;
    private String status;
    private Double latencyMs;
    private String errorMessage;
    private LocalDateTime calledAt;
}
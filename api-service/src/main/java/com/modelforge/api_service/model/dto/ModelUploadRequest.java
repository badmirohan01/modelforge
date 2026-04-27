package com.modelforge.api_service.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ModelUploadRequest {

    @NotBlank(message = "Model name is required")
    private String name;

    private String description;

    private String inputSchema;
}